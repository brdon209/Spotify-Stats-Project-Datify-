import os
from datetime import datetime
from flask import Flask, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()  # load variables from .env

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

app = Flask(__name__)
app.secret_key = "super_secret_key"  # for sessions
CORS(app)

# Spotify scope
scope = "user-top-read user-read-recently-played"

# Helper function to get Spotify object for current user
def get_user_spotify():
    token_info = session.get("token_info", None)
    if not token_info:
        return None
    access_token = token_info["access_token"]
    return spotipy.Spotify(auth=access_token)

# -------------------------
# LOGIN / CALLBACK ROUTES
# -------------------------
@app.route("/login")
def login():
    sp_oauth = SpotifyOAuth(client_id=CLIENT_ID,
                            client_secret=CLIENT_SECRET,
                            redirect_uri=REDIRECT_URI,
                            scope=scope)
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route("/callback")
def callback():
    sp_oauth = SpotifyOAuth(client_id=CLIENT_ID,
                            client_secret=CLIENT_SECRET,
                            redirect_uri=REDIRECT_URI,
                            scope=scope)
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info
    return redirect(url_for("dashboard"))

# Optional dashboard page (simple JSON for now)
@app.route("/dashboard")
def dashboard():
    if not session.get("token_info"):
        return redirect("/login")
    return jsonify({"message": "You are logged in! Use the endpoints to see your Spotify stats."})

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
        return redirect("/login")
    results = sp.current_user_top_artists(limit=10, time_range="short_term")
    artists = [artist['name'] for artist in results['items']]
    return jsonify({"top_artists_last_4_weeks": artists})

@app.route("/top-tracks")
def top_tracks():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    results = sp.current_user_top_tracks(limit=10, time_range="short_term")
    tracks = [{"name": t["name"], "artist": t["artists"][0]["name"]} for t in results["items"]]
    return jsonify({"top_tracks_last_4_weeks": tracks})

@app.route("/top-artists-medium")
def top_artists_medium():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    results = sp.current_user_top_artists(limit=10, time_range="medium_term")
    artists = [artist["name"] for artist in results["items"]]
    return jsonify({"top_artists_last_6_months": artists})

@app.route("/top-artists-long")
def top_artists_long():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    results = sp.current_user_top_artists(limit=10, time_range="long_term")
    artists = [artist["name"] for artist in results["items"]]
    return jsonify({"top_artists_all_time": artists})

@app.route("/recently-played")
def recently_played():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    results = sp.current_user_recently_played(limit=20)
    tracks = [{"name": item["track"]["name"], "artist": item["track"]["artists"][0]["name"]}
              for item in results["items"]]
    return jsonify({"recently_played": tracks})

@app.route("/hidden-gems")
def hidden_gems():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    tracks = [{"name": t["name"], "artist": t["artists"][0]["name"], "popularity": t["popularity"]}
              for t in results["items"] if t["popularity"] < 50]
    return jsonify({"hidden_gems": tracks})

@app.route("/most-skipped")
def most_skipped():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
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
        return redirect("/login")
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
        return redirect("/login")
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
        return redirect("/login")
    results = sp.current_user_recently_played(limit=200)
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

@app.route("/happiest-track")
def happiest_track():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    
    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    track_ids = [t["id"] for t in results["items"]]
    features = sp.audio_features(track_ids)
    
    happiest = max(zip(results["items"], features), key=lambda x: x[1]["valence"])
    track, feat = happiest
    
    return jsonify({
        "track": track["name"],
        "artist": track["artists"][0]["name"],
        "valence": feat["valence"]
    })


@app.route("/top-tracks-averages")
def top_tracks_averages():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    
    results = sp.current_user_top_tracks(limit=20, time_range="medium_term")
    track_ids = [t["id"] for t in results["items"]]
    features = sp.audio_features(track_ids)
    
    avg_valence = sum(f["valence"] for f in features) / len(features)
    avg_energy = sum(f["energy"] for f in features) / len(features)
    avg_dance = sum(f["danceability"] for f in features) / len(features)
    
    return jsonify({
        "avg_valence": avg_valence,
        "avg_energy": avg_energy,
        "avg_danceability": avg_dance
    })

@app.route("/mood-distribution")
def mood_distribution():
    sp = get_user_spotify()
    if not sp:
        return redirect("/login")
    
    # Get top 50 tracks (medium term for more data)
    results = sp.current_user_top_tracks(limit=50, time_range="medium_term")
    track_ids = [track["id"] for track in results["items"]]
    
    # Get audio features
    features = sp.audio_features(track_ids)
    
    # Classify valence into Low, Medium, High
    mood_counts = {"low": 0, "medium": 0, "high": 0}
    for feat in features:
        valence = feat["valence"]
        if valence < 0.33:
            mood_counts["low"] += 1
        elif valence < 0.66:
            mood_counts["medium"] += 1
        else:
            mood_counts["high"] += 1
    
    return jsonify({"mood_distribution": mood_counts})




# cut off, heres where we run it
if __name__ == "__main__":
    app.run(debug=True, port=8000)
