<template>
  <div class="row pt-0">
    <div class="col-lg-4 col-md-4 col-sm-4 pt-2">     
      <b-card bg-variant="success" text-variant="white" header="Pendapatan"
        style="width: 100%"
        class="box-shadow"
        headerClass= 'pl-2 pt-2 pr-2 pb-1 border-bottom-0'
        bodyClass= 'p-3'
        footerClass= 'p-0 border-top-0'>
        <b-card-text>{{totalIncome}}</b-card-text>
      </b-card>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-4 pt-2">     
      <b-card bg-variant="primary" text-variant="white" header="Pengunjung"
        class="box-shadow"
        style="width: 100%"
        headerClass= 'pl-2 pt-2 pr-2 pb-1 border-bottom-0'
        bodyClass= 'p-3'
        footerClass= 'p-0 border-top-0'>
        <b-card-text>{{totalVisitor}}</b-card-text>
      </b-card>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-4 pt-2"> 
      <b-card bg-variant="primary" text-variant="white" header="Item Terjual"
        class="box-shadow"
        style="width: 100%"
        headerClass= 'pl-2 pt-2 pr-2 pb-1 border-bottom-0'
        bodyClass= 'p-3'
        footerClass= 'p-0 border-top-0'>
        <b-card-text>{{totalItem}}</b-card-text>
      </b-card>    
    </div>
  </div>
</template>

<script>
export default {
  name: 'InsightHeader',
  props: {
    totalIncome: {
      type: String,
      required: true
    },
    totalVisitor: {
      type: Number,
      required: true
    },
    totalItem: {
      type: Number,
      required: true
    }
  }
}
</script>

<style>

</style>