let doubleClickedTab = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Listening the double click notification from content.js
    if (message.action === 'tabDoubleClicked') {
        doubleClickedTab = message.tabInfo;
    }

    // Listening the popup.html open notification from popup.js
    if (message.action === "getDoubleClickedTabInfo") {
        if (doubleClickedTab) {
            sendResponse({ title: doubleClickedTab.title, url: doubleClickedTab.url });
        } else {
            sendResponse({ error: "No tab information available" });
        }
        return true;
    }
});