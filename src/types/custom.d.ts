export type FeedId = string;

export enum FeedStatus {
    UpToDate,
    Updating,
    UpdateFailed,
    Outdated,
}

export enum FeedType {
    RSS,
    Atom
}

export interface Feed {
    id: FeedId,
    url: string,
    title: string,
    lastUpdate: string,
    faviconUrl: string,
    status: FeedStatus,
    articles: Article[]
}

export type FolderId = string;

export interface Folder {
    id: FolderId;
    name: string;
    feeds: FeedId[];
}

export interface Comment {
    author: string,
    comment: string,
    date: string
}


// Sources:
// - https://validator.w3.org/feed/docs/atom.html#requiredEntryElements
// - https://www.rssboard.org/rss-specification#hrelementsOfLtitemgt
// TODO: voir comment gerer l'id puisque c'est un URL pour les feeds ATOM et un GUID pour les feeds RSS 2.0
// TODO: voir aussi pour le lien, puisque les feeds ATOM ont un id et un link
export type ArticleId = string;

export interface Article {
    id: ArticleId,
    title: string,
    link: string,
    description: string,
    author: string,
    category: string
    publicationDate: string,
    hasBeenRead: boolean
}

export type FilterId = string;

export enum FilterOn {
    Title,
    Description,
    Url,
    Date
}

export enum FilterCondition {
    Equals,
    Contains,
    StartsWith,
    EndsWith,
}

export enum FilterAction {
    Delete,
    Read,
}

export interface Filter {
    name: string,
    id: FilterId,
    applied_on: FilterOn,
    when: FilterCondition,
    when_data: string
    action: FilterAction
}
