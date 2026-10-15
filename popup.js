const DEFAULTS = {
  enabled: true,
  muteAds: true,
  fastForward: true,
  adsSkipped: 0,
  secondsSaved: 0
};

const $ = (id) => document.getElementById(id);

function formatTime(sec) {
  if (sec < 60) return sec + "s";
  const m = Math.floor(sec / 60);
  if (m < 60) return m + "m " + (sec % 60) + "s";
  return Math.floor(m / 60) + "h " + (m % 60) + "m";
}

function render(data) {
  $("enabled").checked = data.enabled;
  $("muteAds").checked = data.muteAds;
  $("fastForward").checked = data.fastForward;
  $("count").textContent = data.adsSkipped;
  $("time").textContent = formatTime(data.secondsSaved);
  $("status").textContent = data.enabled ? "Active" : "Paused";
  $("status").classList.toggle("off", !data.enabled);
}

chrome.storage.local.get(DEFAULTS, render);

["enabled", "muteAds", "fastForward"].forEach((key) => {
  $(key).addEventListener("change", (e) => {
    chrome.storage.local.set({ [key]: e.target.checked });
  });
});

$("reset").addEventListener("click", () => {
  chrome.storage.local.set({ adsSkipped: 0, secondsSaved: 0 });
});

// Live update while the popup is open
chrome.storage.onChanged.addListener(() => chrome.storage.local.get(DEFAULTS, render));
