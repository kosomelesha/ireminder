const ALARM_NAME = "videoReminder";
const PERIOD_MINUTES = 2; // in mins.

// Improved alarm management with error handling
async function ensureAlarm() {
  try {
    const alarm = await chrome.alarms.get(ALARM_NAME);
    if (!alarm) {
      await chrome.alarms.create(ALARM_NAME, { periodInMinutes: PERIOD_MINUTES });
      console.log('Video reminder alarm created successfully');
    }
  } catch (error) {
    console.error('Failed to create alarm:', error);
  }
}

// Initialize on install and startup
chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(ensureAlarm);

// Enhanced alarm listener with better error handling
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  try {
    // Get active tab with error handling
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs && tabs[0];
    
    if (!tab || !tab.id || !tab.url || !/^https?:/.test(tab.url)) {
      console.log('Skipping reminder - no valid active tab');
      return;
    }

    // Get allowed URLs with error handling
    const data = await chrome.storage.local.get({ allowedUrls: [] });
    const allowed = Array.isArray(data.allowedUrls) ? data.allowedUrls : [];
    
    if (allowed.length === 0) {
      console.log('No allowed URLs configured');
      return;
    }

    // Check if current URL matches any allowed URLs
    const matches = allowed.some(
      (u) => typeof u === "string" && u && tab.url.includes(u)
    );
    
    if (!matches) {
      console.log('Current site not in allowed list:', tab.url);
      return;
    }

    console.log('Injecting video reminder into:', tab.url);

    // Inject content script with error handling
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      console.log('Video reminder injected successfully');
    } catch (injectionError) {
      console.error('Failed to inject content script:', injectionError);
    }

  } catch (error) {
    console.error('Error in alarm handler:', error);
  }
});

// Add console messages for debugging
console.log('Video Reminder Extension loaded');
console.log('Reminders will fire every', PERIOD_MINUTES, 'minutes');
