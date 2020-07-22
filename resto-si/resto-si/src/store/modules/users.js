import firebase from 'firebase'
import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    items: {}
  },
  getters: {},
  actions: {
    createUser (context, {id, email}) {
      return new Promise((resolve) => {
        const timestamp = Math.floor(Date.now() / 1000)
        email = email.toLowerCase()
        const user = {email, registeredAt: timestamp}

        firebase.database().ref('users').child(id).set(user)
        .then(() => {
          context.commit('setItem', {item: user, id: id, resource: 'users'}, {root: true})
          resolve(context.state.items[id])
        })
      })
    },

    fetchUser (context, {id}) {
      return context.dispatch('fetchItem', {resource: 'users', id}, {root: true})
    },
  },
  mutations: {
    setUser (state, {userId, userData}) {
      Vue.set(state.items, userId, userData)
    }
  }
}
