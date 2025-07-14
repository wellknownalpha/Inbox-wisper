document.addEventListener('DOMContentLoaded', loadSettings);

async function loadSettings() {
  const result = await chrome.storage.sync.get(['emailSettings']);
  const settings = result.emailSettings || {};
  
  // Load email types
  const emailTypes = settings.emailTypes || [];
  document.querySelectorAll('#emailTypes input').forEach(cb => {
    cb.checked = emailTypes.includes(cb.value);
  });
  
  // Load other settings
  document.getElementById('summaryType').value = settings.summaryType || 'brief';
  document.getElementById('whitelistSenders').value = (settings.whitelistSenders || []).join('\n');
  document.getElementById('keywords').value = (settings.keywords || []).join(', ');
  document.getElementById('domains').value = (settings.domains || []).join(', ');
}

async function saveSettings() {
  const emailTypes = Array.from(document.querySelectorAll('#emailTypes input:checked')).map(cb => cb.value);
  const summaryType = document.getElementById('summaryType').value;
  const whitelistSenders = document.getElementById('whitelistSenders').value.split('\n').filter(s => s.trim());
  const keywords = document.getElementById('keywords').value.split(',').map(k => k.trim()).filter(k => k);
  const domains = document.getElementById('domains').value.split(',').map(d => d.trim()).filter(d => d);
  
  const settings = {
    emailTypes,
    summaryType,
    whitelistSenders,
    keywords,
    domains
  };
  
  await chrome.storage.sync.set({ emailSettings: settings });
  showStatus('Settings saved successfully!', 'success');
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
  setTimeout(() => statusDiv.innerHTML = '', 3000);
}

function openAdmin() {
  chrome.tabs.create({ url: 'http://localhost:3000/admin' });
}