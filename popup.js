const $ = (sel) => document.querySelector(sel);
const textarea = $("#urls");
const statusEl = $("#status");
const saveBtn = $("#save");

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get({ allowedUrls: [] }, (data) => {
    textarea.value = (data.allowedUrls || []).join("\n");
  });
});


saveBtn.addEventListener("click", () => {
  const list = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  chrome.storage.local.set({ allowedUrls: list }, () => {
    statusEl.textContent = "Saved!";
    setTimeout(() => (statusEl.textContent = ""), 1200);
  });
});
