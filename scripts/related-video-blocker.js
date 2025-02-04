// Keyword Loading Logic
let titleKeywords = [];

function loadKeywords() {
    chrome.storage.local
        .get(['titleKeywords'])
        .then((result) => {
            titleKeywords = result.titleKeywords;
        });
}

// Mutation Observer Logic
function createMutationObserverForRelatedVideoRenderer(callback) {
    let bodyTag = document.getElementsByTagName('body')[0];
    let config = { attributes: true, subtree: true };
    let waitForRelatedVideoRendererToLoad = (mutationList, auxiliaryObserver) => {
        let htmlCollection = document.getElementsByTagName('ytd-watch-next-secondary-results-renderer');
        if (htmlCollection.length > 0) {
            let relatedVideoRenderer = htmlCollection[0];
            let mainObserver = new MutationObserver(callback);
            mainObserver.observe(relatedVideoRenderer, config);
            auxiliaryObserver.disconnect();
        }
    };

    let auxiliaryObserver = new MutationObserver(waitForRelatedVideoRendererToLoad);
    auxiliaryObserver.observe(bodyTag, config);
}

// Video Renderer Logic
function manageVideoRenderers() {
    let videoRenderers = document.getElementsByTagName('ytd-compact-video-renderer');
    for (let videoRenderer of videoRenderers) {
        if (shouldBlockTitle(videoRenderer)) {
            let titleSpan = videoRenderer.querySelector('#video-title');
            titleSpan.innerHTML = 'BLOCKED';
        }

        if (shouldBlockThumbnail(videoRenderer)) {
            let thumbnailImg = videoRenderer.querySelector('.yt-core-image');
            if (thumbnailImg) {
                thumbnailImg.style.display = 'none';
            }
        }

        if (shouldResetRenderer(videoRenderer)) {
            let titleSpan = videoRenderer.querySelector('#video-title');
            let title = titleSpan.getAttribute('title');
            titleSpan.innerHTML = title;
        }
    }

    function shouldBlockTitle(videoRenderer) {
        let titleSpan = videoRenderer.querySelector('#video-title');
        if (titleSpan.innerHTML === 'BLOCKED') {
            return false;
        }

        let title = titleSpan.getAttribute('title');
        return titleKeywords.some((keyword) => title.includes(keyword));
    }

    function shouldBlockThumbnail(videoRenderer) {
        let thumbnailImg = videoRenderer.querySelector('.yt-core-image');
        if (thumbnailImg && thumbnailImg.style.display === 'none') {
            return false;
        }

        let titleSpan = videoRenderer.querySelector('#video-title');
        return titleSpan.innerHTML === 'BLOCKED';
    }

    function shouldResetRenderer(videoRenderer) {
        let titleSpan = videoRenderer.querySelector('#video-title');
        if (titleSpan.innerHTML !== 'BLOCKED') {
            return false;
        }

        let title = titleSpan.getAttribute('title');
        if (titleKeywords.some((keyword) => title.includes(keyword))) {
            return false;
        }

        return titleSpan.innerHTML !== title;
    }
}

// Main Logic
loadKeywords();
createMutationObserverForRelatedVideoRenderer(manageVideoRenderers);