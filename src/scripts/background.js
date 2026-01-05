chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            document.addEventListener('fullscreenchange', (e) => {
                e.stopPropagation();
            }, true);

            document.addEventListener('webkitfullscreenchange', (e) => {
                e.stopPropagation();
            }, true);

            document.addEventListener('mozfullscreenchange', (e) => {
                e.stopPropagation();
            }, true);

            document.documentElement.requestFullscreen();
        }
    });

    await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["src/styles/style.css"]
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/scripts/helpers.js", "src/scripts/functions.js"]
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            prepareScreen();

            initFirstSlide(getText());

            document.addEventListener("keydown", monitorKeys);
        }
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/scripts/hide-cursor.js"]
    });
});