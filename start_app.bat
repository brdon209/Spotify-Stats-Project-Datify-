@echo off
title Spotify Stats App Launcher

echo Starting backend...
start cmd /k "cd /d C:\Users\brdon\SpotifySTATSPROJECT\backend && python app.py"

timeout /t 3 > nul

echo Starting frontend...
start cmd /k "cd /d C:\Users\brdon\SpotifySTATSPROJECT\frontend && npm start"

echo All done! Backend and frontend should now be running.
pause
