import { defineStore } from "pinia";
import type {ArticleId, Feed, FeedId} from "@/types/custom";
import { FeedStatus } from "@/types/custom.d";
import { FeedReader } from "@/feedReader";
import {useFiltersStore} from "@/stores/filters";
import {sha256} from "@/util";

interface State {
    feeds: Feed[]
}

export const useFeedsStore = defineStore('feeds', {
    state: (): State => {
        return {
            feeds: JSON.parse(localStorage.getItem('feeds') || "[]")
            /* feeds: [
                {id: btoa("https://test.com"), url: "https://test.com", lastUpdate: new Date().toString(), title: "Feed test"},
                {id: btoa("https://another.test.com"), url: "https://another.test.com", lastUpdate: new Date().toString(), title: "Autre feed"}
            ] */
        }
    },

    getters: {
        getFeeds: (state): Feed[] => state.feeds,

        getFeedById: (state: State): (feedId: FeedId) => Feed | null => {
            return (feedId: FeedId): Feed | null => state.feeds.filter(feed => feed.id === feedId)[0]
        }
    },

    actions: {
        async addFeed(newFeed: { url: string, title: string }): Promise<Feed> {
            let url = new URL(newFeed.url);
            let id = await sha256(url.toString())

            let feed = {
                url: url.toString(),
                title: newFeed.title,
                lastUpdate: new Date(0).toString(),
                id: id,

                // TODO: use a proxy like https://external-content.duckduckgo.com/ip3/<domain>.ico to protect the user ip?
                //faviconUrl: url.origin + "/favicon.ico",
                faviconUrl: "https://external-content.duckduckgo.com/ip3/" + url.host + ".ico",
                status: FeedStatus.Outdated,
                articles: []
            }

            this.feeds.push(feed);

            this.saveToLocalStorage();
            this.refreshFeed(id);

            return feed;
        },

        deleteFeed(id: FeedId) {
            this.feeds = this.feeds.filter(feed => feed.id != id)
            console.log(this.feeds);
            this.saveToLocalStorage()
        },

        changeTitleFeed(feedId: FeedId, newName: string) {
            const feed = this.getFeedById(feedId);
            if (feed) {
                feed.title = newName;
                console.log('changing name to ', newName);
            }
        },


        getIdByUrl(url: string): string | null {
            const feed = this.feeds.find((feed) => feed.url == url);
            if (feed)
                return feed.id;

            return null;
        },

        async refreshFeed(id: FeedId) {
            const feed = this.getFeedById(id);
            if (!feed)
                throw "Invalid FeedId";

            console.log("Start refreshing feed", id);

            try {
                feed.status = FeedStatus.Updating;

                const reader = await new FeedReader(feed.url).fetch();

                const filterStore = useFiltersStore();

                const articles = await reader.parser?.getArticles() || [];
                this.changeTitleFeed(id, reader.parser?.getTitle() || 'feed');
                console.log("Articles fetched:", articles)

                const lastRefresh = new Date(feed.lastUpdate);
                let newArticleCount = 0;
                articles.forEach(article => {

                    const articleDate = new Date(article.publicationDate);
                    const articleAlreadyPresent = feed.articles.filter(a => a.id === article.id).length > 0;
                    if (!articleAlreadyPresent && articleDate > lastRefresh) {
                        feed.articles.push(article)
                        newArticleCount++;
                    }

                    filterStore.applyFilters(article, id);
                });

                console.log("New article added:", newArticleCount)
                feed.lastUpdate = new Date().toString();
                feed.status = FeedStatus.UpToDate;
            } catch (e) {
                console.log("Error while refreshing the feed", id, ": ", e)
                feed.status = FeedStatus.UpdateFailed;
            }

            console.log("Feed", id, "refreshed!")
            this.saveToLocalStorage();
        },

        deleteArticleFromFeed(feedId: FeedId, articleId: ArticleId) {
            console.log("trigger delete")
            let feed = this.getFeedById(feedId);

            if (!feed)
                throw "Invalid FeedId";

            feed.articles = feed.articles.filter(article => article.id != articleId)
            this.saveToLocalStorage()
        },

        markArticleAsRead(feedId: FeedId,articleId: ArticleId) {
            let feed = this.getFeedById(feedId);

            if (!feed)
                throw "Invalid FeedId";

            let article = feed.articles.filter(article => article.id == articleId);
            article[0].hasBeenRead = true;

            feed.articles = feed.articles.filter(article => article.id != articleId)
            feed.articles.push(article[0])
        },

        async refreshFeeds() {
            console.log("Start refreshing feeds...")

            for (const feed of this.feeds) {
                await this.refreshFeed(feed.id);
            }

            console.log("Feeds refreshed!");
        },

        saveToLocalStorage() {
            localStorage.setItem('feeds', JSON.stringify(this.feeds))
        }
    }
})