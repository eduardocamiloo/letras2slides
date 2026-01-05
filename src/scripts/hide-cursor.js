const indexDiv = document.getElementById('l2s-index-div');

let timer = null;
const IDLE_TIME = 2000;

function hideElements() {
    document.body.classList.add("hide-cursor");
    indexDiv.style.opacity = 0;

}

function showElements() {
    document.body.classList.remove("hide-cursor");
    indexDiv.style.opacity = 1;
}

function resetTimer() {
    showElements();
    clearTimeout(timer);
    timer = setTimeout(hideElements, IDLE_TIME);
}

["mousemove", "mousedown", "wheel", "touchstart"].forEach(evt => {
    document.addEventListener(evt, resetTimer, { passive: true });
});

resetTimer();