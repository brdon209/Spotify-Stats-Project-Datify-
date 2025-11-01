import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, jsonify
from flask_cors import CORS

from dotenv import load_dotenv
import os

load_dotenv()  # load variables from .env

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

app = Flask(__name__)
CORS(app)


app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask backend!"})

# Spotify credentials


scope = "user-top-read"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=scope,
    open_browser=True
))

@app.route("/top-artists")
def top_artists():
    results = sp.current_user_top_artists(limit=10, time_range="short_term")
    artists = [artist['name'] for artist in results['items']]
    return jsonify({"top_artists_last_4_weeks": artists})

if __name__ == "__main__":
    app.run(debug=True)
