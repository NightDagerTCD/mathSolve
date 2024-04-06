chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "takeScreenshot") {
    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
      // Option 1: Log the data URL
      console.log(dataUrl);
      
      // Option 2: Download the screenshot
      downloadScreenshot(dataUrl);

      // Send the data URL back to the popup, if needed
      sendResponse({screenshotUrl: dataUrl});
    });
  }
  return true; // Keep the messaging channel open for sendResponse
});

function downloadScreenshot(dataUrl) {
    fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            chrome.downloads.download({
                url: url,
                filename: 'screenshot.png'
            }, () => {
                window.URL.revokeObjectURL(url);
            });
        });
}
