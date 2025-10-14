function prepareScreen() {
    hiddenOverflow();
}

function getText() {
    let paragraphs = extractText();
    return mergeDuplicatedParagraphs(paragraphs);
}

function initFirstSlide(lyrics) {
    window.l2s = window.l2s || {};

    window.l2s.index = 0;
    window.l2s.lyrics = lyrics;
    window.l2s.fontSizeLetter = 6;
    window.l2s.fontSizeIndex = 20;

    createOverlay();
    createContentDiv();
    createRepetitionsDiv();
    createIndexDiv();
    insertParagraphOnScreen();
}

function monitorKeys(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextSlide();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        previousSlide();
    } else if (event.key === "+") {
        increaseFontSize();
    } else if (event.key === "-") {
        decreaseFontSize();
    }
}