import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

import menus from './modules/menus'
import transactions from './modules/transactions'
import auth from './modules/auth'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    setItem (state, {item, id, resource}) {
      item['.key'] = id
      Vue.set(state[resource].items, id, item) // now accessing state[resource].items (local state of each modules)
    }
  },
  actions: {
    fetchItem (context, {id, resource}) {
      return new Promise((resolve) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          context.commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
          resolve(context.state[resource].items[id])
        })
      })
    },
  
    fetchItems (context, {ids, resource}) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids)
      return Promise.all(ids.map(id => context.dispatch('fetchItem', {id, resource})))
    }
  },
  modules: {
    menus,
    transactions,
    auth,
    users
  }
})
