// SafarSetu Core Client Controller
document.addEventListener("DOMContentLoaded", () => {
  // PWA Service Worker Registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => console.log("[SafarSetu PWA] Registered with scope:", reg.scope))
      .catch((err) => console.warn("[SafarSetu PWA] Registration failed:", err));
  }

  // Offline / Online Status Indicator
  const updateOnlineStatus = () => {
    const isOffline = !navigator.onLine;
    let offlineBanner = document.getElementById("offline-indicator-banner");
    if (isOffline) {
      if (!offlineBanner) {
        offlineBanner = document.createElement("div");
        offlineBanner.id = "offline-indicator-banner";
        offlineBanner.style.cssText = "position:sticky;top:56px;z-index:99;background:#DC2626;color:#FFF;padding:6px 12px;font-size:12px;font-weight:700;text-align:center;";
        offlineBanner.innerHTML = "⚠️ Offline Mode Active — Digital ID & Safety Radar Loaded from Local Cache";
        document.querySelector(".app-viewport")?.prepend(offlineBanner);
      }
    } else if (offlineBanner) {
      offlineBanner.remove();
    }
  };
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();

  // Drawer Sidebar Toggle
  const drawerTrigger = document.getElementById("btn-open-drawer");
  const drawerClose = document.getElementById("btn-close-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");

  if (drawerTrigger && drawerBackdrop) {
    drawerTrigger.addEventListener("click", () => drawerBackdrop.classList.add("active"));
  }
  if (drawerClose && drawerBackdrop) {
    drawerClose.addEventListener("click", () => drawerBackdrop.classList.remove("active"));
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", (e) => {
      if (e.target === drawerBackdrop) drawerBackdrop.classList.remove("active");
    });
  }

  // Language Modal Toggle
  const langTrigger = document.getElementById("btn-open-lang");
  const langModal = document.getElementById("lang-modal-backdrop");
  const langClose = document.getElementById("btn-close-lang");

  if (langTrigger && langModal) {
    langTrigger.addEventListener("click", () => langModal.classList.add("active"));
  }
  if (langClose && langModal) {
    langClose.addEventListener("click", () => langModal.classList.remove("active"));
  }

  // Audio Guide Simulation
  const audioPlayBtn = document.getElementById("btn-audio-play");
  if (audioPlayBtn) {
    let isPlaying = false;
    let utterance = null;
    audioPlayBtn.addEventListener("click", () => {
      if (!isPlaying) {
        const textToRead = document.getElementById("audio-guide-script")?.innerText ||
          "Welcome to this magnificent heritage monument in Rajasthan. Explore with caution and enjoy the royal history.";
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = "en-IN";
          utterance.onend = () => {
            isPlaying = false;
            audioPlayBtn.innerHTML = "▶";
          };
          window.speechSynthesis.speak(utterance);
        }
        isPlaying = true;
        audioPlayBtn.innerHTML = "⏸";
      } else {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        isPlaying = false;
        audioPlayBtn.innerHTML = "▶";
      }
    });
  }

  // Tabs Switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.style.display = "none");
      btn.classList.add("active");
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.style.display = "block";
    });
  });
});

// Toast notification helper
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'danger' ? '#DC2626' : '#071326'};
    color: #FFF;
    padding: 10px 18px;
    border-radius: 24px;
    font-size: 13px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: opacity 0.3s ease;
  `;
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
