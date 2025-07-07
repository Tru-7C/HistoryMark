chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'toggleBookmark',
      title: 'Add/Remove Bookmark',
    });
  });

// Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ctrlBKeyDown') {
        var tabInfo = message.tabInfo;

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${tabInfo.url}`;
        ConvertPngToBase64(faviconUrl, sendResponse);
        return true;
    }
});

 // Convert Png image To Base64 format
 function ConvertPngToBase64(imageURL, sendResponse) {
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'toggleBookmark') {
        chrome.tabs.sendMessage(tab.id, {
            action: 'toggleBookmarkFromContextMenu'
        });
    }
});