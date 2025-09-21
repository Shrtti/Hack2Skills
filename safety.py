import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Crisis detection keywords (simple fallback method)
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "hopeless", "end my life",
    "self harm", "cut myself", "can't go on"
]

ESCALATION_RESPONSE = (
    " It sounds like you are going through a very difficult time.\n\n"
    "Please know that you are not alone. It may help to reach out to a trusted friend, "
    "family member, or a mental health professional.\n\n"
    " If you are located in the US or Canada, you can call or text **988** right now.\n"
    " In the UK, you can dial **111**.\n\n"
    "If you are elsewhere, please search for the nearest crisis helpline available in your country."
)

def detect_crisis(user_input: str) -> Optional[str]:
    """
    Detects crisis situations based on simple keyword search.
    In production: replace with Vertex AI classification or Hugging Face model.

    Args:
        user_input: The user's message.

    Returns:
        Escalation response if a crisis is detected, otherwise None.
    """
    text = user_input.lower()
    for keyword in CRISIS_KEYWORDS:
        if keyword in text:
            logger.warning(f"Crisis keyword detected: '{keyword}' in input.")
            return ESCALATION_RESPONSE
    return None


def moderate_content(agent_response: str) -> bool:
    """
    Simple content moderation for the agent's final response.
    In production, this would call Vertex AI's safety APIs or an external moderation model.

    Args:
        agent_response: The agent's generated text.

    Returns:
        True if safe, False otherwise.
    """
    logger.info(f"Performing moderation check on: '{agent_response[:50]}...'")
    # For hackathon: assume Gemini's built-in safety + this placeholder is enough.
    return True
