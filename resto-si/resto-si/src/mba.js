export function apriori(transactions, minSupport){
  let items = {}; // items hold occurence and support for each combination
  let temp = []; // temp hold single item
  let rules = {}; // rules hold rules generated after apriori
  const numTransaction = [...transactions].length;

  // count occurences of single items
  [...Object.values({...transactions})].forEach(transaction => {
    [...Object.values(transaction.items)].forEach(item => {       
      items[item.name] = {
        name: item.name,
        items: [item.name],
        occurence: (item.name in items ?  items[item.name].occurence : 0) + 1
      }
    })
  });

  // count support, filter single items below minimal support
  [...Object.values(items)].forEach(item => {
    if(item.occurence / numTransaction >= minSupport){ // if above min support
      if(!temp.includes(item.name)){
        temp.push(item.name) // save distinct item to temp
      }

      items[item.name] = {
        ...items[item.name],
        support: item.occurence / numTransaction // count support
      }
    }else{
      delete items[item.name] // save memory
    }
  })

  // count occurences of pair items
  for (let i = 0; i < temp.length - 1; i++) {
    for (let j = i + 1; j < temp.length; j++) {
      // iterate through all transaction to find occurences of pairs
      [...Object.values({...transactions})].forEach(transaction => {
          let checkItem1 = false;
          let checkItem2 = false;

          [...Object.values(transaction.items)].forEach(item => {       
            if(item.name === temp[i]){
              checkItem1 = true
            }else if(item.name === temp[j]){
              checkItem2 = true
            }
          })     

          if(checkItem1 === true && checkItem2 === true){
            let sortedItem = [temp[i], temp[j]].sort();

            items[`${sortedItem[0]}, ${sortedItem[1]}`] = {
              name: `${sortedItem[0]}, ${sortedItem[1]}`,
              items: [sortedItem[0], sortedItem[1]],
              occurence: (`${sortedItem[0]}, ${sortedItem[1]}` in items ?  items[`${sortedItem[0]}, ${sortedItem[1]}`].occurence : 0) + 1,
            }
          }
      })
    }
  }

  // count support, filter pair items below minimal support
  [...Object.values(items)].forEach(item => {
    if(item.occurence / numTransaction >= minSupport){
      items[item.name] = {
        ...items[item.name],
        support: item.occurence / numTransaction // count support
      }
    }else{
      delete items[item.name] // save memory
    }
  })

  // count occurences of triplet items
  for (let i = 0; i < temp.length - 1; i++) {
    for (let j = i + 1; j < temp.length; j++) {
      for (let k = j + 1; j < temp.length; j++) {
        // iterate through all transaction to find occurences of triplets
        [...Object.values({...transactions})].forEach(transaction => {
            let checkItem1 = false;
            let checkItem2 = false;
            let checkItem3 = false;

            [...Object.values(transaction.items)].forEach(item => {       
              if(item.name === temp[i]){
                checkItem1 = true
              }else if(item.name === temp[j]){
                checkItem2 = true
              }else if(item.name === temp[k]){
                checkItem3 = true
              }
            })     

            if(checkItem1 === true && checkItem2 === true && checkItem3 === true){
              let sortedItem = [temp[i], temp[j], temp[k]].sort();

              items[`${sortedItem[0]}, ${sortedItem[1]}, ${sortedItem[2]}`] = {
                name: `${sortedItem[0]}, ${sortedItem[1]}, ${sortedItem[2]}`,
                items: [sortedItem[0], sortedItem[1], sortedItem[2]],
                occurence: (`${sortedItem[0]}, ${sortedItem[1]}, ${sortedItem[2]}` in items ?  items[`${sortedItem[0]}, ${sortedItem[1]}, ${sortedItem[2]}`].occurence : 0) + 1,
              }
            }
        })
      }
    }
  }

  // count support, filter single items below minimal support
  [...Object.values(items)].forEach(item => {
    if(item.occurence / [...transactions].length >= minSupport){
      items[item.name] = {
        ...items[item.name],
        support: item.occurence / numTransaction
      }
    }else{
      delete items[item.name]
    }
  });

  // code below might look like a lazy code, but tbh I have not found a better approach yet
  [...Object.values(items)].forEach(item => { 
    if(item.items.length === 2){ // generating rules from pairs
      rules[`${item.items[0]} => ${item.items[1]}`] = {
        name: `${item.items[0]} => ${item.items[1]}`,
        confidence: item.support / items[item.items[0]].support,
        lift: item.support / (items[item.items[0]].support *  items[item.items[1]].support)
      }

      rules[`${item.items[1]} => ${item.items[0]}`] = {
        name: `${item.items[1]} => ${item.items[0]}`,
        confidence: item.support / items[item.items[1]].support,
        lift: item.support / (items[item.items[0]].support *  items[item.items[1]].support)
      }
    }else if(item.items.length === 3){ // generating rules from triplets
      for (let i = 0; i < item.items.length - 1; i++) {
        for (let j = i + 1; j < item.items.length; j++) {
          if(`${item.items[i]} => ${item.items[j]}` in rules === false){
            rules[`${item.items[i]} => ${item.items[j]}`] = {
              name: `${item.items[i]} => ${item.items[j]}`,
              confidence: item.support / items[item.items[i]].support,
              lift: item.support / (items[item.items[i]].support * items[item.items[j]].support)
            }

            rules[`${item.items[j]} => ${item.items[i]}`] = {
              name: `${item.items[j]} => ${item.items[i]}`,
              confidence: item.support / items[item.items[j]].support,
              lift: item.support / (items[item.items[i]].support * items[item.items[j]].support)
            }
          }
        }
      }
      
      rules[`${item.items[0]} => {${item.items[1]}, ${item.items[2]}}`] = {
        name: `${item.items[0]} => {${item.items[1]}, ${item.items[2]}}`,
        confidence: item.support / items[item.items[0]].support,
        lift: item.support / (items[item.items[0]].support * items[`${item.items[1]}, ${item.items[2]}`].support)
      }

      rules[`{${item.items[0]}, ${item.items[1]}} => ${item.items[2]}`] = {
        name: `{${item.items[0]}, ${item.items[1]}} => ${item.items[2]}`,
        confidence: item.support / items[`${item.items[0]}, ${item.items[1]}`].support,
        lift: item.support / (items[`${item.items[0]}, ${item.items[1]}`].support * items[item.items[2]].support )
      }

      rules[`${item.items[1]} => {${item.items[2]}, ${item.items[0]}}`] = {
        name: `${item.items[1]} => {${item.items[2]}, ${item.items[0]}}`,
        confidence: item.support / items[item.items[1]].support,
        lift: item.support / (items[item.items[1]].support * items[`${item.items[0]}, ${item.items[2]}`].support)
      }

      rules[`{${item.items[1]}, ${item.items[2]}} => ${item.items[0]}`] = {
        name: `{${item.items[1]}, ${item.items[2]}} => ${item.items[0]}`,
        confidence: item.support / items[`${item.items[1]}, ${item.items[2]}`].support,
        lift: item.support / (items[`${item.items[0]}, ${item.items[1]}`].support * items[item.items[2]].support )
      }

      rules[`${item.items[2]} => {${item.items[0]}, ${item.items[1]}}`] = {
        name: `${item.items[2]} => {${item.items[0]}, ${item.items[1]}}`,
        confidence: item.support / items[item.items[2]].support,
        lift: item.support / (items[item.items[2]].support * items[`${item.items[0]}, ${item.items[1]}`].support)
      }

      rules[`{${item.items[2]}, ${item.items[0]}} => ${item.items[1]}`] = {
        name: `{${item.items[2]}, ${item.items[0]}} => ${item.items[1]}`,
        confidence: item.support / items[`${item.items[0]}, ${item.items[2]}`].support,
        lift: item.support / (items[`${item.items[0]}, ${item.items[2]}`].support * items[item.items[1]].support )
      }

    }
  })
  
  return rules
}