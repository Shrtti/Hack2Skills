import os
import logging
import uuid
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import vertexai
from vertexai.generative_models import GenerativeModel

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "wellform-ai")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")

try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = GenerativeModel("gemini-2.0-flash-exp")
    logger.info(f"Vertex AI initialized for project '{PROJECT_ID}'")
except Exception as e:
    logger.error(f"Failed to initialize Vertex AI: {e}")
    model = None

app = FastAPI(
    title="WellForm AI Assistant",
    description="Backend API for WellForm mental wellness platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MemoryManager:
    def __init__(self):
        self.conversations = {}
        self.user_profiles = {}
    
    def get_user_history(self, user_id: str) -> List[Dict[str, str]]:
        return self.conversations.get(user_id, [])
    
    def update_user_history(self, user_id: str, messages: List[Dict[str, str]]):
        if user_id not in self.conversations:
            self.conversations[user_id] = []
        self.conversations[user_id].extend(messages)
        if len(self.conversations[user_id]) > 50:
            self.conversations[user_id] = self.conversations[user_id][-30:]

class WellnessAgent:
    def __init__(self):
        self.system_prompt = """You are a compassionate AI wellness assistant.

Guidelines:
- Provide supportive, empathetic responses focused on mental wellness
- Never give medical advice or diagnoses
- Use evidence-based approaches like mindfulness, CBT techniques, and stress management
- Be warm, encouraging, and validate user emotions
- Ask thoughtful follow-up questions to understand better
- Suggest practical coping strategies when appropriate
- Recognize when professional help may be needed

Knowledge areas: mindfulness, anxiety management, stress reduction, sleep hygiene, emotional regulation, healthy relationships, self-care practices.

Always prioritize user safety and well-being."""

    def generate(self, prompt: str, history: List[Dict[str, str]] = None) -> str:
        if not model:
            return "I'm currently experiencing technical difficulties. Please try again later."
        
        try:
            conversation_context = ""
            if history:
                recent_history = history[-6:]
                for msg in recent_history:
                    role = "User" if msg["role"] == "user" else "Assistant"
                    conversation_context += f"{role}: {msg['content']}\n"
            
            full_prompt = f"{self.system_prompt}\n\nConversation history:\n{conversation_context}\nUser: {prompt}\nAssistant:"
            
            response = model.generate_content(
                full_prompt,
                generation_config={
                    "temperature": 0.7,
                    "max_output_tokens": 1024,
                }
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Agent generation error: {e}")
            return "I'm having trouble processing that right now. Could you try rephrasing your question?"

def detect_crisis(message: str) -> Optional[str]:
    crisis_keywords = [
        "kill myself", "suicide", "want to die", "end my life", "hopeless", 
        "self harm", "cut myself", "can't go on", "better off dead"
    ]
    
    text = message.lower()
    if any(keyword in text for keyword in crisis_keywords):
        return """I'm very concerned about what you've shared. You don't have to go through this alone.

Please reach out for immediate help:
US: Call or text 988 (Suicide & Crisis Lifeline)
UK: Call 116 123 (Samaritans)
Emergency: Call your local emergency number

You matter, and there are people who want to help. Please consider reaching out to a trusted friend, family member, or mental health professional."""
    
    return None

def moderate_content(content: str) -> bool:
    return True

memory_manager = MemoryManager()
agent = WellnessAgent()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_text(message)

manager = ConnectionManager()

class ChatRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1, max_length=5000)
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    status: str = "success"
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    suggestions: Optional[List[str]] = None
    crisis_detected: bool = False

class StreamChatRequest(BaseModel):
    user_id: str
    message: str
    session_id: Optional[str] = None

class MoodEntry(BaseModel):
    user_id: str
    mood_score: int = Field(..., ge=1, le=10)
    mood_tags: List[str] = []
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

@app.get("/")
async def root():
    return {
        "service": "WellForm AI Assistant",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "chat": "/api/chat",
            "stream": "/api/chat/stream", 
            "websocket": "/api/ws/{user_id}",
            "health": "/api/health",
            "mood": "/api/mood"
        }
    }

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="WellForm AI Service is running",
        version="1.0.0"
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Chat request from user: {request.user_id}")
        
        crisis_response = detect_crisis(request.message)
        if crisis_response:
            logger.warning(f"Crisis detected for user: {request.user_id}")
            response = ChatResponse(
                response=crisis_response,
                status="crisis",
                crisis_detected=True
            )
            
            background_tasks.add_task(
                memory_manager.update_user_history,
                request.user_id,
                [
                    {"role": "user", "content": request.message},
                    {"role": "assistant", "content": crisis_response}
                ]
            )
            return response
        
        history = memory_manager.get_user_history(request.user_id)
        
        try:
            ai_response = agent.generate(prompt=request.message, history=history)
        except Exception as e:
            logger.error(f"AI generation error: {e}")
            raise HTTPException(
                status_code=500,
                detail="I'm having trouble processing your request right now."
            )
        
        if not moderate_content(ai_response):
            ai_response = "I'd like to approach this topic differently. How else can I support you today?"
        
        suggestions = [
            "Tell me more about how you're feeling",
            "What would help you feel better right now?", 
            "Would you like some coping strategies?"
        ]
        
        response = ChatResponse(
            response=ai_response,
            suggestions=suggestions
        )
        
        background_tasks.add_task(
            memory_manager.update_user_history,
            request.user_id,
            [
                {"role": "user", "content": request.message},
                {"role": "assistant", "content": ai_response}
            ]
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again."
        )

@app.post("/api/chat/stream")
async def stream_chat(request: StreamChatRequest):
    async def generate_stream():
        try:
            crisis_response = detect_crisis(request.message)
            if crisis_response:
                yield f"data: {json.dumps({'type': 'crisis', 'content': crisis_response})}\n\n"
                return
            
            history = memory_manager.get_user_history(request.user_id)
            response = agent.generate(request.message, history)
            words = response.split()
            
            for i, word in enumerate(words):
                chunk = {
                    "type": "token",
                    "content": word + " ",
                    "is_final": i == len(words) - 1
                }
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.03)
            
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"
            
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': 'Stream interrupted'})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.websocket("/api/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            crisis_response = detect_crisis(message_data.get("message", ""))
            if crisis_response:
                await manager.send_personal_message(
                    json.dumps({
                        "type": "crisis",
                        "content": crisis_response,
                        "timestamp": datetime.utcnow().isoformat()
                    }),
                    user_id
                )
                continue
            
            history = memory_manager.get_user_history(user_id)
            response = agent.generate(message_data.get("message", ""), history)
            
            await manager.send_personal_message(
                json.dumps({
                    "type": "response", 
                    "content": response,
                    "timestamp": datetime.utcnow().isoformat()
                }),
                user_id
            )
            
            memory_manager.update_user_history(
                user_id,
                [
                    {"role": "user", "content": message_data.get("message", "")},
                    {"role": "assistant", "content": response}
                ]
            )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"User {user_id} disconnected from WebSocket")

@app.post("/api/mood")
async def log_mood(mood_entry: MoodEntry):
    try:
        logger.info(f"Mood entry from {mood_entry.user_id}: {mood_entry.mood_score}")
        return {
            "status": "success", 
            "message": "Mood logged successfully",
            "entry_id": str(uuid.uuid4())
        }
    except Exception as e:
        logger.error(f"Error logging mood: {e}")
        raise HTTPException(status_code=500, detail="Failed to log mood")

@app.get("/api/mood/{user_id}")
async def get_mood_history(user_id: str, days: int = 30):
    try:
        mock_entries = [
            {
                "user_id": user_id,
                "mood_score": 7,
                "mood_tags": ["calm", "focused"],
                "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat()
            },
            {
                "user_id": user_id, 
                "mood_score": 5,
                "mood_tags": ["anxious", "tired"],
                "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat()
            }
        ]
        
        return {
            "entries": mock_entries,
            "average_score": 6.0,
            "trend": "stable"
        }
    except Exception as e:
        logger.error(f"Error fetching mood history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch mood history")

@app.get("/api/conversation/{user_id}")
async def get_conversation_history(user_id: str, limit: int = 50):
    try:
        history = memory_manager.get_user_history(user_id)
        return {
            "conversations": history[-limit:],
            "total_messages": len(history)
        }
    except Exception as e:
        logger.error(f"Error fetching conversation history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversation history")

if __name__ == "__main__":
    import uvicorn
    
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    
    logger.info(f"Starting WellForm backend server on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)