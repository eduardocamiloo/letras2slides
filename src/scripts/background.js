chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["styles/style.css"]
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/helpers.js", "scripts/functions.js"]
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            prepareScreen();

            initFirstSlide(getText());

            document.addEventListener("keydown", monitorKeys);
        }
    });
});
