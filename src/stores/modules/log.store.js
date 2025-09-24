import { defineStore } from 'pinia';
import { getCurrentDateTime } from '@front/utils/timeline';

export const useLogStore = defineStore({
  id: 'db-log',
  state: ()=> ({
    list: [],
  }),
  getters: {
  },
  actions: {
    addLog(name, content) {
      this.list.push(
        {
          name: (name ? `[${name}]` : ''),
          content: (content || '--'),
          dateTime: getCurrentDateTime(),
        },
      );
    },
    cleanLog() {
      this.list.splice(0, this.list.length);
    },
  },
})
