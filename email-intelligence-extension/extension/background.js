chrome.runtime.onInstalled.addListener(() => {
  console.log('Email Intelligence extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('outlook')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processEmail') {
    // Forward to admin panel API
    fetch('http://localhost:3000/api/process-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.data)
    })
    .then(response => response.json())
    .then(data => sendResponse(data))
    .catch(error => sendResponse({ error: error.message }));
    
    return true; // Keep message channel open
  }
});