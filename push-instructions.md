# Push to GitHub Instructions

Run these commands in Terminal:

\`\`\`bash
cd ~/Desktop/AgroConect_ServiceHub
git add .
git commit -m "Fix all table names to match Base44 PascalCase schema"
git pull --rebase origin AgroConect+
git push origin AgroConect+
\`\`\`

After deployment, all APIs will use correct PascalCase table names:
- MarketPrice (not market_prices)
- SoilAnalysis (not soil_analyses)
- Product, Consultation, Expert, etc.
