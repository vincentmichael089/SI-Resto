<template>
  <div class="row pt-0">
    <div class="col-lg-4 col-lg-4 pt-2">     
      <div style="height: 100px; width: 100%; background-color: white" class="box-shadow card-insight card-1">
        <div class="pt-2 pl-3 pb-1 f-semibold">Pendapatan</div>
        <div class="text-center card-bod f-semibold">{{totalIncome}}</div>
      </div>
    </div>
    <div class="col-lg-4 col-lg-4 pt-2">     
      <div style="height: 100px; width: 100%; background-color: white" class="box-shadow card-insight card-2">
        <div class="pt-2 pl-3 pb-1 f-semibold">Pengunjung</div>
        <div class="text-center card-bod f-semibold">{{totalVisitor}}</div>
      </div>
    </div>
    <div class="col-lg-4 col-lg-4 pt-2">     
      <div style="height: 100px; width: 100%; background-color: white" class="box-shadow card-insight card-3">
        <div class="pt-2 pl-3 pb-1 f-semibold">Menu Terjual</div>
        <div class="text-center card-bod f-semibold">{{totalItem}}</div>
      </div>
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
.card-1{
  background-image: linear-gradient(315deg, #84fb95 0%, #0fd64f 74%);
  background-color: #84fb95;
  color: #ffffff;
}

.card-2{
  background-color: #045de9;
  background-image: linear-gradient(315deg, #045de9 0%, #09c6f9 74%);
  color: #ffffff;
}

.card-3{
  background-color: #ff4e00;
  background-image: linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%);
  color: #ffffff;
}

.card-bod{
  font-size: 30px;
}

.card-insight{
  border-radius: 8px;
}
</style>