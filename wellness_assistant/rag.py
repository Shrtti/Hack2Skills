import logging
import chromadb
import numpy as np
from google.adk.tools import Tool
from vertexai.language_models import TextEmbeddingModel

# Configure logging
logger = logging.getLogger(__name__)

# --- Knowledge Base Setup ---
MENTAL_WELLNESS_DOCS = [
    "Mindfulness is the practice of paying attention to the present moment without judgment.",
    "Cognitive Behavioral Therapy (CBT) is a type of talk therapy that helps you manage your problems by changing the way you think and behave.",
    "Regular physical exercise is proven to reduce stress, anxiety, and symptoms of depression.",
    "A balanced diet rich in fruits, vegetables, and omega-3 fatty acids can support mental health.",
    "Deep breathing exercises can help calm your nervous system and reduce feelings of anxiety.",
    "Journaling can be a powerful tool for processing emotions and gaining clarity on your thoughts.",
    "Connecting with friends, family, or a support group can combat feelings of loneliness and isolation.",
    "Getting 7-9 hours of quality sleep per night is crucial for emotional regulation and cognitive function."
]

class RAGTool:
    """
    Retrieval-Augmented Generation tool using ChromaDB.
    For production, replace with Vertex AI Matching Engine.
    """

    def __init__(self, documents: list[str], collection_name: str = "wellness_docs"):
        self.documents = documents
        self.embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
        # In-memory ChromaDB instance
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name=collection_name)
        self._add_documents()

    def _add_documents(self):
        """Embed and add documents into ChromaDB."""
        if self.collection.count() >= len(self.documents):
            logger.info("Documents already exist in ChromaDB collection. Skipping addition.")
            return
        try:
            logger.info(f"Generating embeddings for {len(self.documents)} documents...")
            embeddings = self.embedding_model.get_embeddings(self.documents)
            embedding_values = [e.values for e in embeddings]
            doc_ids = [str(i) for i in range(len(self.documents))]

            self.collection.add(
                embeddings=embedding_values,
                documents=self.documents,
                ids=doc_ids,
            )
            logger.info(f"ChromaDB collection populated with {self.collection.count()} documents.")
        except Exception as e:
            logger.error(f"Failed to add documents to ChromaDB: {e}")

    def search(self, query: str, k: int = 2) -> str:
        """Query ChromaDB for relevant docs."""
        if self.collection.count() == 0:
            logger.error("ChromaDB collection is empty.")
            return ""

        try:
            logger.info(f"Performing RAG search for query: '{query}'")
            query_embedding = self.embedding_model.get_embeddings([query])[0].values

            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
            )

            retrieved_docs = results["documents"][0]
            context = "\n\n---\nRetrieved Knowledge:\n" + "\n".join(f"- {doc}" for doc in retrieved_docs) + "\n---\n"
            logger.info(f"Retrieved {len(retrieved_docs)} documents for the query.")
            return context
        except Exception as e:
            logger.error(f"Error during RAG search: {e}")
            return ""

# Instantiate the RAG tool
rag_tool_instance = RAGTool(documents=MENTAL_WELLNESS_DOCS)

# Create an ADK Tool for the agent
knowledge_base_search = Tool(
    name="knowledge_base_search",
    description="Search the knowledge base for mental wellness strategies.",
    func=rag_tool_instance.search,
)
