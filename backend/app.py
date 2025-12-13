import os
import json
import re
from typing import TypedDict, Annotated, List
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
import base64
from groq import Groq
from neo4j import GraphDatabase
from langchain_community.vectorstores.neo4j_vector import Neo4jVector
from langchain_openai import OpenAIEmbeddings
# Note: These are 'classic' imports, ensure they are compatible or update to latest LangChain
# from langchain_classic.chains.retrieval import create_retrieval_chain
# from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain # Modern LangChain import
from langchain_classic.chains.combine_documents import create_stuff_documents_chain # Modern LangChain import

from flask_cors import CORS
# Import dataset for ingestion
from proof import proof  # Assuming 'proof.py' is available with the dataset

load_dotenv()

app = Flask(__name__)
CORS(app)
# --- NEO4J and RAG Setup (from frag.py) ---
NEO4J_URI = "neo4j+s://e617c76b.databases.neo4j.io"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "Me53Ykd8C5XTYEAw5bd54xCp3oNf6cyzhfXyfL9z2Po"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
EMBEDDING_MODEL = "openai/text-embedding-3-small"

def ingest_documents_to_neo4j(documents):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    with driver.session() as session:
        for doc in documents:
            # Ensure 'law_reference' is always a JSON string before storing
            law_reference_json = json.dumps(doc.get("law_reference", []))
            embedding = embeddings.embed_query(doc["category_name"]) # Make sure embeddings is defined before this call

            session.run(
                """
                MERGE (c:Category {name: $category_name})
                SET c.realistic_examples = $realistic_examples,
                    c.required_documents = $required_documents,
                    c.gov_documents_to_submit = $gov_documents_to_submit,
                    c.law_reference = $law_reference,
                    c.embedding = $embedding
                """,
                parameters={
                    "category_name": doc["category_name"],
                    "realistic_examples": doc.get("realistic_examples", []), # Use .get for robustness
                    "required_documents": doc.get("required_documents", []),
                    "gov_documents_to_submit": doc.get("gov_documents_to_submit", []),
                    "law_reference": law_reference_json, # Store as JSON string
                    "embedding": embedding
                }
            )

    driver.close()

# Vector Index Setup - Define embeddings before ingestion
embeddings = OpenAIEmbeddings(
    model=EMBEDDING_MODEL,
    openai_api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

# 👉 RUN ONCE (comment out after initial ingestion)
# ingest_documents_to_neo4j(proof)


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

# Custom function to get category info by exact name
def get_category_info_from_neo4j(category_name):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        # Try exact match first
        result = session.run(
            "MATCH (c:Category {name: $name}) RETURN c",
            name=category_name
        )
        record = result.single()

        # If exact match not found, try a cleaned version
        if not record:
            # Clean the category name by removing parenthetical phrases for lookup
            cleaned_category_name = re.sub(r' \(.*?\)', '', category_name).strip()
            result = session.run(
                "MATCH (c:Category {name: $name}) RETURN c",
                name=cleaned_category_name
            )
            record = result.single()

        if record:
            node = record["c"]
            # Safely get all expected fields, defaulting to empty list if not present
            law_ref = json.loads(node["law_reference"]) if node.get("law_reference") else []
            return {
                "category_name": node["name"],
                "realistic_examples": node.get("realistic_examples", []),
                "required_documents": node.get("required_documents", []),
                "gov_documents_to_submit": node.get("gov_documents_to_submit", []),
                "law_reference": law_ref
            }
        else:
            return {"error": "Category not found"}
    driver.close()


# RAG LLM
rag_llm = ChatGroq(
    temperature=0,
    model="llama-3.3-70b-versatile",
    groq_api_key=GROQ_API_KEY
)

# RAG Prompt
rag_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a cybercrime documentation assistant. The user will provide ONLY a cybercrime "
        "category name such as 'Phishing'. Look up that category ONLY from the context "
        "dataset below.\n\n"

        "You MUST return:\n"
        "  'category_name'\n"
        "  'realistic_examples'\n"
        "  'required_documents'\n"
        "  'gov_documents_to_submit'\n"
        "  'law_reference'\n\n" # Added law_reference here as it's expected

        "Output must be STRICT JSON in this format:\n"
        "{{\n"
        "  'category_name': <name>,\n"
        "  'realistic_examples': <list>,\n"
        "  'required_documents': <list>,\n"
        "  'gov_documents_to_submit': <list>,\n"
        "  'law_reference': [\n"
        "    {{\n"
        "      'act': <act>,\n"
        "      'section': <section>,\n"
        "      'title': <title>,\n"
        "      'description': <description>\n"
        "    }}\n"
        "    // ... more if applicable\n"
        "  ]\n"
        "}}\n\n"

        "If category is NOT found, respond ONLY:\n"
        "{{ 'error': 'Category not found' }}\n\n"

        "Context:\n{context}"
    ),
    ("human", "{input}")
])

# RAG Chain (kept for potential future use)
question_answer_chain = create_stuff_documents_chain(rag_llm, rag_prompt)
retriever = vector_index.as_retriever(search_kwargs={"k": 1})
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# --- Classification State Schema (from app.py) ---
class ClassificationState(TypedDict):
    complaint: str
    messages: Annotated[list, add_messages]
    primary_category: str
    possible_crimes: List[str]
    severity: str
    reasoning: str

# --- Classification LLM (from app.py) ---
# Using Llama 3.2 90b Vision for high accuracy with large context lists
llm = ChatGroq(
    temperature=0.0,
    model="meta-llama/llama-4-scout-17b-16e-instruct", # Ensure this model supports image input if using it
    api_key=os.getenv("GROQ_API_KEY")
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# --- Classification Prompt (from app.py) ---
classification_prompt = PromptTemplate(
    input_variables=["complaint"],
    template="""
You are a specialized Cybercrime Classification AI.
Analyze the user's complaint and classify it into the MOST SPECIFIC category from the master list below.

**CRITICAL RULE FOR EXTORTION:**
- If the user is being threatened for money (e.g., "pay or I arrest you", "pay loan") but NO sexual images are involved, use **"Digital Arrest Scam"**, **"Cyber Extortion"**, or **"Instant Loan Scam"**.
- ONLY use **"Sextortion"** if intimate/nude photos or videos are involved.

**MASTER LIST OF CYBERCRIMES (Select the best fit):**

**A. FINANCIAL & BANKING FRAUD**
1. UPI / QR Code Fraud
2. Credit/Debit Card Fraud (Cloning/Skimming)
3. Internet Banking Fraud
4. KYC Update Fraud
5. AEPS (Aadhaar Enabled Payment) Scam
6. Digital Arrest Scam (Fake Police/CBI threats)
7. Fake Bank Call / Vishing
8. SIM Swap Fraud
9. Insurance Fraud
10. Tax Refund Scam
11. Income Tax Scam
12. Electricity Bill Scam
13. FASTag Fraud

**B. INVESTMENT, LOANS & EMPLOYMENT**
14. Instant Loan App Scam (Harassment/Blackmail)
15. Part-Time Job / Task Scam (Like/Subscribe tasks)
16. Ponzi / Pyramid Scheme
17. Cryptocurrency Investment Fraud
18. Stock Market / IPO Scam
19. Work From Home Scam
20. Fake Employment / Visa Fraud
21. Advance Fee Fraud (Nigeria Prince/Lottery)
22. Franchise Fraud
23. Loan Guarantor Scam

**C. COMMERCE, DELIVERY & SERVICES**
24. OLX / Marketplace QR Scam (Buyer scam)
25. Fake E-commerce Website (Shopping Scam)
26. FedEx / Courier / Customs Scam
27. Fake Delivery Boy Scam
28. Refund / Cashback Scam
29. Fake Customer Care Number (SEO Poisoning)
30. Tech Support Scam (Microsoft/Windows popup)
33. Vehicle Dealership Scam
34. Movers and Packers Scam

**D. SOCIAL, ROMANCE & IMPERSONATION**
35. Sextortion (Sexual Blackmail)
36. Romance Scam / Honey Trap
37. Matrimonial Scam
38. Impersonation (Fake Profile of friend/VIP)
39. Identity Theft (Stolen documents/ID)
40. Cyber Stalking
41. Cyber Bullying / Harassment
42. Defamation / Slander
43. Catfishing
44. Deepfake Scam (AI Video/Audio impersonation)
45. Digital Kidnapping Scam
46. Grandparent Scam (Emergency money request)

**E. EDUCATION & ACADEMIC**
47. Scholarship Scam
48. Fake Education Board / University Website
49. Admission Fraud (Fake Seat Allocation)
50. Exam Paper Leak Scam
51. Fake Degree / Certificate Racket
52. Online Course / Tutorial Fraud
53. Study Abroad Consultant Fraud

**F. MEDICAL & HEALTHCARE**
54. Pharma Scam (Fake Medicines Online)
55. Telemedicine Fraud
56. Fake Ambulance Service
57. Organ Donation Scam
58. Medical Insurance Fraud
59. Fake Hospital / Lab Report Scam
60. COVID-19 / Pandemic Related Scam

**G. TECHNICAL ATTACKS & HACKING**
61. Phishing (Generic fake links)
62. Ransomware Attack (File encryption)
63. Hacking / Account Takeover (Social Media/Email)
64. Malware / Spyware Attack
65. Keylogger Attack
66. DDoS Attack (Denial of Service)
67. SQL Injection
68. Website Defacement
69. Cryptojacking (Mining crypto on victim PC)
70. Botnet Attack
71. Man-in-the-Middle Attack (Public WiFi)
72. Data Breach / Leak
73. Remote Access App Scam (AnyDesk/TeamViewer)

**H. GAMING, GAMBLING & LIFESTYLE**
74. Online Gambling / Betting Scam
75. Gaming Account Theft (Skins/IDs)
76. In-Game Currency Fraud
77. Fake Gaming Tournament
78. Club / Membership Fraud
79. Gift Card Scam

**I. GOVERNMENT & CIVIC**
80. Fake Government Scheme (PM Yojana, etc.)
81. Passport Service Scam
82. Traffic Challan Scam
83. Voter ID Scam
84. Ration Card Scam
85. Pension Scam

**J. OTHER & EMERGING**
86. Cyber Terrorism
87. Child Pornography / CSAM / Child Exploitation
88. Online Drug Trafficking
89. Arms Trafficking
90. Intellectual Property Theft / Piracy
91. Crowdfunding / Charity Scam
92. Clickjacking
93. Juice Jacking (Public USB Charging)
94. QR Code Quishing
95. Smishing (SMS Phishing)
96. Email Spoofing
97. Business Email Compromise (BEC)
98. Cyber Extortion (Generic)
99. Social Engineering (Generic)
100. Other

**USER COMPLAINT:**
{complaint}

**OUTPUT INSTRUCTIONS:**
1. **Primary Category:** Choose the ONE most specific category from the list.
2. **Possible Crimes:** List 2-3 related categories (e.g., if "FedEx Scam", also list "Phishing" and "Financial Fraud").
3. **Reasoning:** Explain why you chose the Primary Category.

Return ONLY valid JSON:
{{
    "primary_category": "Exact string from list",
    "possible_crimes": ["related1", "related2"],
    "severity": "LOW | MEDIUM | HIGH",
    "reasoning": "Brief explanation."
}}
"""
)

# --- "What Will Happen Next?" Predictor Prompt ---
threat_prediction_prompt = PromptTemplate(
    input_variables=["complaint", "primary_category", "severity"],
    template="""
You are a Cybercrime Threat Intelligence Analyst with expertise in predicting attacker behavior patterns.

Based on the user's complaint and the classified crime category, predict what will likely happen next.

**COMPLAINT:**
{complaint}

**CLASSIFIED AS:** {primary_category}
**SEVERITY:** {severity}

**YOUR TASK:**
Analyze the situation and provide:

1. **Likely Next Steps by Attacker** - What the scammer/attacker will probably do next (3-5 specific actions)
2. **Risk Escalation Timeline** - What could happen if the victim delays action (24h, 48h, 7 days)
3. **Statistical Risk Assessment** - Estimated probabilities based on similar cybercrime patterns

**OUTPUT FORMAT (STRICT JSON):**
{{
    "attacker_next_steps": [
        "Specific action 1",
        "Specific action 2",
        "Specific action 3"
    ],
    "risk_timeline": {{
        "24_hours": "What could happen in 24 hours",
        "48_hours": "What could happen in 48 hours", 
        "7_days": "What could happen in 7 days if no action taken"
    }},
    "risk_statistics": {{
        "financial_loss_probability": "XX%",
        "data_compromise_probability": "XX%",
        "reputation_damage_probability": "XX%",
        "escalation_probability": "XX%"
    }},
    "immediate_actions_recommended": [
        "Action 1 to take immediately",
        "Action 2 to take immediately",
        "Action 3 to take immediately"
    ],
    "warning_signs_to_watch": [
        "Sign 1 indicating escalation",
        "Sign 2 indicating escalation"
    ]
}}

Be specific and realistic based on actual cybercrime patterns. Use percentages that reflect real-world data for similar crimes.
"""
)

# --- Threat Prediction Function ---
def predict_threat_evolution(complaint: str, primary_category: str, severity: str) -> dict:
    """Predicts what the attacker will likely do next based on the complaint analysis."""
    try:
        prompt = threat_prediction_prompt.format(
            complaint=complaint if not complaint.startswith("IMAGE:") else "[Image evidence provided]",
            primary_category=primary_category,
            severity=severity
        )
        
        response = llm.invoke([HumanMessage(content=prompt)])
        prediction_output = response.content.strip()
        
        # Clean Markdown if present
        if "```" in prediction_output:
            match = re.search(r"```(json)?\n?(.*?)```", prediction_output, re.DOTALL)
            if match:
                prediction_output = match.group(2).strip()
        
        # Parse JSON
        prediction = json.loads(prediction_output)
        return {
            "what_happens_next": {
                "attacker_next_steps": prediction.get("attacker_next_steps", []),
                "risk_timeline": prediction.get("risk_timeline", {}),
                "risk_statistics": prediction.get("risk_statistics", {}),
                "immediate_actions_recommended": prediction.get("immediate_actions_recommended", []),
                "warning_signs_to_watch": prediction.get("warning_signs_to_watch", [])
            }
        }
    except json.JSONDecodeError:
        return {
            "what_happens_next": {
                "error": "Failed to generate threat prediction",
                "attacker_next_steps": [],
                "risk_timeline": {},
                "risk_statistics": {},
                "immediate_actions_recommended": ["Report to Cyber Crime Portal immediately", "Do not engage with the attacker", "Preserve all evidence"],
                "warning_signs_to_watch": []
            }
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        return {
            "what_happens_next": {
                "error": str(e),
                "attacker_next_steps": [],
                "risk_timeline": {},
                "risk_statistics": {},
                "immediate_actions_recommended": ["Report to Cyber Crime Portal immediately"],
                "warning_signs_to_watch": []
            }
        }

def get_complaint_portals(category_name: str):
    """
    Uses Groq Compound model with web_search
    Returns official complaint portals in structured JSON
    """
    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        response = client.chat.completions.create(
            model="groq/compound",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a cybercrime assistance system for INDIA.\n"
                        "Find ONLY OFFICIAL GOVERNMENT or LAW ENFORCEMENT websites "
                        "where a victim can file a complaint.\n\n"
                        "Rules:\n"
                        "- Return ONLY JSON\n"
                        "- Prefer Indian government portals\n"
                        "- Max 3 websites\n"
                        "- No explanations\n\n"
                        "JSON format:\n"
                        "{\n"
                        "  \"complaint_portals\": [\n"
                        "    {\n"
                        "      \"name\": \"\",\n"
                        "      \"url\": \"\",\n"
                        "      \"description\": \"\"\n"
                        "    }\n"
                        "  ]\n"
                        "}"
                    )
                },
                {
                    "role": "user",
                    "content": f"{category_name} cyber crime complaint India"
                }
            ],
            temperature=0,
            max_completion_tokens=300,
            compound_custom={
                "tools": {
                    "enabled_tools": ["web_search", "visit_website"]
                }
            }
        )

        raw_output = response.choices[0].message.content.strip()

        # Remove markdown if any
        if "```json" in raw_output:
            raw_output = raw_output.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_output: # Fallback for generic markdown block
            raw_output = raw_output.split("```")[1].split("```")[0].strip()

        # Validate if the output is not empty before parsing
        if raw_output:
            parsed_portals = json.loads(raw_output)
            # Ensure it's a dict and has the expected key
            if isinstance(parsed_portals, dict) and "complaint_portals" in parsed_portals:
                return parsed_portals
        return {"complaint_portals": []} # Return a default empty structure if parsing fails or invalid

    except json.JSONDecodeError as e:
        print(f"Web Search JSON Decode Error: {e} - Raw output: {raw_output}")
        return {"complaint_portals": []}
    except Exception as e:
        print(f"Web Search General Error: {e}")
        return {"complaint_portals": []}

# --- Processing Logic (from app.py) ---
def classify_crime(state: ClassificationState) -> ClassificationState:
    complaint = state["complaint"]
    prompt = classification_prompt.format(complaint=complaint)

    # Handle Image vs Text
    if complaint.startswith("IMAGE:"):
        image_data = complaint.replace("IMAGE:", "")
        text_prompt = prompt.replace(complaint, "EVIDENCE PROVIDED: Image/Screenshot. Analyze the text, logos, and context in the image to classify the crime.")

        message = HumanMessage(
            content=[
                {"type": "text", "text": text_prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
            ]
        )
        response = llm.invoke([message])
    else:
        response = llm.invoke([HumanMessage(content=prompt)])

    llm_output = response.content.strip()

    # Clean Markdown
    if "```json" in llm_output:
        llm_output = llm_output.split("```json")[1].split("```")[0].strip()
    elif "```" in llm_output: # Fallback for generic markdown block
        llm_output = llm_output.split("```")[1].split("```")[0].strip()

    # Parse JSON
    try:
        parsed = json.loads(llm_output)
        primary = parsed.get("primary_category", "Other")
        possible = parsed.get("possible_crimes", [])
        severity = parsed.get("severity", "MEDIUM")
        reasoning = parsed.get("reasoning", "No reasoning provided.")
    except json.JSONDecodeError as e:
        print(f"Classification JSON Decode Error: {e} - Raw output: {llm_output}")
        primary = "Other"
        possible = []
        severity = "MEDIUM"
        reasoning = f"Error parsing AI classification response: {e}"

    return {
        **state,
        "messages": state["messages"] + [response],
        "primary_category": primary,
        "possible_crimes": possible, # Ensure this is carried over
        "severity": severity,
        "reasoning": reasoning
    }

# --- Graph Setup (from app.py) ---
workflow = StateGraph(ClassificationState)
workflow.add_node("classifier", classify_crime)
workflow.set_entry_point("classifier")
workflow.add_edge("classifier", END)
app_graph = workflow.compile()

# --- API Helpers (from app.py) ---
def get_request_data(req):
    content_type = req.content_type or ""

    if "application/json" in content_type:
        data = req.get_json()
        return data.get('complaint', '') if data else ''

    elif "multipart/form-data" in content_type:
        if 'file' in req.files:
            file = req.files['file']
            if not file or not file.filename: return None
            filename = file.filename.lower()

            # Audio Transcription
            if filename.endswith(('.mp3', '.wav', '.m4a', '.ogg')):
                try:
                    file.seek(0)
                    return client.audio.transcriptions.create(
                        file=(filename, file.read()),
                        model="whisper-large-v3-turbo",
                        response_format="text"
                    )
                except Exception as e:
                    print(f"Audio Error: {e}")
                    return None

            # Image Base64
            elif filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                try:
                    file.seek(0)
                    return f"IMAGE:{base64.b64encode(file.read()).decode('utf-8')}"
                except Exception as e:
                    print(f"Image Error: {e}")
                    return None
        elif 'complaint' in req.form:
            return req.form['complaint']

    return None

# --- Routes (from app.py, enhanced with RAG) ---
@app.route('/classify', methods=['POST'])
def classify_complaint():
    try:
        data = get_request_data(request)
        if not data:
             return jsonify({"error": "No valid content found."}), 400

        initial_state = {
            "complaint": data,
            "messages": [],
            "primary_category": "",
            "possible_crimes": [],
            "severity": "",
            "reasoning": ""
        }

        result = app_graph.invoke(initial_state)

        primary_category = result["primary_category"]
        possible_crimes = result["possible_crimes"] # Get possible_crimes from classification result

        # --- Get Complaint Portals ---
        complaint_portals_data = get_complaint_portals(primary_category)
        # Ensure complaint_portals_data is always a dict with 'complaint_portals' key
        if not isinstance(complaint_portals_data, dict) or "complaint_portals" not in complaint_portals_data:
             complaint_portals_data = {"complaint_portals": []}

        # --- Get Category Info from Neo4j (using direct lookup for robustness) ---
        category_info = get_category_info_from_neo4j(primary_category)
        if "error" in category_info:
            # If direct lookup fails, try RAG as a fallback
            print(f"Direct Neo4j lookup failed for '{primary_category}'. Falling back to RAG.")
            rag_response = rag_chain.invoke({"input": primary_category})
            rag_output = rag_response.get("answer", "").strip() # Use .get with default empty string

            try:
                if rag_output: # Only try to parse if there's output
                    rag_parsed = json.loads(rag_output)
                    if "error" in rag_parsed:
                        category_info = {"error": rag_parsed["error"]}
                    else:
                        category_info = {
                            "category_name": rag_parsed.get("category_name", ""),
                            "realistic_examples": rag_parsed.get("realistic_examples", []),
                            "required_documents": rag_parsed.get("required_documents", []),
                            "gov_documents_to_submit": rag_parsed.get("gov_documents_to_submit", []),
                            "law_reference": rag_parsed.get("law_reference", [])
                        }
                else:
                    category_info = {"error": "RAG chain returned no data."}

            except json.JSONDecodeError as e:
                print(f"RAG JSON Decode Error: {e} - Raw output: {rag_output}")
                category_info = {"error": f"Failed to parse RAG category documentation: {e}"}
        # Ensure category_info is always a dictionary, even if it has an 'error' key
        if not isinstance(category_info, dict):
            category_info = {"error": "Category info could not be retrieved or parsed."}


        # Generate "What Will Happen Next?" Prediction
        threat_prediction = predict_threat_evolution(
            complaint=data,
            primary_category=result["primary_category"],
            severity=result["severity"]
        )

        # Combine responses
        response_data = {
            "primary_category": result["primary_category"],
            "possible_crimes": possible_crimes, # Use the correctly captured possible_crimes
            "severity": result["severity"],
            "reasoning": result["reasoning"],
            **category_info, # Merging category_info
            **complaint_portals_data, # Merging complaint_portals_data
            **threat_prediction  # Merge threat prediction
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "active", "crime_database": "100_categories", "rag_enabled": True, "threat_predictor": True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)