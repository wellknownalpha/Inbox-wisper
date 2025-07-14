# Inbox-wisper

A Chrome extension that integrates AI-powered email summarization and text-to-speech directly into Outlook, with a comprehensive admin panel for management and analytics.

## Features

### Browser Extension
- **Outlook Integration**: Works with Outlook.com, Office 365, and Outlook Live
- **AI Summarization**: Three levels of detail (headings, brief, detailed)
- **Text-to-Speech**: Convert summaries to audio files
- **Smart Filtering**: Filter by email type, sender, keywords, and domains
- **Real-time Processing**: Process emails directly in Outlook interface

### Admin Panel
- **Dashboard Analytics**: View processing statistics and trends
- **Email Management**: Browse and manage processed emails
- **Audio Library**: Access all generated audio files
- **Data Export**: Export processed data as CSV
- **Daily Digests**: Create combined audio summaries

## Installation

### 1. Extension Setup
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` folder
4. The extension will appear in your browser toolbar

### 2. Admin Panel Setup
```bash
cd admin-panel
npm install
npm start
```

The admin panel will be available at `http://localhost:3000/admin`

### 3. Configuration
1. Click the extension icon in Chrome
2. Configure your filtering preferences:
   - Select email types to process
   - Add whitelist senders
   - Set subject keywords
   - Specify domains
3. Set your OpenAI API key in the admin panel environment

## Usage

### In Outlook
1. Navigate to Outlook.com or Office 365
2. Open any email that matches your filters
3. Click the "🤖 Summarize" button that appears
4. View the AI-generated summary and listen to audio

### Admin Panel
1. Visit `http://localhost:3000/admin`
2. Monitor processing statistics
3. Browse processed emails
4. Create daily audio digests
5. Export data for analysis

## API Endpoints

- `POST /api/summarize` - Generate email summary
- `POST /api/tts` - Convert text to speech
- `POST /api/process-email` - Process complete email
- `GET /api/emails` - Retrieve processed emails

## Configuration

### Extension Settings
- **Email Types**: Newsletter, updates, promotions, notifications
- **Summary Types**: Headings only, brief, detailed
- **Filters**: Whitelist senders, keywords, domains

### Environment Variables
```
OPENAI_API_KEY=your_openai_api_key
```

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── content.js            # Outlook integration script
├── popup.html/js         # Extension settings interface
├── background.js         # Service worker
└── styles.css           # Extension styling

admin-panel/
├── server.js            # Express.js backend
├── package.json         # Node.js dependencies
└── public/
    └── admin.html       # Admin dashboard
```

## Technical Details

- **Extension**: Chrome Manifest V3
- **Backend**: Node.js with Express
- **Database**: SQLite for data storage
- **AI**: OpenAI GPT-3.5-turbo for summarization
- **TTS**: Google Text-to-Speech
- **Frontend**: Vanilla JavaScript with modern CSS

## Security

- Extension only accesses Outlook domains
- API keys stored securely in environment variables
- Local data storage with SQLite
- CORS enabled for extension communication

## Browser Compatibility

- Chrome (primary)
- Edge (Chromium-based)
- Other Chromium browsers

The extension provides a seamless integration with Outlook while maintaining a powerful admin interface for monitoring and management.
