import React, { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [moodDistribution, setMoodDistribution] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [happiestTrack, setHappiestTrack] = useState(null);
  const [avgStats, setAvgStats] = useState(null);
  const [topArtistMorning, setTopArtistMorning] = useState(null);
  const [topArtistEvening, setTopArtistEvening] = useState(null);

  const login = () => {
    window.location.href = "http://127.0.0.1:8000/login";
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const fetchJSON = async (url) => {
        const res = await fetch(url, { credentials: "include" });
        return res.json();
      };

      const [
        topArtistsData,
        topTracksData,
        hiddenGemsData,
        moodData,
        streakData,
        happiestData,
        avgData,
        morningData,
        eveningData,
      ] = await Promise.all([
        fetchJSON("http://127.0.0.1:8000/top-artists"),
        fetchJSON("http://127.0.0.1:8000/top-tracks"),
        fetchJSON("http://127.0.0.1:8000/hidden-gems"),
        fetchJSON("http://127.0.0.1:8000/mood-distribution"),
        fetchJSON("http://127.0.0.1:8000/longest-listening-streak"),
        fetchJSON("http://127.0.0.1:8000/happiest-track"),
        fetchJSON("http://127.0.0.1:8000/top-tracks-averages"),
        fetchJSON("http://127.0.0.1:8000/top-artist-morning"),
        fetchJSON("http://127.0.0.1:8000/top-artist-evening"),
      ]);

      setTopArtists(topArtistsData.top_artists_last_4_weeks || []);
      setTopTracks(topTracksData.top_tracks_last_4_weeks || []);
      setHiddenGems(hiddenGemsData.hidden_gems || []);
      setMoodDistribution(moodData.mood_distribution || null);
      setLongestStreak(streakData.longest_streak_days);
      setHappiestTrack(happiestData || null);
      setAvgStats(avgData || null);
      setTopArtistMorning(morningData.top_artist_morning || null);
      setTopArtistEvening(eveningData.top_artist_evening || null);

      setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Spotify Stats Dashboard</h1>
      {!loggedIn && (
        <button
          onClick={login}
          style={{ margin: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Login with Spotify
        </button>
      )}

      {loggedIn || (
        <button
          onClick={loadStats}
          style={{ margin: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Load My Stats
        </button>
      )}

      {loading && <p>Loading your stats...</p>}

      {loggedIn && (
        <div>
          <h2>Top Artists (Last 4 Weeks)</h2>
          <ul>{topArtists.map((a, i) => <li key={i}>{a}</li>)}</ul>

          <h2>Top Tracks (Last 4 Weeks)</h2>
          <ul>{topTracks.map((t, i) => <li key={i}>{t.name} - {t.artist}</li>)}</ul>

          <h2>Hidden Gems</h2>
          <ul>{hiddenGems.map((t, i) => <li key={i}>{t.name} - {t.artist} (pop: {t.popularity})</li>)}</ul>

          <h2>Mood Distribution</h2>
          {moodDistribution && (
            <ul>
              <li>Low: {moodDistribution.low}</li>
              <li>Medium: {moodDistribution.medium}</li>
              <li>High: {moodDistribution.high}</li>
            </ul>
          )}

          <h2>Longest Listening Streak</h2>
          {longestStreak !== null && <p>{longestStreak} days</p>}

          <h2>Happiest Track</h2>
          {happiestTrack && <p>{happiestTrack.track} - {happiestTrack.artist} (Valence: {happiestTrack.valence})</p>}

          <h2>Average Stats</h2>
          {avgStats && (
            <ul>
              <li>Average Valence: {avgStats.avg_valence.toFixed(2)}</li>
              <li>Average Energy: {avgStats.avg_energy.toFixed(2)}</li>
              <li>Average Danceability: {avgStats.avg_danceability.toFixed(2)}</li>
            </ul>
          )}

          <h2>Top Artist Morning</h2>
          {topArtistMorning && <p>{topArtistMorning}</p>}

          <h2>Top Artist Evening</h2>
          {topArtistEvening && <p>{topArtistEvening}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
