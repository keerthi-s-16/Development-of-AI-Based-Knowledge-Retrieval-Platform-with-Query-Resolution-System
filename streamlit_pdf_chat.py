import streamlit as st
import speech_recognition as sr
import asyncio

# ✅ Fix async error
try:
    asyncio.get_running_loop()
except RuntimeError:
    asyncio.set_event_loop(asyncio.new_event_loop())

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

st.title("📄 AI PDF Chatbot")

recognizer = sr.Recognizer()
query = None

# =========================
# 📄 PDF UPLOAD
# =========================

uploaded_file = st.file_uploader("Upload your PDF", type="pdf")

if uploaded_file:
    with open("temp.pdf", "wb") as f:
        f.write(uploaded_file.read())

    st.success("PDF uploaded successfully!")

    # Load PDF
    loader = PyPDFLoader("temp.pdf")
    documents = loader.load()

    # Split
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = splitter.split_documents(documents)

    # ✅ Cache DB (important)
    @st.cache_resource
    def load_db(texts):
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        return FAISS.from_documents(texts, embeddings)

    db = load_db(texts)

    # =========================
    # 🎤 VOICE INPUT (ONLY HERE)
    # =========================
    st.write("### 🎤 Voice Input")
    audio = st.audio_input("Speak here")

    if audio is not None:
        with open("temp.wav", "wb") as f:
            f.write(audio.read())

        with sr.AudioFile("temp.wav") as source:
            audio_data = recognizer.record(source)

            try:
                query = recognizer.recognize_google(audio_data)
                st.success(f"You said: {query}")
            except:
                st.error("Could not understand audio")

    # =========================
    # ⌨️ TEXT INPUT
    # =========================
    text_query = st.text_input("Type your question")

    if text_query:
        query = text_query

    # 🤖 ANSWER
    if query:
        docs = db.similarity_search(query)

        # Combine top 3 chunks
        context = " ".join([doc.page_content for doc in docs[:3]])

        st.write("### 🤖 Answer:")
        st.write(context)