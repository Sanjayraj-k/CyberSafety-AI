# kgrag.py (updated)

from neo4j import GraphDatabase
from langchain_community.vectorstores.neo4j_vector import Neo4jVector
from langchain_openai import OpenAIEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from dotenv import load_dotenv
import os

# Import dataset
from proof import proof

# ---------------------------------
# Load ENV
# ---------------------------------
load_dotenv()
NEO4J_URI = "neo4j+s://e617c76b.databases.neo4j.io"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "Me53Ykd8C5XTYEAw5bd54xCp3oNf6cyzhfXyfL9z2Po"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
EMBEDDING_MODEL = "openai/text-embedding-3-small"


# ---------------------------------------------------------
# STEP 1: Ingest PROOF dataset into Neo4j (fixed version)
# ---------------------------------------------------------
def ingest_documents_to_neo4j(documents):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    with driver.session() as session:
        for doc in documents:
            session.run(
                """
                MERGE (c:Category {name: $category_name})
                SET c.realistic_examples = $realistic_examples,
                    c.required_documents = $required_documents,
                    c.gov_documents_to_submit = $gov_documents_to_submit
                """,
                parameters={
                    "category_name": doc["category_name"],
                    "realistic_examples": doc["realistic_examples"],
                    "required_documents": doc["required_documents"],
                    "gov_documents_to_submit": doc["gov_documents_to_submit"],
                }
            )

    driver.close()


# 👉 RUN ONCE (you can comment this later)
ingest_documents_to_neo4j(proof)


# ---------------------------------------------------------
# STEP 2: Create Vector Index (optional but kept)
# ---------------------------------------------------------
embeddings = OpenAIEmbeddings(
    model=EMBEDDING_MODEL,
    openai_api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

vector_index = Neo4jVector.from_existing_graph(
    embeddings,
    url=NEO4J_URI,
    username=NEO4J_USER,
    password=NEO4J_PASSWORD,
    database="neo4j",
    index_name="category_vector_index",
    node_label="Category",
    text_node_properties=["name"],
    embedding_node_property="embedding"
)


# ---------------------------------------------------------
# STEP 3: Setup LLM
# ---------------------------------------------------------
llm = ChatGroq(
    temperature=0,
    model="llama-3.3-70b-versatile",
    groq_api_key=GROQ_API_KEY
)


# ---------------------------------------------------------
# STEP 4: New Prompt (returns category JSON)
# ---------------------------------------------------------
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a cybercrime documentation assistant. The user will provide ONLY a cybercrime "
        "category name such as 'Phishing'. Look up that category ONLY from the context "
        "dataset below.\n\n"

        "You MUST return:\n"
        "  'category_name'\n"
        "  'realistic_examples'\n"
        "  'required_documents'\n"
        "  'gov_documents_to_submit'\n\n"

        "Output must be STRICT JSON in this format:\n"
        "{{\n"
        "  'category_name': <name>,\n"
        "  'realistic_examples': <list>,\n"
        "  'required_documents': <list>,\n"
        "  'gov_documents_to_submit': <list>\n"
        "}}\n\n"

        "If category is NOT found, respond ONLY:\n"
        "{{ 'error': 'Category not found' }}\n\n"

        "Context:\n{context}"
    ),
    ("human", "{input}")
])


# ---------------------------------------------------------
# STEP 5: Create RAG Chain
# ---------------------------------------------------------
question_answer_chain = create_stuff_documents_chain(llm, prompt)
retriever = vector_index.as_retriever(search_kwargs={"k": 1})
rag_chain = create_retrieval_chain(retriever, question_answer_chain)


# ---------------------------------------------------------
# STEP 6: Run system
# ---------------------------------------------------------
user_question = input("Enter cybercrime category: ")

response = rag_chain.invoke({"input": user_question})

print("\nLLM Response:")
print(response["answer"])