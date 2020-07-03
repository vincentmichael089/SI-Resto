import firebase from 'firebase'
//import Vue from 'vue'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
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
      
    }
  }
}