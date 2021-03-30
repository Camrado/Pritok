import { useToast } from 'vue-toastification';

export const User = {
  namespaced: true,

  state: {
    url: 'https://pritok-back.herokuapp.com/users',
    jwtInLStorage: 'fnw3m43mn2fu52n3nxi4mqp23z3ifn4z44gh', // If you change its value don't forget to change values in Purchases and Categories modules
    isSignedIn: undefined,
    isConfirmed: undefined,
    email: '',
    userName: ''
  },

  mutations: {
    SET_SIGNED_IN(state, content) {
      state.isSignedIn = content;
    },
    SET_CONFIRMED(state, content) {
      state.isConfirmed = content;
    },

    SET_EMAIL(state, content) {
      state.email = content;
    },
    SET_NAME(state, content) {
      state.userName = content;
    }
  },

  actions: {
    SET_SIGNED_IN({ commit }, isSignedIn) {
      commit('SET_SIGNED_IN', isSignedIn);
    },
    SET_CONFIRMED({ commit }, isConfirmed) {
      commit('SET_CONFIRMED', isConfirmed);
    },

    SET_EMAIL({ commit }, email) {
      commit('SET_EMAIL', email);
    },
    SET_NAME({ commit }, name) {
      commit('SET_NAME', name);
    },

    async SEND_EMAIL_CONFIRMATION({ getters }) {
      const toast = useToast();

      const response = await fetch(getters.GET_URL + '/me/send-verification-email', {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem(getters.GET_JWT)
        }
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      const data = await response.json();

      if (data.error) toast.error(data.error);
      else if (data.success) toast.success(data.success);
    },

    async LOG_OUT({ getters, commit }) {
      const toast = useToast();

      const response = await fetch(getters.GET_URL + '/logout', {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem(getters.GET_JWT)
        }
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      if (response.status === 200) {
        localStorage.removeItem(getters.GET_JWT);
        commit('SET_SIGNED_IN', false);
        commit('SET_CONFIRMED', false);
        toast.success("You've successfully signed out");
      }
    },

    async LOG_OUT_ALL({ getters, commit }) {
      const toast = useToast();

      const response = await fetch(getters.GET_URL + '/logout/all', {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem(getters.GET_JWT)
        }
      });
      if (response.status === 500) return toast.error('Sorry. We have got some server errors.');
      if (response.status === 200) {
        localStorage.removeItem(getters.GET_JWT);
        commit('SET_SIGNED_IN', false);
        commit('SET_CONFIRMED', false);
        toast.success("You've successfully signed out from all your devices");
      }
    }
  },

  getters: {
    GET_URL: (state) => state.url,
    GET_SIGNED_IN: (state) => state.isSignedIn,
    GET_CONFIRMED: (state) => state.isConfirmed,
    GET_JWT: (state) => state.jwtInLStorage,
    GET_EMAIL: (state) => state.email,
    GET_NAME: (state) => state.userName
  }
};
