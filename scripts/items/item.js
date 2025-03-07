class Item {
    constructor() {
        if (new.target === Item) {
            throw new Error('Cannot instantiate abstract class Item directly.');
        }
    }

    hideTitle() {
        this.#setRenderedTitle('BLOCKED');
    }

    showTitle() {
        let title = this.getTitle();
        this.#setRenderedTitle(title);
    }

    hideThumbnail() {
        let thumbnailImg = this.getThumbnail();
        thumbnailImg.style.display = 'none';
    }

    showThumbnail() {
        let thumbnailImg = this.getThumbnail();
        thumbnailImg.style.removeProperty('display');
    }

    isHiddingTitle() {
        return !this.isShowingTitle();
    }

    isShowingTitle() {
        let title = this.getTitle().replace(/\s*/g, '');
        let displayedTitle = this.getTitleContainer().innerText.replace(/\s*/g, '');
        return title === displayedTitle;
    }

    isHiddingThumbnail() {
        return !this.isShowingThumbnail();
    }

    isShowingThumbnail() {
        let thumbnailImg = this.getThumbnail();
        return !thumbnailImg.getAttribute('style').includes('display');
    }

    #setRenderedTitle(string) {
        let titleContainer = this.getTitleContainer();
        titleContainer.innerHTML = string;
    }

    includesSomeKeywordsInTitle(keywords) {
        let title = this.getTitle();
        return this.#includesSome(keywords, title);
    }

    includesSomeKeywordsInChannelName(keywords) {
        let channelName = this.getChannelName();
        return this.#includesSome(keywords, channelName);
    }

    #includesSome(keywords, string) {
        return keywords.some((keyword) => string.includes(keyword));
    }

    static getHTMLTag() {
        throw new Error('Must implement "getHTMLTag" method.');
    }

    getTitle() {
        throw new Error('Must implement "getTitle" method.');
    }

    getTitleContainer() {
        throw new Error('Must implement "getTitleContainer" method.');
    }

    getChannelName() {
        throw new Error('Must implement "getChannelName" method.');
    }

    getThumbnail() {
        throw new Error('Must implement "getThumbnail" method.');
    }
}