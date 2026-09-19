document.addEventListener("DOMContentLoaded", async () => {
  const portalEl = document.getElementById("portal-detected");
  const btnAnalyze = document.getElementById("btn-analyze");
  const btnDashboard = document.getElementById("btn-dashboard");

  let currentTabUrl = "";

  // Query active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      currentTabUrl = tab.url;
      const urlLower = tab.url.toLowerCase();

      let detected = "Generic Web Portal";
      if (urlLower.includes("linkedin.com")) detected = "LinkedIn (Session Active)";
      else if (urlLower.includes("naukri.com")) detected = "Naukri.com (Session Active)";
      else if (urlLower.includes("indeed.com")) detected = "Indeed (Session Active)";
      else if (urlLower.includes("hirist.tech")) detected = "Hirist.tech (Session Active)";
      else if (urlLower.includes("foundit.in")) detected = "Foundit (Session Active)";
      else if (urlLower.includes("shine.com")) detected = "Shine.com (Session Active)";
      else if (urlLower.includes("greenhouse.io")) detected = "Greenhouse ATS Form";
      else if (urlLower.includes("lever.co")) detected = "Lever ATS Form";
      else if (urlLower.includes("myworkdayjobs.com")) detected = "Workday Job Portal";

      portalEl.innerText = detected;

      // Notify dashboard bridge
      fetch("http://localhost:3000/api/extension/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeTabPortal: detected,
          currentJobUrl: tab.url,
          extensionInstalled: true
        })
      }).catch((e) => console.log("Dashboard ping:", e));
    }
  } catch (err) {
    portalEl.innerText = "Active Web Session";
  }

  btnDashboard.addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000" });
  });

  btnAnalyze.addEventListener("click", () => {
    if (currentTabUrl) {
      const applyUrl = `http://localhost:3000/apply?jobUrl=${encodeURIComponent(currentTabUrl)}`;
      chrome.tabs.create({ url: applyUrl });
    } else {
      chrome.tabs.create({ url: "http://localhost:3000/apply" });
    }
  });
});
