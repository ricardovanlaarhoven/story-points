import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    sessions: []
  },
  mutations: {
    setParticipantId(state, {participantId, sessionId}) {
      console.log(state, participantId, sessionId);
      state.sessions.push({
        id: sessionId,
        participantId
      })
    }
  },
  getters: {
    getParticipantId: (state) => (sessionId: string) => {
      const session = state.sessions.find((session) => session.id === sessionId);
      if (session && session.participantId) {
        return session.participantId
      }
    }
  }
})
