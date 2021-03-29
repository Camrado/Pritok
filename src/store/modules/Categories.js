export const Categories = {
  namespaced: true,

  state: {
    url: 'https://pritok-back.herokuapp.com/category',
    pageSize: 10,
    skip: 0,
    pageNum: 1,
    content: [],
    contentForPurchaseModal: [],
    search: '',
    currentPage: 1
  },

  mutations: {
    PUSH_CONTENT(state, content) {
      state.content.push(content);
    },
    NULL_CONTENT(state) {
      state.content = [];
    },

    PUSH_CONTENT_FOR_PURCHASES(state, content) {
      state.contentForPurchaseModal.push(content);
    },
    NULL_CONTENT_FOR_PURCHASES(state) {
      state.contentForPurchaseModal = [];
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
    }
  },

  actions: {
    async SELECT_DATA({ commit, getters }) {
      commit('NULL_CONTENT'); // Clearing data before adding new one

      let url = `${getters.GET_URL}?limit=${getters.GET_PAGE_SIZE}&skip=${getters.GET_SKIP}&search=${getters.GET_SEARCH}`;

      const response = await fetch(url, {
        headers: {
          Authorization: localStorage.getItem('fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh')
        }
      });
      const categories = await response.json();

      for (let i = 0; i < categories.length; i++) {
        commit('PUSH_CONTENT', categories[i]);
      }

      let urlForPageNum = `${getters.GET_URL}/page-num?limit=${getters.GET_PAGE_SIZE}&search=${getters.GET_SEARCH}`;

      const pageNumResponse = await fetch(urlForPageNum, {
        headers: {
          Authorization: localStorage.getItem('fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh')
        }
      });
      const pageNum = await pageNumResponse.text();
      commit('SET_PAGE_NUM', +pageNum);
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

    async SET_CONTENT_FOR_PURCHASES({ commit, getters }) {
      commit('NULL_CONTENT_FOR_PURCHASES'); // Clearing data before adding new one

      const response = await fetch(getters.GET_URL, {
        headers: {
          Authorization: localStorage.getItem('fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh')
        }
      });
      const categories = await response.json();

      for (let i = 0; i < categories.length; i++) {
        commit('PUSH_CONTENT_FOR_PURCHASES', categories[i]);
      }
    }
  },

  getters: {
    GET_CONTENT: (state) => state.content,
    GET_CONTENT_FOR_PURCHASES: (state) => state.contentForPurchaseModal,
    GET_URL: (state) => state.url,
    GET_PAGE_SIZE: (state) => state.pageSize,
    GET_SKIP: (state) => state.skip,
    GET_PAGE_NUM: (state) => state.pageNum,
    GET_SEARCH: (state) => state.search,
    GET_CURRENT_PAGE: (state) => state.currentPage
  }
};
