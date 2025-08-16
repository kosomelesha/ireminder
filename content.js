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
      animation: "fadeIn 0.5s ease-out",
    });

    // Add CSS animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);

    // Create header with pinkish theme
    const header = document.createElement("div");
    header.innerHTML = `
      <div style="
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        z-index: 1000;
      ">
      </div>
    `;

    // Create simple close button without styling
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.title = "Close reminder";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "20px",
      right: "20px",
      fontSize: "32px",
      color: "#fff",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      lineHeight: "1",
      transition: "opacity 0.3s ease",
      padding: "0",
      width: "auto",
      height: "auto",
    });

    closeBtn.addEventListener("mouseenter", () => {
      closeBtn.style.opacity = "0.7";
    });

    closeBtn.addEventListener("mouseleave", () => {
      closeBtn.style.opacity = "1";
    });

    closeBtn.addEventListener("click", () => {
      overlay.style.animation = "fadeIn 0.5s ease-out reverse";
      setTimeout(() => {
        overlay.style.display = "none";
        if (video) {
          video.pause();
        }
      }, 500);
    });

    // Create video container with pinkish glass effect (no breathing animation)
    const videoContainer = document.createElement("div");
    Object.assign(videoContainer.style, {
      position: "relative",
      maxWidth: "80vw",
      maxHeight: "70vh",
      borderRadius: "15px",
      background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      padding: "20px",
      boxShadow: "0 20px 40px rgba(255, 154, 158, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    });

    video = document.createElement("video");
    video.src = chrome.runtime.getURL("iron.mp4");
    video.controls = true;
    video.autoplay = true; 
    video.muted = true; 
    video.playsInline = true;
    Object.assign(video.style, {
      width: "100%",
      height: "100%",
      borderRadius: "10px",
      background: "#000",
      display: "block",
    });

    // Add footer with pinkish theme
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: white;
        font-family: 'Segoe UI', sans-serif;
        z-index: 1000;
      ">
        <p style="margin: 0; font-size: 14px; opacity: 0.8; color: #fecfef;">
          Click outside to unmute | Press ESC to close
        </p>
      </div>
    `;

    videoContainer.appendChild(video);
    overlay.appendChild(header);
    overlay.appendChild(videoContainer);
    overlay.appendChild(closeBtn);
    overlay.appendChild(footer);

    // Click outside to unmute
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        if (video) {
          video.muted = false;
          video.play().catch(() => {});
          
          // Add notification with pinkish theme
          const notification = document.createElement("div");
          notification.innerHTML = "Unmuted";
          notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-family: 'Segoe UI', sans-serif;
            font-weight: bold;
            animation: fadeIn 0.3s ease-out;
            z-index: 1001;
            box-shadow: 0 8px 20px rgba(255, 154, 158, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          `;
          overlay.appendChild(notification);
          
          setTimeout(() => {
            notification.remove();
          }, 2000);
        }
      }
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.style.display === "flex") {
        closeBtn.click();
      }
    });

    video.addEventListener("ended", () => {
      setTimeout(() => {
        overlay.style.animation = "fadeIn 0.5s ease-out reverse";
        setTimeout(() => {
          overlay.style.display = "none";
        }, 500);
      }, 3000);
    });

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

  // Show overlay with animation
  overlay.style.display = "flex";
  overlay.style.animation = "fadeIn 0.5s ease-out";
  
  if (video) {
    try {
      video.currentTime = 0;
      video.play().catch(() => {});
    } catch (_) {}
  }
})();
