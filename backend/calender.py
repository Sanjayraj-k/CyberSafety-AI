import os
from groq import Groq

from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.environ["GROQ_API_KEY"])

# Define the tool for creating a reminder/event
tools = [
    {
        "type": "function",
        "function": {
            "name": "create_calendar_reminder",
            "description": "Create a Google Calendar event/reminder with email notification",
            "parameters": {
                "type": "object",
                "properties": {
                    "email": {"type": "string", "description": "User's email for notification/attendee"},
                    "summary": {"type": "string", "description": "Reminder title"},
                    "date": {"type": "string", "description": "Date in YYYY-MM-DD format"},
                    "time": {"type": "string", "description": "Optional time in HH:MM (24h)"},
                    "description": {"type": "string", "description": "Details"}
                },
                "required": ["email", "date", "summary"]
            }
        }
    }
]

# Simulate user input
user_message = "Set a reminder shimalvip@gmail.com on December 20, 2025 for team meeting at 10:00"

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",  # Best for tool calling
    messages=[{"role": "user", "content": user_message}],
    tools=tools,
    tool_choice="auto"
)

# If tool call is returned, execute it (integrate with Google Calendar API here)
tool_call = response.choices[0].message.tool_calls[0]
args = tool_call.function.arguments  # Parsed JSON with email, date, etc.

# Now call Google Calendar API (use google-api-python-client)
# Example snippet:
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import json
import os.path

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

def get_credentials():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists("credentials.json"):
                print("ERROR: 'credentials.json' is missing. Please download it from Google Cloud Console.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

# args is a string in the response, needs parsing
args = json.loads(tool_call.function.arguments)

print(f"Tool Triggered: {tool_call.function.name}")
print(f"Arguments: {args}")

creds = get_credentials()

if creds:
    service = build('calendar', 'v3', credentials=creds)
    event = {
        'summary': args['summary'],
        'description': args.get('description', ''),
        'start': {'dateTime': f"{args['date']}T{args['time']}:00", 'timeZone': 'UTC'},
        'end': {'dateTime': f"{args['date']}T{args['time']}:00", 'timeZone': 'UTC'},
        'attendees': [{'email': args['email']}],
        'reminders': {'useDefault': True}
    }
    
    try:
        event_result = service.events().insert(calendarId='primary', body=event, sendUpdates='all').execute()
        print(f"Event created: {event_result.get('htmlLink')}")
    except Exception as e:
        print(f"An error occurred: {e}")
else:
    print("Failed to authenticate.")    
    