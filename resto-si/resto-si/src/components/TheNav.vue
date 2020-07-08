<template>
  <div class="sticky">
    <button v-b-toggle.sidebar-backdrop class="burgerbar">
      <font-awesome-icon :icon="bars"/> SIRESTO
    </button>
    <hr>
    <b-sidebar
      id="sidebar-backdrop"
      backdrop
      shadow
    >
      <b-list-group>
        <b-list-group-item 
          v-for="route in routes"
          :key="route.slug" 
          :to="{ name: route.slug }"
          class="sidebar-item sidebar-route">
          
          {{route.name}}
          </b-list-group-item>
      </b-list-group>
    </b-sidebar>
  </div>
</template>

<script>
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'TheNav',
  data(){
    return {
      routes: [
        {
          name: 'Beranda',
          slug: 'Home'
        },
        {
          name: 'Kasir',
          slug: 'CashierTransactionActive'
        },
        {
          name: 'Riwayat Transaksi',
          slug: 'Recap'
        },
        {
          name: 'Insight',
          slug: 'Insight'
        },
        {
          name: 'Pengaturan Menu',
          slug: 'Menu'
        }
      ],
      appname: process.env.FIREBASE_PROJECT_ID
    }
  },
  methods: {},
  computed: {
    bars(){
      return faBars
    }
  },
}
</script>

<style scoped>
  .sidebar-item:hover {
    background-color: #08f26d17;
  }

  .active-menu {
    background-color: #08f26d3b;
    color: black;
    border-color: #08f26d00;
  }

  .burgerbar {
    padding: 0.8em;
    height: 20px;
    background-color: white;
    border: none;
    outline:none;
  }

  div.sticky {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0;
    z-index: 3;
    background: white;
  }
</style>>

