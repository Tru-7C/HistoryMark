function setFavicon(svgContent) {
    const base64Svg = btoa(unescape(encodeURIComponent(svgContent)));

    const head = document.head;
    head.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

    const newFavicon = document.createElement('link');
    newFavicon.rel = `icon`;
    newFavicon.type = `image/svg+xml`;
    newFavicon.href = `data:image/svg+xml;base64,${base64Svg}`;

    head.appendChild(newFavicon);
}

document.addEventListener('dblclick', (event) => {
    chrome.runtime.sendMessage({
        action: "tabDoubleClicked",
        tabInfo: { title: document.title, url: location.href }
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'sendBase64Favicon') {
        var draw = SVG().addTo('body').size(100, 100);
        draw.image(message.favicon).size(100, 100);
        draw.rect(50, 50).attr({ fill: '#f06' }).move(50, 0);
        
        const markedFavicon = draw.svg();
        setFavicon(markedFavicon);

        return true;
    }
});