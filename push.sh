#!/bin/bash

# Navigate to project directory
cd ~/Desktop/AgroConect_ServiceHub

# Check current branch
git status

# Add all changes
git add .

# Commit changes
git commit -m "Add Sensor Planner feature with interactive map and area calculations"

# Pull latest changes
git pull --rebase origin AgroConect+

# Push to GitHub
git push origin AgroConect+
