from google.adk.agents.llm_agent import Agent
from google.adk.tools import google_search
from vertexai.generative_models import GenerationConfig, HarmCategory, HarmBlockThreshold
from .rag import knowledge_base_search

# --- Agent Configuration ---

# 1. System Prompt: Defines the agent's persona, capabilities, and rules.
SYSTEM_PROMPT = """
You are "Aura," a compassionate and supportive AI assistant focused on mental wellness.
Your purpose is to provide helpful information, encouragement, and evidence-based coping strategies.

Conversation Rules:
- Be empathetic, patient, and non-judgmental.
- Use a calm and reassuring tone.
- You are NOT a therapist or a medical professional. You MUST NOT provide medical advice, diagnoses, or treatment plans.
- If the user's query is outside the scope of general mental wellness and coping strategies, state that you are not equipped to help with that.
- If the user seems to be in crisis, you must stop and follow crisis protocols.
- Use the 'knowledge_base_search' tool to find information on topics like mindfulness, CBT, stress reduction, etc., before answering.
"""

# 2. Model Configuration: Define the Gemini model and its parameters.
MODEL_CONFIG = {
    "model": "gemini-1.5-flash-preview-0514", # Using a fast, multi-modal model.
    "generation_config": GenerationConfig(
        temperature=0.7,
        max_output_tokens=1024,
    ),
    "safety_settings": {
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    }
}

# 3. ADK Agent Definition
root_agent = Agent(
    name='wellness_assistant_agent',
    description='A mental wellness assistant that provides supportive information.',
    instruction=SYSTEM_PROMPT,
    tools=[knowledge_base_search], # Add our custom RAG tool
    **MODEL_CONFIG

) 
    
