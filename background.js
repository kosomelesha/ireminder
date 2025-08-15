const ALARM_NAME = "videoReminder";
const PERIOD_MINUTES = 2; // in mins.

function ensureAlarm() {
  chrome.alarms.get(ALARM_NAME, (alarm) => {
    if (!alarm)
      chrome.alarms.create(ALARM_NAME, { periodInMinutes: PERIOD_MINUTES });
  });
}

chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(ensureAlarm);

// Fires and Injects only into the current active tab
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.id || !tab.url || !/^https?:/.test(tab.url)) return;

    chrome.storage.local.get({ allowedUrls: [] }, (data) => {
      const allowed = Array.isArray(data.allowedUrls) ? data.allowedUrls : [];
      if (allowed.length === 0) return; 

      const matches = allowed.some(
        (u) => typeof u === "string" && u && tab.url.includes(u)
      );
      if (!matches) return;

      // Inject only into this single active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
    });
  });
});
