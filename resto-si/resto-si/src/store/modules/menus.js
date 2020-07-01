import firebase from 'firebase'
// import Vue from 'vue'

export default{
  namespaced: true,
  state: {
    items: {}
  },
  actions: {
    createMenu(context, {name, price}){
      const menuId = firebase.database().ref('menus').push().key
      const menu = {name, price}

      const updates = {}
      updates[`menus/${menuId}`] = menu
      firebase.database().ref().update(updates)
      .then(() => {
        context.commit('setItem', {resource: 'menus', item: menu, id:menuId},{root: true})
        return Promise.resolve(context.state.items[menuId])
      })
    },
    // updateMenu(context, menu){

    // },
    fetchAllMenus(context){
      return new Promise((resolve) => {
        firebase.database().ref('menus').once('value', snapshot => {
          const menusObject = snapshot.val()
          Object.keys(menusObject).forEach(menuId => {
            const menu = menusObject[menuId]
            context.commit('setItem', {resource: 'menus', id: menuId, item: menu}, {root: true})
          })
          resolve(Object.values(context.state.items))
        })
      })
      
    }
  },
  mutations: {

  }
}