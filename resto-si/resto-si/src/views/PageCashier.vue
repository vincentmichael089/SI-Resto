<template>
  <div>
    <div style="margin: 1rem;">
      <h4>Kasir</h4>
    </div>
    
    <div>
      <b-card title="Card Title" no-body class="border-0">
        <b-card-header header-tag="nav">
          <b-nav card-header tabs>
            <b-nav-item :to="{name: 'CashierTransactionActive'}">Transaksi Aktif</b-nav-item>
            <b-nav-item :to="{name: 'CashierTransactionHistory'}">Riwayat Transaksi</b-nav-item>
          </b-nav>
        </b-card-header>
        <b-card-body class="p-0 m-0" style="height: calc(80vh - 100px)">
          <router-view v-bind:key="$route.path"/>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cashier',
}
</script>

<style>

</style>