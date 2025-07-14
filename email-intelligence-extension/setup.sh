#!/bin/bash
echo "📦 Email Intelligence Extension Setup"
echo "Choose destination directory (default: ~/email-intelligence-extension):"
read -r DEST_DIR
DEST_DIR=${DEST_DIR:-~/email-intelligence-extension}

# Copy files
cp -r /tmp/email-intelligence-extension "$DEST_DIR"
cd "$DEST_DIR"

# Setup admin panel
cd admin-panel
npm install
cp .env.example .env
echo "✅ Setup complete!"
echo "📝 Edit .env file with your OpenAI API key"
echo "🚀 Run: npm start (for admin panel)"
echo "🔧 Load extension/ folder in Chrome"
