function hiddenOverflow() {
    document.body.style.overflow = "hidden";
}

function extractText() {
    const fullLyrics = document.querySelector(".lyric-original");
    const paragraphs = Array.from(fullLyrics.querySelectorAll("p"));

    let cleanedParagraphs = [];
    paragraphs.forEach(paragraph => {
        let verses = paragraph.innerHTML.split(/<br\s*\/?>/i);

        let cleanedVerses = verses.map(verse => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = verse;
            return tempDiv.textContent.trim().toUpperCase();
        })

        cleanedParagraphs.push({ verses: cleanedVerses, repetitions: 1 });
    });

    return cleanedParagraphs;
}

function isEqualParagraphs(paragraphA, paragraphB) {
    if (paragraphA?.length !== paragraphB?.length) return false;
    return paragraphA.every((val, i) => val === paragraphB[i]);
}

function mergeDuplicatedParagraphs(paragraphs) {
    const merged = [];

    for (let i = 0; i < paragraphs.length; i++) {
        const current = paragraphs[i];
        const next = paragraphs[i + 1];

        if (!next) {
            merged.push(current);
            break;
        }

        if (isEqualParagraphs(current.verses, next.verses)) {
            let repetitions = 1;
            while (isEqualParagraphs(paragraphs[i].verses, paragraphs[i + repetitions]?.verses)) {
                repetitions++;
            }

            merged.push({ ...current, repetitions });

            i += repetitions - 1;
        } else {
            merged.push({
                ...current,
                repetitions: 1
            });
        }
    }

    return merged;
}

function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = 'l2s-overlay';

    document.body.appendChild(overlay);
}

function createContentDiv() {
    const contentDiv = document.createElement("div");
    contentDiv.id = 'l2s-content-div';
    contentDiv.style.fontSize = window.l2s.fontSizeLetter + 'vh';

    document.getElementById('l2s-overlay').appendChild(contentDiv);
}

function createRepetitionsDiv() {
    const repetitionsDiv = document.createElement("div");
    repetitionsDiv.id = 'l2s-repetitions-div';
    repetitionsDiv.style.fontSize = window.l2s.fontSizeLetter + 'vh';

    document.getElementById('l2s-overlay').appendChild(repetitionsDiv);
}

function createIndexDiv() {
    const indexDiv = document.createElement("div");
    indexDiv.id = 'l2s-index-div';
    indexDiv.style.fontSize = window.l2s.fontSizeIndex + 'px';
    indexDiv.innerHTML = `${window.l2s.index + 1} / ${window.l2s.lyrics.length}`;

    document.getElementById('l2s-overlay').appendChild(indexDiv);
}

function insertParagraphOnScreen() {
    const contentDiv = document.getElementById('l2s-content-div');

    const paragraph = window.l2s.lyrics[window.l2s.index];
    const verses = paragraph.verses;
    const repetitions = paragraph.repetitions;

    let newContent = '';
    verses.forEach((verse, key) => {
        newContent += verse;

        if (key !== verses.length) {
            newContent += '<br>';
        }
    });

    contentDiv.innerHTML = newContent;

    const repetitionsDiv = document.getElementById('l2s-repetitions-div');
    if (repetitions === 1) {
        repetitionsDiv.style.display = 'none';
    } else {
        repetitionsDiv.style.display = 'block';
        repetitionsDiv.innerHTML = repetitions + 'x';
    }
}

function updateIndex() {
    const indexDiv = document.getElementById('l2s-index-div');
    indexDiv.innerHTML = `${window.l2s.index + 1} / ${window.l2s.lyrics.length}`;
}

function nextSlide() {
    if (window.l2s.index < window.l2s.lyrics.length - 1) {
        window.l2s.index++;
        updateIndex();
        insertParagraphOnScreen();
    }
}

function previousSlide() {
    if (window.l2s.index > 0) {
        window.l2s.index--;
        updateIndex();
        insertParagraphOnScreen();
    }
}

function updateFontSize() {
    document.getElementById('l2s-content-div').style.fontSize = window.l2s.fontSizeLetter + 'vh';
    document.getElementById('l2s-repetitions-div').style.fontSize = window.l2s.fontSizeLetter + 'vh';
    document.getElementById('l2s-index-div').style.fontSize = window.l2s.fontSizeIndex + 'px';
}

function increaseFontSize() {
    window.l2s.fontSizeLetter++;
    window.l2s.fontSizeIndex += 3;

    updateFontSize();
}

function decreaseFontSize() {
    window.l2s.fontSizeLetter--;
    window.l2s.fontSizeIndex -= 3;

    updateFontSize();
}