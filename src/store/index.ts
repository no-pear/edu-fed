import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('vuex') || 'null')
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
})
