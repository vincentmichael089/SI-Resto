import firebase from 'firebase'
import Vue from 'vue'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
    fetchTodayTransactions(context){
      return new Promise((resolve) => {
        const today = new Date()
        const startTime = Number(Math.floor(today.setHours(0,0,0,0)/1000))
        const endTime = Number(Math.floor(today.setHours(24,0,0,0)/1000))

        firebase.database().ref('transactions').orderByChild("timestamp").startAt(startTime).endAt(endTime)
        .once('value', snapshot => {
          const transactionsObject = snapshot.val()
          if(transactionsObject){
            Object.keys(transactionsObject).forEach(transactionId => {
              const transaction = transactionsObject[transactionId]
              context.commit('setItem', { resource: 'transactions', id: transactionId, item: transaction}, {root: true})
            })
          }
          resolve(Object.values(context.state.items))
        })
      })
    },
    fetchAllTransactions(context){
      return new Promise((resolve) => {
        firebase.database().ref('transactions').once('value', snapshot => {
          const transactionsObject = snapshot.val()
          if(transactionsObject){
            Object.keys(transactionsObject).forEach(transactionId => {
              const transaction = transactionsObject[transactionId]
              context.commit('setItem', { resource: 'transactions', id: transactionId, item: transaction}, {root: true})
            })
          }
          resolve(Object.values(context.state.items))
        })
      })
    },
    createTransaction(context, {cashier, tableNumber, items}){
      const transactionId = firebase.database().ref('transactions').push().key
      const timestamp = Math.floor(Date.now() / 1000)
      const lastEditAt = Math.floor(Date.now() / 1000)
      const transaction = { cashier, tableNumber, items, timestamp, lastEditAt}

      const updates = {}
      updates[`transactions/${transactionId}`] = transaction
      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'transactions', item: transaction, id:transactionId},{root: true})
        return Promise.resolve(context.state.items[transactionId])
      })
    },
    deleteTransaction(context, id){
      firebase.database().ref('transactions').child(id).remove()
      .then(() => {
        context.commit('deleteTransaction', {id})
      }) 
    }
  },
  mutations: {
    deleteTransaction(state, {id}){
      Vue.delete(state.items, id)
    }
  }
}