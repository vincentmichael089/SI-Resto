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
      bg-variant="white"
    >
      <b-list-group>
        <b-list-group-item 
          :to="{ name: 'Home' }"
          class="sidebar-item sidebar-route">
          <font-awesome-icon :icon="home" class="sidebar-icon"/>
          Beranda
        </b-list-group-item>
        <b-list-group-item 
          :to="{ name: 'CashierTransactionActive' }"
          class="sidebar-item sidebar-route">
          <font-awesome-icon :icon="cashier" class="sidebar-icon"/>
          Kasir
        </b-list-group-item>
        <b-list-group-item 
          :to="{ name: 'Recap' }"
          class="sidebar-item sidebar-route">
          <font-awesome-icon :icon="recap" class="sidebar-icon"/>
          Riwayat Transaksi
        </b-list-group-item>
        <b-list-group-item 
          :to="{ name: 'Menu' }"
          class="sidebar-item sidebar-route">
          <font-awesome-icon :icon="menu" class="sidebar-icon"/>
          Pengaturan Menu
        </b-list-group-item>
        <b-list-group-item style="color: maroon" :to="{ name: 'Logout' }"
          class="sidebar-item sidebar-route">
          <font-awesome-icon :icon="logout" class="sidebar-icon"/>
          Keluar
        </b-list-group-item>
      </b-list-group>
      <template v-slot:footer>
        <div class="d-flex bg-dark text-light px-3 py-2">
          <strong class="mr-auto"><small>github.com/vincentmichael089</small></strong>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import { faBars, faHome, faCashRegister, faChartLine, faDatabase, faWrench, faPowerOff } from '@fortawesome/free-solid-svg-icons'

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
    },
    home(){
      return faHome
    },
    insight(){
      return faChartLine
    },
    cashier(){
      return faCashRegister
    },
    recap(){
      return faDatabase
    },
    menu(){
      return faWrench
    },
    logout(){
      return faPowerOff
    }
  },
}
</script>

<style scoped>
  .sidebar-icon {
    display: inline-block;
    width: 20px;
    margin-right: 12px;
    margin-left: -5px;
    text-align: center;
    font-size: 16px;
    line-height: 1;
  }

  .sidebar-item:hover {
    background-color: #f0fbfc;
  }

  .sidebar-item {
    border-color: #ffffff;
  }

  .sidebar-item:active {
    font-weight: 300;
  }

  .active-menu {
    background-color: #f0fbfc;
    color: #05bbc9;
    font-family: Barlow-Medium;
    border-color: #f0fbfc03;
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

