import os
from datetime import datetime
from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException

load_dotenv()  # load variables from .env

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

app = Flask(__name__)
app.secret_key = "super_secret_key"  # for sessions
CORS(app,
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"],
     supports_credentials=True)

# Global error handler for Spotify API errors
@app.errorhandler(SpotifyException)
def handle_spotify_error(error):
    return jsonify({"error": f"Spotify API error: {str(error)}"}), 401

@app.errorhandler(Exception)
def handle_generic_error(error):
    return jsonify({"error": f"Server error: {str(error)}"}), 500

# Spotify scope
scope = "user-top-read user-read-recently-played"

# Helper function to get Spotify object from access token in request
def get_user_spotify():
    # Get token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    access_token = auth_header.split(" ")[1]
    return spotipy.Spotify(auth=access_token)

# -------------------------
# LOGIN / CALLBACK ROUTES
# -------------------------
@app.route("/login")
def login():
    sp_oauth = SpotifyOAuth(client_id=CLIENT_ID,
                            client_secret=CLIENT_SECRET,
                            redirect_uri=REDIRECT_URI,
                            scope=scope,
                            open_browser=False,
                            cache_handler=None)
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route("/callback")
def callback():
    sp_oauth = SpotifyOAuth(client_id=CLIENT_ID,
                            client_secret=CLIENT_SECRET,
                            redirect_uri=REDIRECT_URI,
                            scope=scope,
                            open_browser=False,
                            cache_handler=None)
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code, as_dict=True)
    access_token = token_info["access_token"]
    # Redirect back to the frontend with the token in the URL
    return redirect(f"http://127.0.0.1:3000?token={access_token}")

# -------------------------
# Data routes( stats itself)))) (all use current user's token)
# -------------------------
@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask backend!"})

@app.route("/top-artists")
def top_artists():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_top_artists(limit=10, time_range="short_term")
    artists = [artist['name'] for artist in results['items']]
    return jsonify({"top_artists_last_4_weeks": artists})

@app.route("/top-tracks")
def top_tracks():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_top_tracks(limit=10, time_range="short_term")
    tracks = [{"name": t["name"], "artist": t["artists"][0]["name"]} for t in results["items"]]
    return jsonify({"top_tracks_last_4_weeks": tracks})

@app.route("/top-artists-medium")
def top_artists_medium():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_top_artists(limit=10, time_range="medium_term")
    artists = [artist["name"] for artist in results["items"]]
    return jsonify({"top_artists_last_6_months": artists})

@app.route("/top-artists-long")
def top_artists_long():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_top_artists(limit=10, time_range="long_term")
    artists = [artist["name"] for artist in results["items"]]
    return jsonify({"top_artists_all_time": artists})

@app.route("/recently-played")
def recently_played():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_recently_played(limit=20)
    tracks = [{"name": item["track"]["name"], "artist": item["track"]["artists"][0]["name"]}
              for item in results["items"]]
    return jsonify({"recently_played": tracks})

@app.route("/hidden-gems")
def hidden_gems():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    tracks = [{"name": t["name"], "artist": t["artists"][0]["name"], "popularity": t["popularity"]}
              for t in results["items"] if t["popularity"] < 50]
    return jsonify({"hidden_gems": tracks})

@app.route("/most-skipped")
def most_skipped():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_recently_played(limit=50)
    tracks = {}
    for item in results["items"]:
        key = f"{item['track']['name']} - {item['track']['artists'][0]['name']}"
        tracks[key] = tracks.get(key, 0) + 1
    skipped_tracks = sorted(tracks.items(), key=lambda x: x[1])[:10]
    skipped_list = [{"track": t[0], "approx_plays": t[1]} for t in skipped_tracks]
    return jsonify({"most_skipped": skipped_list})

@app.route("/top-artist-morning")
def top_artist_morning():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_recently_played(limit=50)
    morning_tracks = [item for item in results["items"]
                      if 5 <= datetime.fromisoformat(item["played_at"][:-1]).hour < 11]
    artists = {}
    for item in morning_tracks:
        artist = item["track"]["artists"][0]["name"]
        artists[artist] = artists.get(artist, 0) + 1
    top_artist = max(artists, key=artists.get) if artists else None
    return jsonify({"top_artist_morning": top_artist})

@app.route("/top-artist-evening")
def top_artist_evening():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_recently_played(limit=50)
    evening_tracks = [item for item in results["items"]
                      if 17 <= datetime.fromisoformat(item["played_at"][:-1]).hour < 23]
    artists = {}
    for item in evening_tracks:
        artist = item["track"]["artists"][0]["name"]
        artists[artist] = artists.get(artist, 0) + 1
    top_artist = max(artists, key=artists.get) if artists else None
    return jsonify({"top_artist_evening": top_artist})

@app.route("/longest-listening-streak")
def longest_listening_streak():
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401
    results = sp.current_user_recently_played(limit=50)
    if not results["items"]:
        return jsonify({"longest_streak_days": 0})
    dates = sorted({datetime.fromisoformat(item["played_at"][:-1]).date() for item in results["items"]})
    max_streak = current_streak = 1
    for i in range(1, len(dates)):
        if (dates[i] - dates[i-1]).days == 1:
            current_streak += 1
            max_streak = max(max_streak, current_streak)
        else:
            current_streak = 1
    return jsonify({"longest_streak_days": max_streak})

@app.route("/most-popular-track")
def most_popular_track():
    """Your most mainstream track - highest popularity score"""
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401

    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    if not results["items"]:
        return jsonify({"track": "Not available", "artist": "", "popularity": 0})

    most_popular = max(results["items"], key=lambda t: t["popularity"])
    return jsonify({
        "track": most_popular["name"],
        "artist": most_popular["artists"][0]["name"],
        "popularity": most_popular["popularity"]
    })

@app.route("/least-popular-track")
def least_popular_track():
    """Your most underground/obscure track - lowest popularity score"""
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401

    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    if not results["items"]:
        return jsonify({"track": "Not available", "artist": "", "popularity": 0})

    least_popular = min(results["items"], key=lambda t: t["popularity"])
    return jsonify({
        "track": least_popular["name"],
        "artist": least_popular["artists"][0]["name"],
        "popularity": least_popular["popularity"]
    })

@app.route("/popularity-distribution")
def popularity_distribution():
    """Distribution of track popularity: underground (<30), moderate (30-60), mainstream (>60)"""
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401

    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")

    distribution = {"underground": 0, "moderate": 0, "mainstream": 0}
    for track in results["items"]:
        pop = track["popularity"]
        if pop < 30:
            distribution["underground"] += 1
        elif pop < 60:
            distribution["moderate"] += 1
        else:
            distribution["mainstream"] += 1

    return jsonify({"popularity_distribution": distribution})

@app.route("/avg-popularity")
def avg_popularity():
    """Average popularity of your top tracks"""
    sp = get_user_spotify()
    if not sp:
        return jsonify({"error": "Not authenticated"}), 401

    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    if not results["items"]:
        return jsonify({"avg_popularity": 0})

    avg = sum(t["popularity"] for t in results["items"]) / len(results["items"])
    return jsonify({"avg_popularity": round(avg, 1)})




# cut off, heres where we run it
if __name__ == "__main__":
    app.run(debug=True, port=8000)