# 🚀 GitHub Upload Instructions

## Quick Upload to GitHub

1. **Move to your workspace:**
   ```bash
   bash setup.sh
   ```

2. **Initialize Git:**
   ```bash
   cd ~/email-intelligence-extension  # or your chosen directory
   git init
   git add .
   git commit -m "Initial commit: Email Intelligence Extension"
   ```

3. **Create GitHub repo and upload:**
   ```bash
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/email-intelligence-extension.git
   git branch -M main
   git push -u origin main
   ```

## Local Development

### Admin Panel:
```bash
cd admin-panel
npm install
cp .env.example .env  # Add your OpenAI API key
npm start  # Runs on http://localhost:3000
```

### Chrome Extension:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

## Environment Setup:
Edit `admin-panel/.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
PORT=3000
```
