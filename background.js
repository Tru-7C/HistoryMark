let doubleClickedTab = null;
let highlightedTabIndexes = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Listening the double click notification from content.js
    if (message.action === 'tabDoubleClicked') {
        doubleClickedTab = message.tabInfo;

        chrome.tabs.get(sender.tab.id, (tab) => {
            const tabIndex = tab.index;
    
            if (!highlightedTabIndexes.includes(tabIndex)) {
                highlightedTabIndexes.push(tabIndex);
            }

            chrome.tabs.highlight(
                { tabs: highlightedTabIndexes, windowId: tab.windowId },
                (window) => {console.log('Highlighted tabs');} 
            );
        });
        return true;
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