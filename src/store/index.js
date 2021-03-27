import { createStore } from 'vuex';

import { Purchases } from '@/store/modules/Purchases';
import { Categories } from '@/store/modules/Categories';
import { User } from '@/store/modules/User';

export default createStore({
  state: {
    isNavOpen: false
  },
  mutations: {
    SET_IS_NAV_OPEN(state, content) {
      state.isNavOpen = content;
    }
  },
  actions: {
    SET_IS_NAV_OPEN({ commit }, isNavOpen) {
      commit('SET_IS_NAV_OPEN', isNavOpen);
    }
  },
  getters: {
    GET_IS_NAV_OPEN: (state) => state.isNavOpen
  },
  modules: { Purchases, Categories, User }
});
