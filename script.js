let tabCounter = 0;
let activeTabId = null;

const tabsBar = document.getElementById("tabsBar");
const tabContentContainer = document.getElementById("tabContentContainer");
const addTabBtn = document.getElementById("addTabBtn");

addTabBtn.addEventListener("click", createNewTab);

function createNewTab() {
    tabCounter++;
    const tabId = "tab-" + tabCounter;

    // Create tab button
    const tab = document.createElement("div");
    tab.classList.add("tab");
    tab.textContent = "Tab " + tabCounter;
    tab.dataset.id = tabId;

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent = "×";
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeTab(tabId);
    };

    tab.appendChild(closeBtn);
    tab.onclick = () => switchTab(tabId);
    tabsBar.appendChild(tab);

    // Create tab content
    const content = document.createElement("div");
    content.classList.add("tab-content");
    content.id = tabId;

    content.innerHTML = `
        <div class="input-section">
            <input type="text" placeholder="Paste YouTube link here..." />
            <button>Play</button>
        </div>
        <iframe class="video-frame"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="autoplay; encrypted-media"
            allowfullscreen>
        </iframe>
    `;

    const input = content.querySelector("input");
    const playBtn = content.querySelector("button");
    const iframe = content.querySelector("iframe");

    playBtn.addEventListener("click", () => {
        const videoId = extractYouTubeId(input.value);
        if (videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
        } else {
            alert("Invalid YouTube URL");
        }
    });

    tabContentContainer.appendChild(content);
    switchTab(tabId);
}

function switchTab(tabId) {
    activeTabId = tabId;

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.id === tabId);
    });

    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.toggle("active", content.id === tabId);
    });
}

function closeTab(tabId) {
    document.querySelector(`[data-id="${tabId}"]`).remove();
    document.getElementById(tabId).remove();

    const firstTab = document.querySelector(".tab");
    if (firstTab) {
        switchTab(firstTab.dataset.id);
    }
}

function extractYouTubeId(url) {
    const regex = /(?:youtube\.com.*(?:\\?|&)v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Initialize first tab
createNewTab();
