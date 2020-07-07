import firebase from 'firebase'
import Vue from 'vue'
import moment from 'moment'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
    fetchTimedTransactions(context, {flag}){
      return new Promise((resolve) => {
       // const today = new Date()
        let startTime
        const endTime =  Number(moment().endOf('day').unix())
        switch(flag) {
          case 0: // today
            startTime = Number(moment().startOf('day').unix())
            break;
          case 1: // last 1 week 
            startTime = Number(moment().subtract(1, 'weeks').unix())
            break;
          case 2: // last 1 month
            startTime = Number(moment().subtract(1, 'months').unix())
            break;
          case 3: // last 3 month
            startTime = Number(moment().subtract(3, 'months').unix())
            break;
          case 4: // last 6 month
            startTime = Number(moment().subtract(6, 'months').unix())
            break;
          case 5: // last 1 year
            startTime = Number(moment().subtract(1, 'years').unix())
            break;
          default:
            // code block
        }

        context.state.items = {}

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
      const active = true
      const transaction = { cashier, tableNumber, items, timestamp, lastEditAt, active}

      const updates = {}
      updates[`transactions/${transactionId}`] = transaction
      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'transactions', item: transaction, id:transactionId},{root: true})
        return Promise.resolve(context.state.items[transactionId])
      })
    },
    updateTransaction(context, {id, newTableNumber, newItems}){
      return new Promise((resolve) => {
        const transaction = context.state.items[id]
        const lastEditAt = Math.floor(Date.now() / 1000)

        const updates = {}
        updates.tableNumber = newTableNumber
        updates.items = newItems
        updates.lastEditAt = lastEditAt

        firebase.database().ref('transactions').child(id).update(updates)
        .then(() => {
          context.commit('setItem', {resource: 'transactions', item: {...transaction, lastEditAt: lastEditAt, tableNumber: newTableNumber, items: newItems}, id:id},{root: true})
          resolve()
        })
      }) 
    },
    finishTransaction(context, {id}){
      return new Promise((resolve) => {
        const transaction = context.state.items[id]
        const updates = {}
        updates.active = false
        firebase.database().ref('transactions').child(id).update(updates)
        .then(() => {
          context.commit('setItem', {resource: 'transactions', item: {...transaction, active: false}, id:id},{root: true})
          resolve()
        })
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