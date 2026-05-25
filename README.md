# Fit Tracker - Personal Fitness App

A private, offline-first fitness and nutrition tracking app for iPhone.

## What it does

- Tracks meals, workouts, water, weight, sleep, energy, mood, sciatica
- Adapts workout plan automatically across 3 phases (Foundation → Build → Push)
- Works offline once installed
- Saves all data locally on your phone (private, never sent anywhere)
- Generates daily and weekly summaries you can paste into Claude chat for AI coaching

## Quick deploy to GitHub Pages (10 minutes)

### Step 1: Create a GitHub account
1. Go to https://github.com
2. Sign up (free)

### Step 2: Create a new repository
1. Click the `+` icon top right → "New repository"
2. Name: `fit-tracker` (or anything you want)
3. Set to **Public**
4. Check "Add a README file"
5. Click "Create repository"

### Step 3: Upload files
1. Click "Add file" → "Upload files"
2. Drag ALL these files into the upload area:
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
3. Click "Commit changes"

### Step 4: Enable GitHub Pages
1. Go to repo Settings tab
2. Click "Pages" in the left sidebar
3. Under "Source", select branch: `main`, folder: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes
6. Your app is now live at: `https://YOUR-USERNAME.github.io/fit-tracker/`

### Step 5: Install on iPhone home screen
1. Open Safari on your iPhone (must be Safari, not Chrome)
2. Go to your app URL
3. Tap the Share button (square with arrow up)
4. Scroll down → "Add to Home Screen"
5. Name it "Fit Tracker"
6. Tap "Add"
7. It now appears as an app icon on your home screen
8. Tap to open — runs full-screen, looks like a native app

## How to use

1. Open the app daily
2. Tap items to mark them complete (water cups, meals, exercises, habits)
3. Slide the sliders for energy, mood, sciatica
4. Enter weight in the morning (Mondays minimum)
5. Add notes about how the day went
6. At end of day: tap "Copy summary for Claude" → paste in your Claude chat for analysis
7. Every Monday: tap "Copy weekly review for Claude" → get a deeper weekly analysis

## Privacy

All data is stored locally in your browser's localStorage on your iPhone. Nothing is sent anywhere. You can export your data anytime as JSON from the History tab.

## Phases

- **Phase 0 (Weeks 1-3):** Foundation - mobility, posture, bodyweight only
- **Phase 1 (Weeks 4-7):** Build - light weights added
- **Phase 2 (Weeks 8-12):** Push - progressive overload

The app switches phases automatically based on day count.

## Goal

Lose 8-10kg by 20 Aug 2026. Reverse Grade 1 fatty liver. Normalize ALT.
