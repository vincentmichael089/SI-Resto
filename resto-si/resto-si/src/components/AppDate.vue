<template>
  <div v-if="lastEditAt === null">
    {{humaneDate(date)}}
  </div>
  <div v-else-if="lastEditAt && (date === lastEditAt)">
    {{humaneDate(date)}}
  </div>
  <div v-else>
    {{humaneDate(date)}} <font-awesome-icon :icon="icoExcla" style="color: grey"  v-b-popover.hover.right="{ variant: 'dark', content: `diubah pada ${humaneDate(lastEditAt)}` }"/> 
  </div>
</template>

<script>
import moment from 'moment'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

export default {
  props: {
    date: {
      type: Number,
      required: true
    },
    lastEditAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    // icon loader
    icoExcla(){
      return faExclamationCircle
    }
  },
  methods: {
    humaneDate (timestamp) {
      return moment.unix(timestamp).format('H:m:s')
    },
  }
}
</script>

<style>

</style>