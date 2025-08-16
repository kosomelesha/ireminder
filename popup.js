const $ = (sel) => document.querySelector(sel);
const textarea = $("#urls");
const timerInput = $("#timer");
const statusEl = $("#status");
const saveBtn = $("#save");

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ allowedUrls: [], timerMinutes: 2 }, (data) => {
    textarea.value = (data.allowedUrls || []).join("\n");
    timerInput.value = data.timerMinutes || 2;
  });
});


saveBtn.addEventListener("click", () => {
  const list = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const timerMinutes = parseInt(timerInput.value) || 2;

  chrome.storage.local.set({ allowedUrls: list, timerMinutes: timerMinutes }, () => {
    chrome.runtime.sendMessage({ action: "updateTimer", timerMinutes: timerMinutes });

    statusEl.textContent = "Saved!";
    setTimeout(() => (statusEl.textContent = ""), 1200);
  });
});
