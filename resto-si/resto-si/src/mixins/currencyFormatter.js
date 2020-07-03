export default {  
  methods: {
    toCurrencyFormat(number){
      return new Intl.NumberFormat('ba-ID', { style: 'currency', currency: 'IDR' })
      .format(number)
      .replace("IDR", "Rp")
      .replace(",", "?").replace(".", ",").replace("?", ".")
    }
  }
}