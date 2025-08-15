# Oom ya maaras Reminder

A simple Chrome extension that shows a reminder video only on the active tab for saved links.

## How It Works
- You can **save links** in the popup (click the extension icon).
- When on a saved link, the reminder video will appear on the active tab after a set interval.
- Close it with the **X** button, and it will reappear after the interval passes again.

## How to Install on Chrome
1. **Clone this repository** or download it as a ZIP and extract it.
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the cloned/extracted folder.
5. Click the extension icon and **add your links** in the popup.

## How to Change the Time Interval
Open the `background.js` file in VS Code and edit:
```javascript
const PERIOD_MINUTES = 2; // in mins
