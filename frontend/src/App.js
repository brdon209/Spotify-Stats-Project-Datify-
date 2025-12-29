import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Music, TrendingUp, Clock, Award, Zap, Sparkles, Headphones } from "lucide-react";

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
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setToken(urlToken);
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
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`${url} failed`);
        }
        return res.json();
      };

      const [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11] = await Promise.all([
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
        fetchJSON("http://127.0.0.1:8000/recently-played-last-5"),
      ]);

      setTopArtists(a1.top_artists_last_4_weeks || []);
      setTopTracks(a2.top_tracks_last_4_weeks || []);
      setHiddenGems(a3.hidden_gems || []);
      setPopularityDistribution(a4.popularity_distribution || null);
      setLongestStreak(a5.longest_streak_days);
      setMostPopularTrack(a6 || null);
      setLeastPopularTrack(a7 || null);
      setAvgPopularity(a8.avg_popularity || null);
      setTopArtistMorning(a9.top_artist_morning || null);
      setTopArtistEvening(a10.top_artist_evening || null);
      setRecentlyPlayed(a11.recently_played_last_5 || []);
      setStatsLoaded(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const pieColors = ["#667eea", "#f857a6", "#4facfe", "#43e97b", "#feca57"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "60px 24px"
    }}>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "20px", 
            marginBottom: "24px",
            background: "rgba(255,255,255,0.05)",
            padding: "16px 32px",
            borderRadius: "100px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
  
            <h1 style={{ 
              fontSize: "52px", 
              fontWeight: "900", 
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #f857a6 50%, #feca57 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Datify 
            </h1>
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "20px", margin: 0 }}>
            Your musical universe, written in statistics
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "20px", margin: 0 }}>
            by Brandon Lee 
          </p>
        </div>

        {!token && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "32px",
            padding: "80px 48px",
            textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px"
            }}>
              <Music size={50} color="#fff" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: "38px", marginBottom: "20px", fontWeight: "800" }}>
              Connect Your World
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "40px", fontSize: "17px" }}>
              Lets dive into those listening patterns! How embarrasing could it be?
            </p>
            <button onClick={login} style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              padding: "18px 56px",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Launch Experience
            </button>
          </div>
        )}

        {token && !statsLoaded && !loading && (
          <div style={{ textAlign: "center" }}>
            <button onClick={loadStats} style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "100px",
              padding: "18px 56px",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Reveal My Stats
            </button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{
              width: "80px",
              height: "80px",
              border: "6px solid rgba(255,255,255,0.1)",
              borderTop: "6px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 32px"
            }} />
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px", fontWeight: "600" }}>
              Arpeggiating your auditory habits.....
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(255, 68, 68, 0.2)",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "32px",
            border: "1px solid rgba(255, 68, 68, 0.4)"
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {statsLoaded && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              marginBottom: "48px"
            }}>
              {[
                { icon: Award, title: "Listening Streak", value: `${longestStreak}`, sub: "days", g: ["#667eea", "#764ba2"] },
                { icon: TrendingUp, title: "Taste Index", value: avgPopularity !== null ? `${avgPopularity}` : "—", sub: avgPopularity > 60 ? "Mainstream" : avgPopularity > 30 ? "Eclectic" : "Underground", g: ["#f857a6", "#ff5858"] },
                { icon: Zap, title: "Hidden Gems", value: hiddenGems.length, sub: "rare finds", g: ["#4facfe", "#00f2fe"] },
                { icon: Headphones, title: "Top Tracks", value: topTracks.length, sub: "favorites", g: ["#43e97b", "#38f9d7"] }
              ].map((card, idx) => (
                <div key={idx} style={{
                  background: `linear-gradient(135deg, ${card.g[0]}, ${card.g[1]})`,
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ 
                    background: "rgba(255,255,255,0.2)",
                    padding: "12px", 
                    borderRadius: "16px",
                    display: "inline-flex",
                    marginBottom: "16px"
                  }}>
                    <card.icon size={28} color="#fff" strokeWidth={2.5} />
                  </div>
                  <h3 style={{ 
                    color: "rgba(255,255,255,0.9)", 
                    fontSize: "13px", 
                    fontWeight: "600", 
                    margin: "0 0 8px 0",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px"
                  }}>
                    {card.title}
                  </h3>
                  <div style={{ color: "#fff", fontSize: "42px", fontWeight: "800", marginBottom: "6px" }}>
                    {card.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: "500" }}>
                    {card.sub}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "28px",
              marginBottom: "48px"
            }}>
              {popularityDistribution && (
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "28px",
                  padding: "36px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <h2 style={{ marginTop: 0, marginBottom: "28px", fontSize: "24px", fontWeight: "800" }}>
                    Taste Spectrum
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Underground", value: popularityDistribution.underground },
                          { name: "Moderate", value: popularityDistribution.moderate },
                          { name: "Mainstream", value: popularityDistribution.mainstream }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={2}
                      >
                        {pieColors.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "rgba(15, 12, 41, 0.95)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "20px" }}>
                {mostPopularTrack && (
                  <div style={{
                    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                    borderRadius: "24px",
                    padding: "28px"
                  }}>
                    <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      Peak Popularity
                    </h3>
                    <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
                      {mostPopularTrack.track}
                    </div>
                    <div style={{ fontSize: "15px", marginBottom: "12px" }}>
                      {mostPopularTrack.artist}
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "900" }}>
                      {mostPopularTrack.popularity}/100
                    </div>
                  </div>
                )}

                {leastPopularTrack && (
                  <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "24px",
                    padding: "28px"
                  }}>
                    <h3 style={{ marginTop: 0, marginBottom: "12px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      Hidden Treasure
                    </h3>
                    <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
                      {leastPopularTrack.track}
                    </div>
                    <div style={{ fontSize: "15px", marginBottom: "12px" }}>
                      {leastPopularTrack.artist}
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "900" }}>
                      {leastPopularTrack.popularity}/100
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "28px",
              padding: "36px",
              marginBottom: "32px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "28px", fontSize: "28px", fontWeight: "800" }}>
                Top Artists
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {topArtists.slice(0, 6).map((artist, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${pieColors[i % 5]}, ${pieColors[(i + 1) % 5]})`,
                      color: "#fff",
                      minWidth: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      fontSize: "22px"
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "600" }}>
                      {artist}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "28px",
              padding: "36px",
              marginBottom: "32px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <h2 style={{ marginTop: 0, marginBottom: "28px", fontSize: "28px", fontWeight: "800" }}>
                Top Tracks
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {topTracks.slice(0, 6).map((track, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: "20px 24px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${pieColors[i % 5]}, ${pieColors[(i + 1) % 5]})`,
                      color: "#fff",
                      minWidth: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900",
                      fontSize: "22px"
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                        {track.name}
                      </div>
                      <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)" }}>
                        {track.artist}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginBottom: "32px"
            }}>
              <div style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "24px",
                padding: "32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <Clock size={28} color="#fff" strokeWidth={2.5} />
                  <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Morning Ritual</h3>
                </div>
                <p style={{ fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>5am - 11am</p>
                <p style={{ fontSize: "24px", fontWeight: "800" }}>
                  {topArtistMorning || "No data yet"}
                </p>
              </div>

              
                <div style={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                borderRadius: "24px",
                padding: "32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <Clock size={28} color="#fff" strokeWidth={2.5} />
                  <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>Evening Wind Down</h3>
                </div>
                <p style={{ fontSize: "14px", marginBottom: "12px", fontWeight: "600" }}>5pm - 11pm</p>
                <p style={{ fontSize: "24px", fontWeight: "800" }}>
                  {topArtistEvening || "No data yet"}
                </p>
              </div>
            </div>

            {recentlyPlayed.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "28px",
                padding: "36px",
                marginBottom: "32px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <h2 style={{ marginTop: 0, marginBottom: "28px", fontSize: "28px", fontWeight: "800" }}>
                  Recently Played
                </h2>
                <div style={{ display: "grid", gap: "16px" }}>
                  {recentlyPlayed.map((track, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "20px 24px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div>
                        <div style={{ fontSize: "17px", fontWeight: "600", marginBottom: "4px" }}>
                          {track.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                          {track.artist}
                        </div>
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "13px",
                        fontWeight: "600"
                      }}>
                        {new Date(track.played_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            

            {hiddenGems.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "28px",
                padding: "36px",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <h2 style={{ marginTop: 0, marginBottom: "28px", fontSize: "28px", fontWeight: "800" }}>
                  Hidden Gems
                </h2>
                <div style={{ display: "grid", gap: "16px" }}>
                  {hiddenGems.slice(0, 8).map((track, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "20px 24px",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                      <div>
                        <div style={{ fontSize: "17px", fontWeight: "600", marginBottom: "4px" }}>
                          {track.name}
                        </div>
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
                          {track.artist}
                        </div>
                      </div>
                      <div style={{
                        background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: "800"
                      }}>
                        {track.popularity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;