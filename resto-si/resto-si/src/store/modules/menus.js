import firebase from 'firebase'
import Vue from 'vue'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
    createMenu(context, {name, price, type}){
      const menuId = firebase.database().ref('menus').push().key
      const menu = {name, price, type}

      const updates = {}
      updates[`menus/${menuId}`] = menu
      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'menus', item: menu, id:menuId},{root: true})
        return Promise.resolve(context.state.items[menuId])
      })
    },
    updateMenu(context, {id, newName, newPrice, newType}){
      return new Promise((resolve) => {
        const menu = context.state.items[id]
        const updates = {}
        updates.name = newName
        updates.price = newPrice
        updates.type = newType

        firebase.database().ref('menus').child(id).update(updates)
        .then(() => {
          context.commit('setItem', {resource: 'menus', item: {...menu, name: newName, price: newPrice, type: newType}, id:id},{root: true})
          resolve()
        })
      })
    },
    deleteMenu(context, id){
      firebase.database().ref('menus').child(id).remove()
      .then(() => {
        context.commit('deleteMenu', {id})
      })
    },
    fetchAllMenus(context){
      return new Promise((resolve) => {
        Vue.delete(context.state.items)
        firebase.database().ref('menus').once('value', snapshot => {
          const menusObject = snapshot.val()
          if(menusObject){
            Object.keys(menusObject).forEach(menuId => {
              const menu = menusObject[menuId]
              context.commit('setItem', {resource: 'menus', id: menuId, item: menu}, {root: true})
            })
          }  
          resolve(Object.values(context.state.items))
        })
      })
    },
    fetchAllMenusModifiedByTransactionId(context, {id}){
      return new Promise((resolve) => {
        // context.dispatch('transactions/fetchTimedTransactions', {flag: flag}, {root: true})
        // .then(() => {
          const transactions = {...context.rootState.transactions.items}
          const transactionId = Object.keys(transactions).filter(item => item === id)
          const transactionMenus = transactions[transactionId].items

          Object.keys(transactionMenus).forEach(menuId => {
            const menu = transactionMenus[menuId]
            context.commit('setItem', {resource: 'menus', id: menuId, item: menu}, {root: true})
          })
          resolve(Object.values(context.state.items))
        })
      // })
    },
    setMenuQtyZero(context){
      return new Promise((resolve) => {
        const modifiedMenu = context.state.items
        Object.keys(modifiedMenu).forEach(menuId => {
          const menu = modifiedMenu[menuId]
          context.commit('setItem', {resource: 'menus', id: menuId, item: {...menu, qty: 0}}, {root: true})
        })
        
        resolve(Object.values(context.state.items))
      })
    }
  },
  mutations: {
    deleteMenu(state, {id}){
      Vue.delete(state.items, id)
    }
  }
}