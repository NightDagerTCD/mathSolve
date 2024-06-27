document.getElementById('fetchQuestion').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // Inject the content script into the current tab
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['content.js']
        }, () => {
            // After injection, send the message to the content script
            chrome.tabs.sendMessage(tabs[0].id, {action: "fetchQuestionAndExpression"});
        });
    });
});
