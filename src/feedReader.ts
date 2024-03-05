import {RssParser} from "@/parser";



export class FeedReader {
    url: string;
    parser: RssParser | null;

    constructor(url: string) {
        this.url = url;
        this.parser = null;
    }

    async fetch()  {
        const res = await fetch("http://localhost:3000/*/" + this.url);
        const content = await res.text()

        let dom = new DOMParser().parseFromString(content, 'text/xml')

        let errorCount = dom.getElementsByTagName('parsererror').length;
        if (errorCount > 0) {
            throw "Failed to parse document"
        }

        this.parser = new RssParser(dom);

        return this;
    }
}

