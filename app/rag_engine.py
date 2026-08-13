from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import HuggingFaceHub
from langchain.chains import RetrievalQA

# Sample knowledge (you can replace with PDF later)
documents = [
    "Artificial Intelligence is the simulation of human intelligence.",
    "Machine Learning is a subset of AI that learns from data.",
    "Python is widely used for AI and Data Science.",
    "FastAPI is used to build APIs in Python."
]

# Convert to chunks
text_splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=20)
texts = text_splitter.create_documents(documents)

# Embeddings
embeddings = HuggingFaceEmbeddings()

# Vector DB
db = FAISS.from_documents(texts, embeddings)

# LLM (FREE)
llm = HuggingFaceHub(
    repo_id="google/flan-t5-base",
    model_kwargs={"temperature": 0.5, "max_length": 256}
)

# QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=db.as_retriever()
)


def get_ai_answer(query: str):
    return qa_chain.run(query)