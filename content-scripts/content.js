CheckAndShowBookmark();

document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code === 'KeyB') {
        event.preventDefault();
        handleBookmarkToggle();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleBookmarkFromContextMenu') {
        handleBookmarkToggle();
    }
});

function handleBookmarkToggle() {
    const url = window.location.href;
    const title = document.title;
    
    chrome.storage.local.get(['markedPages'], async (result) => {
        const response = await chrome.runtime.sendMessage({
            action: "ctrlBKeyDown",
            tabInfo: { title: document.title, url: location.href }
        });
        var draw = SVG().size(100, 100);
        draw.image(response.favicon).size(100, 100);

        const pages = result.markedPages || [];
        const index = pages.findIndex(page => page.url === url);
    
        if (index >= 0) {
            // URL exists, remove it.
            pages.splice(index, 1);

            setFavicon(draw.svg());
        }
        else {
            // URL doesn't exist, add it.
            pages.push({ url, title });

            var nested = draw.nested();

            nested.svg(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">' +
                '<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->' +
                '<path fill="#63E6BE" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>' +
                '</svg>'
            ).size(70, 70).move(30, -10);
            setFavicon(draw.svg());
        }

        chrome.storage.local.set({ markedPages: pages }, () => { });
    });
}

function CheckAndShowBookmark() {
    const url = window.location.href;

    chrome.storage.local.get(['markedPages'], async (result) => {
        const pages = result.markedPages || [];
        const isBookmarked = pages.some(page => page.url === url);

        if (isBookmarked) {
            const response = await chrome.runtime.sendMessage({
                action: "ctrlBKeyDown",
                tabInfo: { title: document.title, url: location.href }
            });

            var draw = SVG().size(100, 100);
            draw.image(response.favicon).size(100, 100);

            var nested = draw.nested();
            nested.svg(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">' +
                '<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->' +
                '<path fill="#63E6BE" d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/>' +
                '</svg>'
            ).size(70, 70).move(30, -10);
            setFavicon(draw.svg());
        }
    });
}


// Set new Favicon to this document
function setFavicon(svgContent) {
    const base64Svg = btoa(decodeURIComponent(encodeURIComponent(svgContent)));

    const head = document.head;
    head.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

    const newFavicon = document.createElement('link');
    newFavicon.rel = `icon`;
    newFavicon.type = `image/svg+xml`;
    newFavicon.href = `data:image/svg+xml;base64,${base64Svg}`;

    head.appendChild(newFavicon);
}