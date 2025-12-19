import React, { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [popularityDistribution, setPopularityDistribution] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [mostPopularTrack, setMostPopularTrack] = useState(null);
  const [leastPopularTrack, setLeastPopularTrack] = useState(null);
  const [avgPopularity, setAvgPopularity] = useState(null);
  const [topArtistMorning, setTopArtistMorning] = useState(null);
  const [topArtistEvening, setTopArtistEvening] = useState(null);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Check for token in URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
      // Clean up the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const login = () => {
    window.location.href = "http://127.0.0.1:8000/login";
  };

  const loadStats = async () => {
    if (!token) {
      alert("Please login with Spotify first!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchJSON = async (url) => {
        try {
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`${url} returned ${res.status}: ${errorText}`);
          }
          return res.json();
        } catch (fetchErr) {
          throw new Error(`Failed to fetch ${url}: ${fetchErr.message}`);
        }
      };

      const [
        topArtistsData,
        topTracksData,
        hiddenGemsData,
        popularityDistData,
        streakData,
        mostPopularData,
        leastPopularData,
        avgPopData,
        morningData,
        eveningData,
      ] = await Promise.all([
        fetchJSON("http://127.0.0.1:8000/top-artists"),
        fetchJSON("http://127.0.0.1:8000/top-tracks"),
        fetchJSON("http://127.0.0.1:8000/hidden-gems"),
        fetchJSON("http://127.0.0.1:8000/popularity-distribution"),
        fetchJSON("http://127.0.0.1:8000/longest-listening-streak"),
        fetchJSON("http://127.0.0.1:8000/most-popular-track"),
        fetchJSON("http://127.0.0.1:8000/least-popular-track"),
        fetchJSON("http://127.0.0.1:8000/avg-popularity"),
        fetchJSON("http://127.0.0.1:8000/top-artist-morning"),
        fetchJSON("http://127.0.0.1:8000/top-artist-evening"),
      ]);

      setTopArtists(topArtistsData.top_artists_last_4_weeks || []);
      setTopTracks(topTracksData.top_tracks_last_4_weeks || []);
      setHiddenGems(hiddenGemsData.hidden_gems || []);
      setPopularityDistribution(popularityDistData.popularity_distribution || null);
      setLongestStreak(streakData.longest_streak_days);
      setMostPopularTrack(mostPopularData || null);
      setLeastPopularTrack(leastPopularData || null);
      setAvgPopularity(avgPopData.avg_popularity || null);
      setTopArtistMorning(morningData.top_artist_morning || null);
      setTopArtistEvening(eveningData.top_artist_evening || null);

      setStatsLoaded(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Spotify Stats Dashboard</h1>

      {token && <p style={{color: "green"}}>Logged in (token received)</p>}

      {!token && (
        <button
          onClick={login}
          style={{ margin: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Login with Spotify
        </button>
      )}

      {token && !statsLoaded && (
        <button
          onClick={loadStats}
          style={{ margin: "10px", padding: "10px 20px", cursor: "pointer" }}
        >
          Load My Stats
        </button>
      )}

      {loading && <p>Loading your stats...</p>}

      {error && (
        <div style={{ color: "red", padding: "10px", border: "1px solid red", margin: "10px" }}>
          <strong>Error:</strong> {error}
          <br />
          <button onClick={() => { setError(null); setToken(null); }} style={{ marginTop: "10px" }}>
            Try Login Again
          </button>
        </div>
      )}

      {statsLoaded && (
        <div>
          <h2>Top Artists (Last 4 Weeks)</h2>
          <ul>{topArtists.map((a, i) => <li key={i}>{a}</li>)}</ul>

          <h2>Top Tracks (Last 4 Weeks)</h2>
          <ul>{topTracks.map((t, i) => <li key={i}>{t.name} - {t.artist}</li>)}</ul>

          <h2>Hidden Gems (Underground Favorites)</h2>
          <ul>{hiddenGems.map((t, i) => <li key={i}>{t.name} - {t.artist} (popularity: {t.popularity})</li>)}</ul>

          <h2>Your Music Taste Distribution</h2>
          {popularityDistribution && (
            <ul>
              <li>Underground (popularity &lt;30): {popularityDistribution.underground} tracks</li>
              <li>Moderate (30-60): {popularityDistribution.moderate} tracks</li>
              <li>Mainstream (&gt;60): {popularityDistribution.mainstream} tracks</li>
            </ul>
          )}

          <h2>Average Popularity Score</h2>
          {avgPopularity !== null && <p>{avgPopularity}/100 - {avgPopularity > 60 ? "You're pretty mainstream!" : avgPopularity > 30 ? "Nice balance of popular and obscure!" : "You're a true underground music fan!"}</p>}

          <h2>Most Mainstream Track</h2>
          {mostPopularTrack && <p>{mostPopularTrack.track} - {mostPopularTrack.artist} (popularity: {mostPopularTrack.popularity})</p>}

          <h2>Most Underground Track</h2>
          {leastPopularTrack && <p>{leastPopularTrack.track} - {leastPopularTrack.artist} (popularity: {leastPopularTrack.popularity})</p>}

          <h2>Longest Listening Streak</h2>
          {longestStreak !== null && <p>{longestStreak} days</p>}

          <h2>Top Artist Morning (5am-11am)</h2>
          {topArtistMorning ? <p>{topArtistMorning}</p> : <p>No morning listening data</p>}

          <h2>Top Artist Evening (5pm-11pm)</h2>
          {topArtistEvening ? <p>{topArtistEvening}</p> : <p>No evening listening data</p>}
        </div>
      )}
    </div>
  );
}

export default App;
