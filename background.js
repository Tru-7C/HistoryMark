let doubleClickedTab = null;
let base64Favicon = null;

async function ConvertPngToBase64(imageURL) {
    try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'tabDoubleClicked') {
        doubleClickedTab = message.tabInfo;

        // Convert PNG Favicon to Base64 format
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${doubleClickedTab.url}`;
        base64Favicon = await ConvertPngToBase64(faviconUrl);

        // Send Base64-Favicon to content.js
        chrome.tabs.sendMessage(sender.tab.id, {
            action: "sendBase64Favicon",
            favicon: base64Favicon
        });

        sendResponse({ success: true });
        return true; // 非同期レスポンス
    }

    if (message.action === "getDoubleClickedTabInfo") {
        if (doubleClickedTab) {
            sendResponse({
                title: doubleClickedTab.title,
                url: doubleClickedTab.url,
                favicon: base64Favicon
            });
        } else {
            sendResponse({ error: "No tab information available" });
        }

        return true;
    }
});