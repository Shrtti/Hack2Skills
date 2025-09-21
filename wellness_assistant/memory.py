import logging
from typing import List, Dict, Any
from google.cloud import firestore
from google.api_core.exceptions import NotFound

# Configure logging
logger = logging.getLogger(__name__)

class MemoryManager:
    """
    Manages session-level and persistent memory for the agent.
    Uses Google Cloud Firestore for persistent storage.
    """

    def __init__(self, project_id: str, collection_name: str = "agent_memory"):
        """
        Initializes the MemoryManager.

        Args:
            project_id: The Google Cloud project ID.
            collection_name: The Firestore collection name to store user histories.
        """
        self.db = firestore.Client(project=project_id)
        self.collection = self.db.collection(collection_name)
        logger.info(f"MemoryManager initialized for Firestore collection '{collection_name}'")

    def get_user_history(self, user_id: str) -> List[Dict[str, str]]:
        """
        Retrieves the conversation history for a specific user.

        Args:
            user_id: The unique identifier for the user.

        Returns:
            A list of message dictionaries, e.g., [{"role": "user", "content": "Hello"}].
            Returns an empty list if no history is found.
        """
        try:
            doc = self.collection.document(user_id).get()
            if doc.exists:
                history = doc.to_dict().get("history", [])
                logger.info(f"Retrieved {len(history)} messages for user '{user_id}'")
                return history
            else:
                logger.info(f"No history found for new user '{user_id}'")
                return []
        except Exception as e:
            logger.error(f"Error retrieving history for user '{user_id}': {e}")
            return []

    def update_user_history(self, user_id: str, new_messages: List[Dict[str, str]]):
        """
        Updates the conversation history for a specific user.

        Args:
            user_id: The unique identifier for the user.
            new_messages: A list of new message dictionaries to append to the history.
        """
        try:
            doc_ref = self.collection.document(user_id)
            
            @firestore.transactional
            def update_in_transaction(transaction, doc_ref, messages_to_add):
                snapshot = doc_ref.get(transaction=transaction)
                current_history = snapshot.to_dict().get("history", []) if snapshot.exists else []
                
                updated_history = current_history + messages_to_add
                
                # Optional: Implement summarization for very long histories
                # if len(updated_history) > 20: ...

                transaction.set(doc_ref, {"history": updated_history}, merge=True)
                return len(updated_history)

            updated_length = update_in_transaction(self.db.transaction(), doc_ref, new_messages)
            logger.info(f"Updated history for user '{user_id}'. New length: {updated_length}")

        except Exception as e:
            logger.error(f"Error updating history for user '{user_id}': {e}")
