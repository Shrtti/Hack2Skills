import logging
import chromadb
from google.adk.tools import FunctionTool
from vertexai.language_models import TextEmbeddingModel

logger = logging.getLogger(__name__)

# --- Knowledge Base ---
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
    Retrieval-Augmented Generation tool using ChromaDB + Vertex AI embeddings.
    For production, replace ChromaDB with Vertex AI Matching Engine for scale.
    """

    def __init__(self, documents: list[str], collection_name: str = "wellness_docs"):
        self.documents = documents
        self.embedding_model = TextEmbeddingModel.from_pretrained("text-embedding-004")
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name=collection_name)
        self._add_documents()

    def _add_documents(self):
        """Embed and add documents to ChromaDB collection."""
        if self.collection.count() >= len(self.documents):
            logger.info("ChromaDB already populated. Skipping.")
            return
        try:
            embeddings = self.embedding_model.get_embeddings(self.documents)
            embedding_values = [e.values for e in embeddings]
            doc_ids = [str(i) for i in range(len(self.documents))]
            self.collection.add(
                embeddings=embedding_values,
                documents=self.documents,
                ids=doc_ids,
            )
            logger.info(f"Added {len(self.documents)} documents to ChromaDB.")
        except Exception as e:
            logger.error(f"Failed to add documents: {e}")

    def search(self, query: str, k: int = 2) -> str:
        """
        knowledge_base_search: Searches the mental wellness knowledge base
        for mindfulness, CBT, coping strategies, and self-care practices.
        """
        if self.collection.count() == 0:
            logger.error("Knowledge base is empty.")
            return ""

        try:
            query_embedding = self.embedding_model.get_embeddings([query])[0].values
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
            )
            retrieved_docs = results["documents"][0]
            context = "\n\n---\nRetrieved Knowledge:\n" + "\n".join(f"- {doc}" for doc in retrieved_docs) + "\n---\n"
            logger.info(f"Retrieved {len(retrieved_docs)} docs for query: {query}")
            return context
        except Exception as e:
            logger.error(f"Error during RAG search: {e}")
            return ""


# Instantiate the RAG tool
rag_tool_instance = RAGTool(documents=MENTAL_WELLNESS_DOCS)

# Wrap as FunctionTool for ADK
knowledge_base_search = FunctionTool(rag_tool_instance.search)
