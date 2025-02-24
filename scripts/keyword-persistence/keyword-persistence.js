class KeywordPersistence {
    static save(titleKeywords, channelNameKeywords) {
        return chrome.storage.local
            .set(
                {
                    'titleKeywords': titleKeywords,
                    'channelNameKeywords': channelNameKeywords
                }
            );
    }

    static loadKeywords() {
        return chrome.storage.local
            .get(['titleKeywords', 'channelNameKeywords'])
            .then(this.#returnEmptyArraysOrKeywords);
    }

    static #returnEmptyArraysOrKeywords(keywords) {
        keywords.titleKeywords = keywords.titleKeywords || [];
        keywords.channelNameKeywords = keywords.channelNameKeywords || [];
        return keywords;
    }
}