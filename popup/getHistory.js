function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u); // this encodes the URL as well
    url.searchParams.set('size', '16');
    return url.toString();
  }

const historyList = document.getElementById("history-list");

chrome.history.search({ text: '', maxResults: 50 }, (results) => {
    results.forEach(item => {
        const listItem = document.createElement("li");

        const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
        const urlTitle = item.title;

        listItem.innerHTML = `
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listText-style">${urlTitle}</span>`;

        historyList.appendChild(listItem);
    });
});