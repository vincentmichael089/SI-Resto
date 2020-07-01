<template>
  <div>
    <b-button v-b-toggle.sidebar-backdrop>Toggle Sidebar</b-button>
    <b-sidebar
      id="sidebar-backdrop"
      backdrop
      shadow
    >
      <b-list-group>
        <b-list-group-item 
          v-for="route in routes"
          @click.prevent="navigateAndDisable($event, route)"
          :key="route.slug" 
          :to="{ name: route.slug }"
          class="sidebar-item sidebar-route">{{route.name}}
          </b-list-group-item>
      </b-list-group>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: 'TheNav',
  data(){
    return {
      routes: [
        {
          name: 'Home',
          slug: 'Home'
        },
        {
          name: 'Cashier',
          slug: 'Cashier'
        },
        {
          name: 'Recap',
          slug: 'Recap'
        },
        {
          name: 'Insight',
          slug: 'Insight'
        },
        {
          name: 'Menu',
          slug: 'Menu'
        }
      ]
    }
  },
  methods: {
    navigateAndDisable(event){
      const sidebarRoute = document.getElementsByClassName("sidebar-route")
      for (let i = 0; i < sidebarRoute.length; i++) {
        sidebarRoute[i].className = sidebarRoute[i].className.replace("sidebar-route-act", ""); 
      }
      event.currentTarget.className += "active disabled sidebar-route-act";
    }
  }
}
</script>

<style scoped>
  .sidebar-item:hover {
    background-color: #08f26d17;
  }

  .sidebar-route-act {
    background-color: #08f26d3b;
  }
</style>>

