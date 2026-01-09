# Datify - Spotify Stats Visualizer

A web app that visualizes your Spotify listening habits with detailed statistics and interactive features.

## Features

### Statistics Dashboard
- Top Artists & Tracks from the last 4 weeks
- Hidden Gems - underground music favorites (tracks with popularity under 50)
- Taste Spectrum - visualization of your music taste distribution
- Listening Streak tracker
- Time-Based Insights - see what you listen to in the morning vs evening
- Recently Played - last 5 tracks with timestamps
- Song of the Day - random selection from your top songs

### Interactive Features
- Guess Your Song Game - 5-round quiz using your own top tracks
- Charts and visualizations using Recharts
- Real-time data from Spotify API

## Tech Stack

**Frontend:** React, Recharts, Lucide React (deployed on Vercel)

**Backend:** Flask, Spotipy, Flask-CORS (deployed on Render)

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Spotify Developer Account

### Installation

Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/SpotifySTATSPROJECT.git
cd SpotifySTATSPROJECT
```

Set up Spotify Developer App:
- Create a new app at https://developer.spotify.com/dashboard
- Add `http://127.0.0.1:8000/callback` to Redirect URIs
- Copy your Client ID and Client Secret

Backend setup:
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:
```
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://127.0.0.1:8000/callback
```

Frontend setup:
```bash
cd frontend
npm install
```

### Running Locally

Start the backend (runs on port 8000):
```bash
cd backend
python app.py
```

Start the frontend (runs on port 3000):
```bash
cd frontend
npm start
```

Navigate to `http://localhost:3000` in your browser.

## API Endpoints

- `/login` - Spotify OAuth flow
- `/callback` - OAuth callback handler
- `/top-artists` - Top 10 artists (last 4 weeks)
- `/top-tracks` - Top 10 tracks (last 4 weeks)
- `/hidden-gems` - Tracks with popularity < 50
- `/popularity-distribution` - Music taste breakdown
- `/longest-listening-streak` - Consecutive listening days
- `/most-popular-track` - Highest popularity score
- `/least-popular-track` - Lowest popularity score
- `/avg-popularity` - Average popularity score
- `/top-artist-morning` - Most-played artist (5am-11am)
- `/top-artist-evening` - Most-played artist (5pm-11pm)
- `/recently-played-last-5` - Last 5 played tracks
- `/song-of-the-day` - Random track from top 50
- `/guess-song-game` - Game data for music quiz

## Design

The app features a purple gradient design with glassmorphism effects, smooth animations, and responsive layouts. All visualizations use vibrant color gradients to make the data engaging and easy to understand.

## Contributing

Bug reports and feature suggestions are welcome. Feel free to open an issue or submit a pull request.

## License

MIT License

## Author

Brandon Lee
