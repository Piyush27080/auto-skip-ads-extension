// Auto Skip Ads - content script (YouTube + YouTube Music)

const DEFAULTS = {
  enabled: true,
  muteAds: true,
  fastForward: true,
  adsSkipped: 0,
  secondsSaved: 0
};

let settings = { ...DEFAULTS };

const SKIP_SELECTORS = [
  ".ytp-skip-ad-button",
  ".ytp-ad-skip-button",
  ".ytp-ad-skip-button-modern",
  ".ytp-ad-skip-button-container button",
  "button[class*='skip-button']",
  "button[id^='skip-button']",
  ".ytp-ad-overlay-close-button"
];

// ---------- Settings ----------
function loadSettings() {
  try {
    chrome.storage.local.get(DEFAULTS, (data) => {
      settings = { ...DEFAULTS, ...data };
    });
  } catch (e) { /* extension was reloaded */ }
}

try {
  chrome.storage.onChanged.addListener((changes) => {
    for (const key in changes) settings[key] = changes[key].newValue;
  });
} catch (e) {}

function addStats(seconds) {
  try {
    chrome.storage.local.get(["adsSkipped", "secondsSaved"], (d) => {
      chrome.storage.local.set({
        adsSkipped: (d.adsSkipped || 0) + 1,
        secondsSaved: Math.round((d.secondsSaved || 0) + seconds)
      });
    });
  } catch (e) {}
}

// ---------- Helpers ----------
function isVisible(el) {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  return rect.width > 0 && rect.height > 0 &&
    style.display !== "none" && style.visibility !== "hidden";
}

function realClick(el) {
  ["mousedown", "mouseup"].forEach((type) =>
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))
  );
  el.click();
}

// ---------- Main logic ----------
let mutedByUs = false;
let spedUpByUs = false;
let inAd = false;
let adDuration = 0;

function restoreVideo(video) {
  if (mutedByUs) { video.muted = false; mutedByUs = false; }
  if (spedUpByUs) { video.playbackRate = 1; spedUpByUs = false; }
}

function tick() {
  const player = document.querySelector(".html5-video-player");
  const video = document.querySelector("video.html5-main-video") || document.querySelector("video");
  if (!player || !video) return;

  if (!settings.enabled) {
    restoreVideo(video);
    inAd = false;
    return;
  }

  const adShowing =
    player.classList.contains("ad-showing") ||
    player.classList.contains("ad-interrupting");

  if (adShowing) {
    if (!inAd) {
      inAd = true;
      adDuration = 0;
      console.log("[Auto Skip] Ad detected");
    }
    if (!adDuration && isFinite(video.duration) && video.duration > 0) {
      adDuration = video.duration;
    }

    // 1) Click the skip button if it is there
    let clicked = false;
    document.querySelectorAll(SKIP_SELECTORS.join(",")).forEach((btn) => {
      if (isVisible(btn)) {
        realClick(btn);
        clicked = true;
        console.log("[Auto Skip] Clicked:", btn.className);
      }
    });

    // 2) Mute while the ad plays
    if (settings.muteAds && !video.muted) {
      video.muted = true;
      mutedByUs = true;
    }

    // 3) Fast-forward ads that have no skip button
    if (settings.fastForward && !clicked && isFinite(video.duration) && video.duration > 0) {
      video.playbackRate = 16;
      spedUpByUs = true;
      video.currentTime = video.duration;
    }
  } else if (inAd) {
    inAd = false;
    restoreVideo(video);
    addStats(adDuration);
    console.log("[Auto Skip] Ad finished");
  }
}

function safeTick() {
  try { tick(); } catch (e) { /* ignore, e.g. extension reloaded */ }
}

loadSettings();
new MutationObserver(safeTick).observe(document.documentElement, { childList: true, subtree: true });
setInterval(safeTick, 300);
console.log("[Auto Skip] v2.0 running on", location.hostname);
