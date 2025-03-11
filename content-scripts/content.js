document.addEventListener('dblclick', (event) => {    
    chrome.runtime.sendMessage({
        action: "tabDoubleClicked",
        tabInfo: { title: document.title, url: location.href }
    });

    console.log(document.title);
});