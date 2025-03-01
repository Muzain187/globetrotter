# City Guessing Game

## Overview
The **City Guessing Game** is an interactive web-based game where players guess the city based on an image hint. The game supports solo and challenge modes, allowing users to compete with friends through shared challenge links.

## webapp link
https://globetrip.netlify.app/

## Core Features
- **Single-player mode**: Play and guess cities based on given image hints.
- **Challenge mode**: Generate a challenge link and invite friends to compete.
- **Leaderboard**: Stores player scores with their names.
- **Timed questions**: Players must answer within a set time limit.
- **Dynamic feedback**: Get instant feedback on correct or incorrect answers.
- **Image hints**: Each question provides a city image for additional hints.

## Tech Stack & Architecture
- **Frontend**: HTML, CSS, JavaScript (Vanilla JS)
- **Backend**: FastAPI (Python)
- **Database**: SQLite / PostgreSQL (for storing scores & challenges)
- **Hosting**: deployed on **Netlify and  Vercel**
- **API Communication**: RESTful API between frontend and backend

## Installation & Setup
### Prerequisites
- Python (for FastAPI backend)

### Clone Repository
```sh
 git clone https://github.com/Muzain187/globetrotter.git
 cd globetrotter
```

### Backend Setup (FastAPI)
```sh
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
Simply open `index.html` in your browser or use a simple HTTP server:
```sh
cd frontend
python -m http.server 8000
```
Access the game at: `http://127.0.0.1:8000`

## API Endpoints
| Method | Endpoint | Description |
|--------|------------|-------------|
| GET | `/get_questions` | Fetches a new set of quiz questions |
| GET | `/get_challenge/{challenge_id}` | Retrieves questions for a specific challenge |
| POST | `/submit_score/{username}/{score}` | Submits the player’s score |
| GET | `/create_challenge` | Generates a challenge link |

## Game Walkthrough
1. **Enter Player Name** → Before starting, the player enters their name.
2. **Start Game** → The game fetches questions from the backend.
3. **Answer Questions** → Players select an answer within a time limit.
4. **Get Instant Feedback** → Correct or incorrect responses are displayed.
5. **Submit Score** → At the end, the score is saved to the leaderboard.
6. **View Leaderboard** → Players see rankings based on scores.
7. **Challenge Mode** → Share a unique challenge link with friends.

## Future Enhancements
- **Multiplayer Live Mode** 🚀
- **More diverse image hints** 📷
- **Backend optimizatio**
- **Sound effects and animations** 🔊🎨

## Contributor
- [Mohammad Ashraf](https://github.com/Muzain187)

