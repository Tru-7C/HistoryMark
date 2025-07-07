const historyContainer = document.getElementById("history-list");
const historyTab = document.getElementById("historyTab");
const historyContent = document.getElementById("historyContent");

const bookmarkContainer = document.getElementById("bookmark-list");
const bookmarkTab = document.getElementById("bookmarkTab");
const bookmarkContent = document.getElementById("bookmarkContent");

const checkboxContainer = document.getElementById("checkboxContainer");
const checkbox = document.querySelector("input[name=filter]");

let historyList = [];
let bookmarkedPages = [];
let previousListItem = null;
let threeMonthsAgo = new Date().getTime() - 90 * 24 * 60 * 60 * 1000;

/// When Load the Popup Page
document.addEventListener('DOMContentLoaded', () => {
    AddTabClickEvent();

    CreateBookmarkList();

    chrome.history.search({text: '', startTime: threeMonthsAgo, maxResults: 10000 }, (results) => {
        historyContainer.innerHTML = "";
        previousListItem = null;
        historyList = results;

        CreateHistoryList(false);
    });
});

/// When the filter checkbox is changed
checkbox.addEventListener('change', function() {
    historyContainer.innerHTML = "";
    previousListItem = null;

    if (this.checked) {
        CreateHistoryList(true);
    } else {
        CreateHistoryList(false);
    }
});

function AddTabClickEvent() {
    historyTab.onclick = () => {
      historyTab.classList.add("active");
      bookmarkTab.classList.remove("active");
      historyContent.classList.add("active");
      bookmarkContent.classList.remove("active");
      checkboxContainer.style.display = "block";
    };

    bookmarkTab.onclick = () => {
      bookmarkTab.classList.add("active");
      historyTab.classList.remove("active");
      bookmarkContent.classList.add("active");
      historyContent.classList.remove("active");
      checkboxContainer.style.display = "none";
    };
}

/// Create History List
function CreateHistoryList(showOnlyBookmarkedURL) {
    historyList.forEach(item => {
        const isBookmarked = IsBookmarked(item.url);

        if (showOnlyBookmarkedURL === true && isBookmarked === false) {
            return;
        }
    
        InsertDateLabel(item, previousListItem);
    
        const listItem = document.createElement("li");
        const bookmarkIcon = GetIcon(isBookmarked);
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
        const urlTitle = item.title;
        const visitTime = formatVisitTime(item.lastVisitTime);
    
        listItem.innerHTML = `
            <img src="${bookmarkIcon}" alt="BookMarkIcon">
            <img src="${faviconUrl}" alt="Favicon">
            <span class="listTitleStyle">${urlTitle}</span>
            <span class="listDateTimeStyle">${visitTime}</span>`;

        listItem.addEventListener('click', (e) => {
            chrome.tabs.create({ url: item.url });
        });
    
        historyContainer.appendChild(listItem);
    });
}

function IsBookmarked(url) {
    const index = bookmarkedPages.findLastIndex(page => page.url === url);

    if (index >= 0) {
        return true;
    }
    else {
        return false;
    }
}

function GetIcon(isBookmarked) {
    if (isBookmarked) {
        return '../icons/bookmarkIcon.svg';
    }
    else {
        return '../icons/bookmarkIconGrayout.svg';
    }
}

function formatVisitTime(lastVisitTime) {
    const date = new Date(lastVisitTime);
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleString('en-US', options);
}

function InsertDateLabel(currentItem, previousItem) {
    let dateLabelNeeded;

    if (previousItem == null) {
        dateLabelNeeded = true;
    }
    else {
        const currentDate = new Date(currentItem.lastVisitTime);
        const previousDate = new Date(previousItem.lastVisitTime);
    
        if (currentDate.getFullYear() === previousDate.getFullYear() &&
            currentDate.getMonth() === previousDate.getMonth() &&
            currentDate.getDate() === previousDate.getDate()) {
                dateLabelNeeded = false;
        }
        else {
            dateLabelNeeded = true;
        }
    }

    if (dateLabelNeeded) {
        const dateItem = document.createElement("li");
        dateItem.innerHTML = `<span><b>${(new Date(currentItem.lastVisitTime)).toDateString()}</b></span>`;
        historyContainer.appendChild(dateItem);
    }

    previousListItem = currentItem;
}

function CreateBookmarkList() {
    checkboxContainer.style.display = "none";
    
    chrome.storage.local.get(['markedPages'], (result) => {
        bookmarkedPages = result.markedPages || [];

        bookmarkedPages.forEach(item => {
            const bookmarkIcon = GetIcon(true);
            const listItem = document.createElement("li");
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${item.url}`;
            const urlTitle = item.title;
        
            listItem.innerHTML = `
                <img src="${bookmarkIcon}" alt="BookMarkIcon">
                <img src="${faviconUrl}" alt="Favicon">
                <span class="listTitleStyle">${urlTitle}</span>
                <button class="deleteButtonStyle" id="deleteButton">x</button>`;

            listItem.addEventListener('click', (e) => {
                if (e.target.id === "deleteButton") {
                    DeleteBookmark(item.url);
                    
                    const li = e.target.closest("li");
                    if (li) li.remove();
                }
                else {
                    chrome.tabs.create({ url: item.url });
                }
            });
        
            bookmarkContainer.appendChild(listItem);
        });
    });
}

function DeleteBookmark(url) {
    const index = bookmarkedPages.findIndex(page => page.url === url);
    
    if (index >= 0) {
        bookmarkedPages.splice(index, 1);
        chrome.storage.local.set({ markedPages: bookmarkedPages }, () => { });
    }
}