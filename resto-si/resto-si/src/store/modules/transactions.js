import firebase from 'firebase'
import Vue from 'vue'
import moment from 'moment'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  getters: {
    transactionsIncomeTotal(state){
      let income = 0;
      [...Object.values(state.items)].filter(transaction => transaction.active === false).map(transaction => {
        if(transaction.items){
          const transactionItems = [...Object.values(transaction.items)]
          transactionItems.forEach(item => {
            income += item.qty * item.price
          });
        }
      })
      return income
    },
    transactionsTimed(state){
      return [...Object.values(state.items)].map(transaction => {
        let sum = 0;
        let foods = 0;
        let drinks = 0
        
        if(transaction.items){
          [...Object.values(transaction.items)].forEach(item => {
            sum += item.qty * item.price
            if(item.type === 'food'){
              foods += item.qty
            }else if(item.type === 'drink'){
              drinks += item.qty
            }
          });
        }
        
        return { 
          key: transaction['.key'],
          timestamp: transaction.timestamp,
          income: sum,
          countFoods: foods,
          countDrinks: drinks,
          date: transaction.date,
          items: transaction.items
        }
      })
    }
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
            startTime = 0
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
      const timestamp = moment().unix()
      const lastEditAt = moment().unix()

      let month
      const dumbMonth = Number(moment.unix(timestamp).format('MM'))
      switch(dumbMonth){
        case 0:
          month = '00'
          break;
        case 1:
          month = '01'
          break;
        case 2:
          month = '02'
          break;
        case 3:
          month = '03'
          break;      
        case 4:
          month = '04'
          break;
        case 5:
          month = '05'
          break;
        case 6:
          month = '06'
          break;
        case 7:
          month = '07'
          break;    
        case 8:
          month = '08'
          break;      
        case 9:
          month = '09'
          break;
        case 10:
          month = '10'
          break;    
        case 11:
          month = '11'
          break;      
        case 12:
          month = '12'
          break;       
      }
      const date = ''+moment.unix(timestamp).format('YYYY-')+month+moment.unix(timestamp).format('-DD')
      const active = true
      const transaction = { cashier, tableNumber, items, timestamp, lastEditAt, active, date}

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