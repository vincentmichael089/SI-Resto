<template>
  <div>
    <h1>Menu</h1>
    <h2>{{menus}}</h2>
    <input name="nama" id="" v-model="newMenu.name">
    <input name="harga" id="" v-model="newMenu.price">
    <button @click.prevent="createMenu"></button>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data(){
    return {
      newMenu: {
        name: null,
        price: null
      }
    }
  },
  computed: {
    menus(){
      return Object.values(this.$store.state.menus.items)
    }
  },
  methods: {
    createMenu(){
      const name = this.newMenu.name
      const price = this.newMenu.price
      this.newMenu.name = ''
      this.newMenu.price = ''
      return this.$store.dispatch('menus/createMenu', {name: name,price: price}) // return a promise (check store)
    }
  },
  beforeCreate(){
    this.$store.dispatch('menus/fetchAllMenus')
  }
}
</script>

<style>

</style>