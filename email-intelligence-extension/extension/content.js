class OutlookEmailProcessor {
  constructor() {
    this.settings = {};
    this.loadSettings();
    this.init();
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get(['emailSettings']);
    this.settings = result.emailSettings || {
      emailTypes: ['newsletter'],
      summaryType: 'brief',
      whitelistSenders: [],
      keywords: [],
      domains: []
    };
  }

  init() {
    this.addSummarizeButtons();
    this.observeEmailChanges();
  }

  addSummarizeButtons() {
    const emailItems = document.querySelectorAll('[role="listitem"]');
    emailItems.forEach(item => {
      if (!item.querySelector('.ai-summarize-btn')) {
        const btn = document.createElement('button');
        btn.className = 'ai-summarize-btn';
        btn.textContent = '🤖 Summarize';
        btn.onclick = () => this.processEmail(item);
        item.appendChild(btn);
      }
    });
  }

  observeEmailChanges() {
    const observer = new MutationObserver(() => {
      this.addSummarizeButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  async processEmail(emailElement) {
    const emailData = this.extractEmailData(emailElement);
    if (!this.shouldProcess(emailData)) return;

    const summary = await this.generateSummary(emailData.content);
    const audioUrl = await this.generateAudio(summary);
    
    this.displaySummary(emailElement, summary, audioUrl);
  }

  extractEmailData(element) {
    const subjectEl = element.querySelector('[data-testid="message-subject"]') || 
                     element.querySelector('.ms-font-weight-semibold');
    const senderEl = element.querySelector('[title*="@"]') || 
                    element.querySelector('.ms-PersonaDetails-primaryText');
    const contentEl = element.querySelector('[data-testid="message-body"]') || 
                     element.querySelector('.ms-font-s');

    return {
      subject: subjectEl?.textContent || '',
      sender: senderEl?.textContent || '',
      content: contentEl?.textContent || ''
    };
  }

  shouldProcess(emailData) {
    const { whitelistSenders, keywords, domains } = this.settings;
    
    if (whitelistSenders.length && !whitelistSenders.some(s => 
      emailData.sender.toLowerCase().includes(s.toLowerCase()))) return false;
    
    if (keywords.length && !keywords.some(k => 
      emailData.subject.toLowerCase().includes(k.toLowerCase()))) return false;
    
    if (domains.length) {
      const emailDomain = emailData.sender.match(/@([^>]+)/)?.[1];
      if (!domains.some(d => emailDomain?.includes(d))) return false;
    }
    
    return true;
  }

  async generateSummary(content) {
    try {
      const response = await fetch('http://localhost:3000/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          type: this.settings.summaryType 
        })
      });
      const data = await response.json();
      return data.summary;
    } catch (error) {
      return 'Summary generation failed';
    }
  }

  async generateAudio(text) {
    try {
      const response = await fetch('http://localhost:3000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      return null;
    }
  }

  displaySummary(emailElement, summary, audioUrl) {
    let summaryDiv = emailElement.querySelector('.ai-summary');
    if (!summaryDiv) {
      summaryDiv = document.createElement('div');
      summaryDiv.className = 'ai-summary';
      emailElement.appendChild(summaryDiv);
    }

    summaryDiv.innerHTML = `
      <div class="summary-content">
        <h4>AI Summary</h4>
        <p>${summary}</p>
        ${audioUrl ? `<audio controls><source src="${audioUrl}" type="audio/mpeg"></audio>` : ''}
      </div>
    `;
  }
}

new OutlookEmailProcessor();