import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In a real-world scenario, this would be a more sophisticated model.
# For example, a fine-tuned text classification model on Vertex AI or a model from Hugging Face.
# We use a simple keyword-based check for this example.
CRISIS_KEYWORDS = [
    "kill myself", "suicide", "want to die", "hopeless", "end my life"
]

ESCALATION_RESPONSE = (
    "It sounds like you are going through a difficult time. "
    "Please consider reaching out to a crisis support professional. "
    "You can connect with people who can support you by calling or texting 988 anytime in the US and Canada. "
    "In the UK, you can call 111."
)

def detect_crisis(text: str) -> Optional[str]:
    """
    Detects if the user input indicates a crisis situation.

    Args:
        text: The user's input text.

    Returns:
        The escalation response if a crisis is detected, otherwise None.
    """
    lower_text = text.lower()
    for keyword in CRISIS_KEYWORDS:
        if keyword in lower_text:
            logger.warning(f"Crisis keyword detected: '{keyword}'. Triggering escalation response.")
            # In a production system, you might also trigger an alert here.
            # e.g., using Cloud Monitoring custom metrics or Pub/Sub.
            return ESCALATION_RESPONSE
    return None

def moderate_content(text: str) -> bool:
    """
    A placeholder for content moderation. The primary safety filtering is configured
    on the Gemini model itself. This function can be used for an additional layer of safety.

    Args:
        text: The text to moderate (e.g., agent's final response).

    Returns:
        True if the content is safe, False otherwise.
    """
    logger.info(f"Performing final content moderation check on: '{text[:50]}...'")
    # For this example, we assume the model's built-in safety features are sufficient.
    return True
