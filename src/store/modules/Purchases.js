import { useToast } from 'vue-toastification';

const toast = useToast();

export const Purchases = {
  namespaced: true,

  state: {
    url: 'https://pritok-back.herokuapp.com/purchase',
    fromDate: '',
    toDate: '',
    pageSize: 10,
    skip: 0,
    pageNum: 1,
    search: '',
    currentPage: 1,
    content: [],
    showContent: false
  },

  mutations: {
    PUSH_CONTENT(state, content) {
      state.content.push(content);
    },
    NULL_CONTENT(state) {
      state.content = [];
    },

    SET_DATE(state, { fromDate, toDate }) {
      state.fromDate = fromDate;
      state.toDate = toDate;
    },
    SET_PAGE_SIZE(state, content) {
      state.pageSize = content;
    },
    SET_SKIP(state, content) {
      state.skip = content;
    },
    SET_PAGE_NUM(state, content) {
      state.pageNum = content;
    },
    SET_SEARCH(state, content) {
      state.search = content;
    },

    SET_CURRENT_PAGE(state, content) {
      state.currentPage = content;
    },

    SET_SHOW_CONTENT(state, content) {
      state.showContent = content;
    }
  },

  actions: {
    async SELECT_DATA({ commit, getters }) {
      await commit('NULL_CONTENT'); // Clearing data before adding new one

      let url = `${getters.GET_URL}?fromDate=${getters.GET_FROM_DATE}&toDate=${getters.GET_TO_DATE}&limit=${getters.GET_PAGE_SIZE}&skip=${getters.GET_SKIP}&search=${getters.GET_SEARCH}`;

      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem('fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh')
        }
      });

      if (response.status !== 200) return toast.error('Something went wrong...');

      const purchases = await response.json();

      for (let i = 0; i < purchases.length; i++) {
        commit('PUSH_CONTENT', purchases[i]);
      }

      let urlForPageNum = `${getters.GET_URL}/page-num?fromDate=${getters.GET_FROM_DATE}&toDate=${getters.GET_TO_DATE}&limit=${getters.GET_PAGE_SIZE}&search=${getters.GET_SEARCH}`;

      const pageNumResponse = await fetch(urlForPageNum, {
        headers: {
          Authorization: localStorage.getItem('fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh')
        }
      });
      const pageNum = await pageNumResponse.text();
      commit('SET_PAGE_NUM', +pageNum);
    },

    SET_DATE({ commit }, fromAndToDate) {
      commit('SET_DATE', fromAndToDate);
    },
    SET_PAGE_SIZE({ commit }, pageSize) {
      commit('SET_PAGE_SIZE', pageSize);
    },
    SET_SKIP({ commit }, skip) {
      commit('SET_SKIP', skip);
    },
    SET_SEARCH({ commit }, search) {
      commit('SET_SEARCH', search);
    },

    SET_CURRENT_PAGE({ commit }, currentPage) {
      commit('SET_CURRENT_PAGE', currentPage);
    },

    SET_SHOW_CONTENT({ commit }, showContent) {
      commit('SET_SHOW_CONTENT', showContent);
    }
  },

  getters: {
    GET_CONTENT: (state) => state.content,
    GET_URL: (state) => state.url,
    GET_FROM_DATE: (state) => state.fromDate,
    GET_TO_DATE: (state) => state.toDate,
    GET_PAGE_SIZE: (state) => state.pageSize,
    GET_SKIP: (state) => state.skip,
    GET_PAGE_NUM: (state) => state.pageNum,
    GET_SEARCH: (state) => state.search,
    GET_CURRENT_PAGE: (state) => state.currentPage,
    GET_SHOW_CONTENT: (state) => state.showContent
  }
};
