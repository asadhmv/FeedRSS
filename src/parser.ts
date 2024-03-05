import type {Article} from "@/types/custom";
import {FeedType} from "@/types/custom.d";
import {sha256} from "@/util";

export class RssParser {
    content: Document;

    constructor(content: Document) {
        this.content = content;

        return this;
    }

    async getArticles(): Promise<Article[]> {
        let articles: Article[] = []


        let feedType = FeedType.RSS
        let items = this.content.getElementsByTagName('item');
        if (items.length === 0) {
            items = this.content.getElementsByTagName('entry');
            feedType = FeedType.Atom
        }

        console.log("items:", items)

        for (let item of items) {
            if (feedType === FeedType.RSS) {
                articles.push(await getArticleFromRSS(item))
            } else {
                articles.push(await getArticleFromAtom(item))
            }
        }

        return articles;
    }

    getSiteURL(): string {
        return this.content.getElementsByTagName('link')[0].textContent || '';
    }

    getTitle(): string {
        return this.content.getElementsByTagName('title')[0].textContent || '';
    }

}

function  __getTag(elem: Element, tag: string): string {
    let list = elem.getElementsByTagName(tag)
    if (list.length === 0) {
        return 'not found'
    }
    return elem.getElementsByTagName(tag)[0].textContent || "not found";
}

async function getArticleFromRSS(item: Element): Promise<Article> {
    console.log("rss item:", item)
    return {
        author: __getTag(item, 'author'),
        category: "",
        description: __getTag(item, 'description'),
        link: __getTag(item, 'link'),
        publicationDate: __getTag(item, 'pubDate'),
        title: __getTag(item, 'title'),
        id: await sha256(__getTag(item, 'link')),
        hasBeenRead: false
    }
}

async function getArticleFromAtom(item: Element): Promise<Article> {
    console.log("atom item:", item)

    let publication = __getTag(item, 'updated');
    if (publication === "not found")
        publication = __getTag(item, 'published')
    return {
        author: __getTag(item, 'name'),
        category: "",
        description: __getTag(item, 'content'),
        link: item.getElementsByTagName('link')[0].getAttribute('href') || 'not found',
        publicationDate: publication,
        title: __getTag(item, 'title'),
        id: await sha256(__getTag(item, 'id')),
        hasBeenRead: false
    }
}
