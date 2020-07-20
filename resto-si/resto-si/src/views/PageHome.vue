<template>
  <div class="home">
    <div style="margin: 1rem;">
      <h4>Beranda</h4>
    </div>
  </div>
</template>

<script>
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'Home',
  components: {
  },
  computed: {
    home(){
      return faHome
    }
  }
}
</script>
