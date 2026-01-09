# Spike Feeder - Bearded Dragon Food Calculator

## Overview
A web-based calculator that helps track weekly food intake for Spike, a bearded dragon. Users can input different food types and quantities, and the app calculates total nutrition in "cricket equivalents."

## Features
- Track multiple food types (crickets, superworms, hornworms, dubia, mealworms)
- Visual progress bar showing intake vs weekly goal
- ASCII art bearded dragon that reacts to feeding status (happy, sad, overfed)
- Settings panel to customize:
  - Weekly food goal
  - Conversion rates for each food type
  - Add/remove custom food types
- Data persists in browser localStorage

## Project Structure
```
/
├── index.html      # Main HTML page
├── styles.css      # Styling
├── app.js          # Application logic
├── server.py       # Simple HTTP server for development
└── README.md       # Original requirements
```

## Tech Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Python SimpleHTTPServer for local development
- localStorage for data persistence

## Running Locally
The app runs on port 5000 using Python's built-in HTTP server:
```
python server.py
```

## Deployment
Configured as a static site deployment - serves HTML, CSS, and JS files directly.
