const tabList = document.getElementById("Tab-list");
const refreshButton = document.getElementById("refresh-button");

loadTabs();

refreshButton.addEventListener("click", () => {
    loadTabs();
});

function loadTabs() {
    tabList.innerHTML = "";

    // Get all tabs in the current window
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const tabInfoList = tabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        url: tab.url
        }));

        // Create tab List
        tabInfoList.forEach(item => {
            const listItem = document.createElement("li");

            const faviconUrl = getFaviconURL(item.url);
            const title = item.title;

            listItem.classList.add('listItemStyle');
            listItem.innerHTML = `
                <img src="${faviconUrl}" alt="Favicon">
                <span class="listTextStyle">${title}</span>`;

            listItem.addEventListener("click", () => {
                chrome.tabs.update(item.id, { active: true });
            });

            tabList.appendChild(listItem);
        });
    });
}

// Get Favicon URL
function getFaviconURL(url) {
    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    faviconUrl.searchParams.set('pageUrl', url);
    faviconUrl.searchParams.set('size', '16');
    return faviconUrl.toString();
}