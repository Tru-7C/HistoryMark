document.addEventListener('dblclick', (event) => {
    chrome.runtime.sendMessage({
        action: "tabDoubleClicked",
        tabInfo: { title: document.title, url: location.href }
    });

    var draw = SVG().addTo('body').size(300, 300).attr({ style: 'position: fixed; top: 100; left: 300;' });
    var rect = draw.rect(100, 100).attr({ fill: '#f06' });
});