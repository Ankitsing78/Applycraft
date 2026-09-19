// ApplyCraft AI - Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("ApplyCraft Companion Extension installed successfully.");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = tab.url.toLowerCase();
    const isPortal = [
      "linkedin.com",
      "naukri.com",
      "indeed.com",
      "hirist.tech",
      "foundit.in",
      "shine.com",
      "greenhouse.io",
      "lever.co",
      "myworkdayjobs.com"
    ].some((domain) => url.includes(domain));

    if (isPortal) {
      fetch("http://localhost:3000/api/extension/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeTabPortal: tab.title || url,
          currentJobUrl: tab.url,
          extensionInstalled: true
        })
      }).catch(() => {
        // Local dashboard not open or server offline
      });
    }
  }
});
