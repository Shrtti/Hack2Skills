import logging
from google.adk.agents.llm_agent import Agent

from .rag import knowledge_base_search
from .memory import conversation_memory
from .safety import detect_crisis, moderate_content

logger = logging.getLogger(__name__)

# --- System Prompt ---
SYSTEM_PROMPT = """
You are "Aura," a compassionate AI wellness assistant.

Guidelines:
- Provide supportive information only (not medical advice or diagnoses).
- Be empathetic, encouraging, and safe.
- Use knowledge_base_search for evidence-based coping strategies (mindfulness, CBT, stress reduction, self-care).
- Retain context across conversation turns using memory.
- Detect crisis language and respond with escalation guidance immediately.
"""

# --- Root Agent ---
root_agent = Agent(
    name="wellness_assistant_agent",
    description="A supportive AI wellness assistant.",
    instruction=SYSTEM_PROMPT,
    model="gemini-2.5-flash",  # model only
    tools=[knowledge_base_search, conversation_memory],  # RAG + memory
)

# --- Safety Wrapper ---
def run_with_safety(user_input: str, temperature: float = 0.7, max_output_tokens: int = 1024) -> str:
    """
    Handles safety filtering and escalation logic for user inputs.
    Call this instead of root_agent.run() for production/demo.
    """
    # 1. Crisis detection
    escalation = detect_crisis(user_input)
    if escalation:
        logger.warning("Crisis escalation triggered.")
        return escalation

    # 2. Normal agent response with generation params
    response = root_agent.run(
        user_input,
        temperature=temperature,
        max_output_tokens=max_output_tokens,
    )

    # 3. Final moderation check
    if not moderate_content(response):
        logger.warning("Content blocked by moderation layer.")
        return "Sorry, I cannot provide a safe response for that request."

    return response
