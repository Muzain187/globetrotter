from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json, random, uuid
import requests

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load destinations data
with open("destinations.json", "r", encoding="utf-8") as file:
    destinations = json.load(file)

# SQLite database connection
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()

# Create leaderboard table if not exists
cursor.execute("""
    CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY,
        username TEXT,
        score INTEGER
    )
""")
conn.commit()

# Store challenges
challenges = {}

# Unsplash API Key (replace with your key)
UNSPLASH_ACCESS_KEY = "XKb2x7KDvw1Miac753oxoChaJbIZ3rne70ayTmDFPg0"

def get_unsplash_image(query):
    """Fetches an image URL from Unsplash based on the query."""
    url = f"https://api.unsplash.com/photos/random?query={query}&client_id={UNSPLASH_ACCESS_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()["urls"]["regular"]
    return None  # Fallback in case of failure

@app.get("/get_questions")
def get_questions():
    """Returns 5 random questions with image hints."""
    selected = random.sample(destinations, 5)
    
    for q in selected:
        q["image_url"] = get_unsplash_image(q["city"]) or q.get("image_url", "")
        q["choices"] = random.sample([d["city"] for d in destinations if d["city"] != q["city"]], 3) + [q["city"]]
        random.shuffle(q["choices"])
    
    return selected

@app.get("/create_challenge")
def create_challenge():
    """Generates a unique challenge ID with fixed questions."""
    challenge_id = str(uuid.uuid4())[:6]
    challenges[challenge_id] = random.sample(destinations, 5)
    
    for q in challenges[challenge_id]:
        q["image_url"] = get_unsplash_image(q["city"]) or q.get("image_url", "")
        q["choices"] = random.sample([d["city"] for d in destinations if d["city"] != q["city"]], 3) + [q["city"]]
        random.shuffle(q["choices"])
    
    return {"challenge_id": challenge_id}

@app.get("/get_challenge/{challenge_id}")
def get_challenge_questions(challenge_id: str):
    """Retrieves the fixed questions for a challenge ID."""
    if challenge_id not in challenges:
        return {"error": "Invalid challenge ID"}
    
    return challenges[challenge_id]

@app.post("/submit_score/{username}/{score}")
def submit_score(username: str, score: int):
    """Stores the player's score in SQLite."""
    cursor.execute("INSERT INTO leaderboard (id, username, score) VALUES (?, ?, ?)",
                   (str(uuid.uuid4()), username, score))
    conn.commit()
    return {"message": "Score submitted successfully"}

@app.get("/leaderboard")
def get_leaderboard():
    """Retrieves top 10 players."""
    cursor.execute("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10")
    scores = cursor.fetchall()
    return [{"username": row[0], "score": row[1]} for row in scores]
