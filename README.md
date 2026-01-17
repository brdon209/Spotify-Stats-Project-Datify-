# Datify - Spotify Stats Visualizer

A web app that visualizes your Spotify listening habits with detailed statistics and an interactive song guessing game.

## Features

### Statistics Dashboard
- **Niche Connoisseur Score** - Algorithmic score (0-100) measuring how underground your taste is
  - Based on obscurity factor, hidden gems count, mainstream penalty, and diversity bonus
  - Interactive formula explanation modal
- **Top Artists & Tracks** - Your most-played content from the last 4 weeks
- **Hidden Gems** - Underground music favorites (tracks with popularity under 50)
- **Taste Spectrum** - Pie chart visualization of your music taste distribution (Underground/Moderate/Mainstream)
- **Listening Streak** - Track your consecutive days of listening
- **Time-Based Insights** - Discover what you listen to in the morning (5am-11am) vs evening (5pm-11pm)
- **Recently Played** - Last 5 tracks with timestamps
- **Song of the Day** - Random selection from your top songs with album art
- **Peak Popularity** - Your most mainstream track
- **Hidden Treasure** - Your most underground track

### Interactive Features
- **Guess Your Song Game** - 5-round music quiz using YOUR own top tracks
  - Plays full songs using Spotify Web Playback SDK
  - **Song names are completely hidden** - just a play button and status messages
  - Real-time playback control with connection status
  - Four multiple-choice options per round
  - Score tracking across rounds
  - Requires Spotify Premium
- **Interactive Charts** - Beautiful visualizations using Recharts
- **Real-time Data** - Live sync with Spotify API

## Tech Stack

**Frontend:** 
- React
- Recharts (data visualization)
- Lucide React (icons)
- Spotify Web Playback SDK (anonymous music playback)

**Backend:** 
- Flask
- Spotipy (Spotify API wrapper)
- Flask-CORS

## Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Spotify Developer Account
- **Spotify Premium** (required for the song guessing game)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brdon209/Spotify-Stats-Project-Datify-.git
cd Spotify-Stats-Project-Datify-
```

2. Set up Spotify Developer App:
   - Create a new app at https://developer.spotify.com/dashboard
   - Add `http://127.0.0.1:8000/callback` to Redirect URIs
   - Copy your Client ID and Client Secret

3. Backend setup:
```bash
cd backend
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```env
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://127.0.0.1:8000/callback
```

5. Frontend setup:
```bash
cd frontend
npm install
```

### Running Locally

1. Start the backend (runs on port 8000):
```bash
cd backend
python app.py
```

2. Start the frontend (runs on port 3000):
```bash
cd frontend
npm start
```

3. Navigate to `http://localhost:3000` in your browser

4. Click "Launch Experience" and authorize with Spotify

## API Endpoints

**Authentication:**
- `GET /login` - Initiate Spotify OAuth flow
- `GET /callback` - OAuth callback handler

**Statistics:**
- `GET /top-artists` - Top 10 artists (last 4 weeks)
- `GET /top-tracks` - Top 10 tracks (last 4 weeks)
- `GET /hidden-gems` - Tracks with popularity < 50
- `GET /popularity-distribution` - Music taste breakdown (underground/moderate/mainstream)
- `GET /longest-listening-streak` - Consecutive listening days
- `GET /most-popular-track` - Highest popularity score
- `GET /least-popular-track` - Lowest popularity score
- `GET /avg-popularity` - Average popularity score
- `GET /top-artist-morning` - Most-played artist (5am-11am)
- `GET /top-artist-evening` - Most-played artist (5pm-11pm)
- `GET /recently-played-last-5` - Last 5 played tracks with timestamps
- `GET /song-of-the-day` - Random track from top 50 with album art
- `GET /niche-score` - Calculate Niche Connoisseur Score with detailed breakdown

**Game:**
- `GET /guess-song-game` - Returns 4 song options + correct track ID for quiz game

## Niche Connoisseur Score

A proprietary algorithm that measures how underground your music taste is:

**Formula:**
```
Score = (Obscurity Factor × Hidden Gems Multiplier) - Mainstream Penalty + Diversity Bonus
```

**Components:**
- **Obscurity Factor (OF):** 100 - average popularity
- **Hidden Gems Multiplier (HGM):** 1 + (hidden gems count / 50)
- **Mainstream Penalty (MP):** (mainstream tracks / total) × 30
- **Diversity Bonus (DB):** (unique artists / total × 50), capped at 20

**Rating Tiers:**
- 80-100: Underground Legend
- 60-79: Niche Explorer
- 40-59: Eclectic Listener
- 20-39: Casual Discoverer
- 0-19: Mainstream Maven

## How the Song Game Works

The game uses **Spotify Web Playback SDK** to play full tracks without showing any metadata:

1. Fetches your top tracks from Spotify
2. Randomly selects one as the correct answer
3. Adds 3 other tracks as decoys
4. Creates an anonymous web player that plays the song with **NO visible track name**
5. Shows connection status ("Initializing...", "SDK ready...", "Ready!")
6. You guess which track is playing from 4 options
7. 5 rounds total with score tracking
8. Displays final score after all rounds

**Note:** Requires Spotify Premium subscription. If authentication errors occur, a re-login prompt will appear. If the connection fails, a refresh button is provided.

## Design

The app features:
- Purple gradient design with glassmorphism effects
- Smooth animations and transitions
- Responsive layouts for all screen sizes
- Vibrant color gradients for data visualization
- Modern card-based UI
- Custom audio player with hidden metadata and debug messages
- Interactive modals for detailed information

## Screenshots

*(Add screenshots here)*

## Future Features

- Export stats as image
- Playlist generator based on taste profile
- Historical trend tracking
- Social sharing features
- More game modes
- Leaderboard for Niche Score

## Known Issues

- Spotify Web Playback SDK can be occasionally flaky - refresh if the player doesn't connect
- Game requires Spotify Premium
- Some tracks may not have preview URLs available
- Player may show authentication or account errors if token expires or non-Premium account is used

## Contributing

Bug reports and feature suggestions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License

## Author

**Brandon Lee**

GitHub: [@brdon209](https://github.com/brdon209)

---

*Built with love and fueled by questionable music taste*
