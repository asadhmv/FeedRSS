import {defineStore} from "pinia";
import type {Article, FeedId, Filter, FilterId} from "@/types/custom";
import {FilterAction, FilterCondition, FilterOn} from "@/types/custom.d";
import {useFeedsStore} from "@/stores/feeds";
import {sha256} from "@/util";

interface State {
    filters: Filter[]
}

export const useFiltersStore = defineStore('filters', {
    state: (): State => {
        return {
            filters: JSON.parse(localStorage.getItem('filters') || "[]")
        }
    },

    getters: {
        getFilters: (state): Filter[] => state.filters,

        getFilterById: (state: State): (filterId: FilterId) => Filter | null => {
            return (filterId: FilterId): Filter | null => state.filters.filter(filter => filter.id === filterId)[0]
        }

    },

    actions: {
        async addFilter(newFilter: {name: string, applied_on: FilterOn, when: FilterCondition, when_data: string, action: FilterAction}) : Promise<Filter>  {
            let id = await sha256(newFilter.name);

            let filter = {
                id: id,
                name: newFilter.name,
                applied_on: newFilter.applied_on,
                when: newFilter.when,
                when_data: newFilter.when_data,
                action: newFilter.action,
            }

            this.filters.push(filter);

            this.saveToLocalStorage();

            return filter

        },

        deleteFilter(id: FilterId) {
            this.filters = this.filters.filter(filter => filter.id != id)
            this.saveToLocalStorage()
        },

        applyFilters(article: Article, feedId: FeedId) {
            const feedStore = useFeedsStore()
            let filters = this.$state.filters;
            filters.forEach(filter => {

                let fields: string = "";
                switch (filter.applied_on) {
                    case FilterOn.Date:
                        fields = article.publicationDate;
                        break;
                    case FilterOn.Title:
                        fields = article.title;
                        break;
                    case FilterOn.Description:
                        fields = article.description
                        break;
                    case FilterOn.Url:
                        fields = article.link

                }

                let action;
                switch (filter.action) {
                    case FilterAction.Delete:
                        action = feedStore.deleteArticleFromFeed
                        break;
                    case FilterAction.Read:
                        action = feedStore.markArticleAsRead
                }

                switch (filter.when) {
                    case FilterCondition.Equals:
                        if (fields === filter.when_data) {
                            action(feedId, article.id)
                        }
                        break;
                    case FilterCondition.Contains:
                        if (fields.includes(filter.when_data)) {
                            action(feedId, article.id)
                        }
                        break;
                    case FilterCondition.EndsWith:
                        if (fields.endsWith(filter.when_data)) {
                            action(feedId, article.id)
                        }
                        break;
                    case FilterCondition.StartsWith:
                        if (fields.startsWith(filter.when_data)) {
                            action(feedId, article.id)
                        }
                        break;
                }

            })

        },

        saveToLocalStorage() {
            localStorage.setItem('filters', JSON.stringify(this.filters))
        }
    }
})