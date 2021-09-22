import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    userId: ''
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
})
