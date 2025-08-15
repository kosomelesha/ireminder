(() => {
  const OVERLAY_ID = "video-reminder-overlay";

  let overlay = document.getElementById(OVERLAY_ID);
  let video;

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.85)",
      zIndex: "999999",
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "16px",
      right: "20px",
      fontSize: "28px",
      color: "#fff",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      lineHeight: "1",
    });
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
      if (video) {
        video.pause();
      }
    });

    video = document.createElement("video");
    video.src = chrome.runtime.getURL("iron.mp4");
    video.controls = true;
    video.autoplay = true; 
    video.muted = true; 
    video.playsInline = true;
    Object.assign(video.style, {
      maxWidth: "80vw",
      maxHeight: "80vh",
      borderRadius: "10px",
      background: "#000",
    });


    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        video.muted = false;
        video.play().catch(() => {});
      }
    });


    video.addEventListener("ended", () => {
      overlay.style.display = "none";
    });

    overlay.appendChild(video);
    overlay.appendChild(closeBtn);


    const attach = () => {
      const parent = document.body || document.documentElement;
      if (!parent) {
        requestAnimationFrame(attach);
        return;
      }
      parent.appendChild(overlay);
    };
    attach();
  } else {
    
    video = overlay.querySelector("video");
  }


  overlay.style.display = "flex";
  if (video) {
    try {
      video.currentTime = 0;
      video.play().catch(() => {});
    } catch (_) {}
  }
})();
