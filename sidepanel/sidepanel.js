const historyList = document.getElementById("history-list");

function getFaviconURL(url) {
    const faviconUrl = new URL(chrome.runtime.getURL('/_favicon/'));
    faviconUrl.searchParams.set('pageUrl', url);
    faviconUrl.searchParams.set('size', '16');
    return faviconUrl.toString();
  }

chrome.history.search({ text: '', maxResults: 50 }, (results) => {
    results.forEach(item => {
        const listItem = document.createElement("li");

        const faviconUrl = getFaviconURL(item.url);
        const urlTitle = item.title;

        listItem.classList.add('listItemStyle');
        listItem.innerHTML = `
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listTextStyle">${urlTitle}</span>`;
        listItem.addEventListener('click', () => {
            chrome.tabs.create({ url: item.url });
        });

        historyList.appendChild(listItem);
    });
});