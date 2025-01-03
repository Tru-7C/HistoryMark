async function ConvertPngToBase64(imageURL, sendResponse) {
    try {
        fetch(imageURL)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {sendResponse({ favicon: reader.result });};
            reader.onerror = () => {sendResponse({ favicon: null });};
            reader.readAsDataURL(blob);
        })
        .catch(error => {sendResponse({ favicon: null });});
    } catch (error) {
        sendResponse({favicon: null});
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'tabDoubleClicked') {
        var doubleClickedTab = message.tabInfo;

        // Convert PNG Favicon to Base64 format
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${doubleClickedTab.url}`;
        ConvertPngToBase64(faviconUrl, sendResponse);
        return true;
    }
});
