import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
    state: () => ({
        sortDate: null,
        category: null,
        item_condition: null,
        item_for_type: null,
        distance: null,
    }),

    actions: {
        setFilter(filterData) {
            // Update the filter state with the provided filter data
            this.sortDate = filterData.sortDate;
            this.category = filterData.category;
            this.item_condition = filterData.item_condition;
            this.item_for_type = filterData.item_for_type;
            this.distance = filterData.distance;
          },
    },
});