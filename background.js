let doubleClickedTab = null;
let base64Favicon = null;

async function ConvertPngToBase64(imageURL) {
    fetch(imageURL)
    .then(response => response.blob())
    .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
            base64Favicon = reader.result;
        };
        reader.readAsDataURL(blob);
    })
    .catch(error => {
        console.error("error:", error);
        sendResponse({ base64: null });
    });

    return true;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Listening the double click notification from content.js
    if (message.action === 'tabDoubleClicked') {
        doubleClickedTab = message.tabInfo;

        // Convert PNG Favicon to Base64 format
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${doubleClickedTab.url}`;
        ConvertPngToBase64(faviconUrl);

        // Send Base64-Favicon to content.js
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "sendBase64Favicon",
            favicon: base64Favicon
        });

        return true;
    }

    // Listening the popup.html open notification from popup.js
    if (message.action === "getDoubleClickedTabInfo") {
        if (doubleClickedTab) {
            sendResponse({ title: doubleClickedTab.title, url: doubleClickedTab.url, favicon: base64Favicon });
        } else {
            sendResponse({ error: "No tab information available" });
        }

        return true;
    }
});