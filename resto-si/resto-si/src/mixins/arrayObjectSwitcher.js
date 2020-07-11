export default {  
  methods: {
    arrayToObject(array, keyField){
      array.reduce((obj, item) => {
        obj[item[keyField]] = item
        delete obj[item[keyField]]['.key']
        return obj
      }, {})
    }
  }
}