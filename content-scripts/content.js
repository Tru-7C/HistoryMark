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

// Event Listener
document.addEventListener('dblclick', async () => {
    const response = await chrome.runtime.sendMessage({
        action: "tabDoubleClicked",
        tabInfo: { title: document.title, url: location.href }
    });
    
    var draw = SVG().size(100, 100);
    draw.image(response.favicon).size(100, 100);
    var nested = draw.nested();
    nested.svg(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">' +
        '<path fill="#ff0000" stroke="#ff0000" stroke-width="80" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>' +
        '</svg>'
    ).size(70, 70).move(30, -10);
    
    const markedFavicon = draw.svg();
    setFavicon(markedFavicon);
});