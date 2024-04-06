document.getElementById('screenshot').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "takeScreenshot"}, function(response) {
        var img = document.getElementById('screenshotImage');
        img.src = response.screenshotUrl;
        img.style.display = 'block'; // Make the image visible
    });
});
