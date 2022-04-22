const pool = require('../../Database/db.js');

const formatReturnObject = (idSelected, allStyles, allPhotos, allSkus)=>{
  console.log('--------------in formatReturnObject--------------------');
  // console.log('-----idSelected-----------------');
  // console.log(idSelected);
  // console.log('-----AllStyles-----------------');
  // console.log(allStyles);
  // console.log('-----AllPhotos-----------------');
  // console.log(allPhotos);
  // console.log('-----AllSkus-----------------');
  // console.log(allSkus);


  // const offset_prodID = 0;
  // const offset_styleID = 0;
  // const offset_skusID = 0;
  const offset_prodID = 40343;
  const offset_styleID = 240499;
  const offset_skusID = 1394768;


  let product_id = idSelected + offset_prodID;
  console.log('-----lengths-----------------');
  console.log(allStyles.length);
  console.log(allPhotos.length)
  console.log(allSkus.length)

  for (let i=0; i<allStyles.length;i++){
    // console.log(allStyles[i]);
    let style_id = allStyles[i].id + offset_styleID;
    allStyles[i]['style_id'] = style_id;
    delete allStyles[i].id;
    delete allStyles[i].product_id;

    // console.log('-----look at photo index-----------------');

    // console.log(allPhotos[i]);
    allStyles[i]['photos'] = allPhotos[i];
    // console.log('-----look at sku index-----------------');


    // console.log(allSkus[i]);
    let skusObj = {};
    for (let j=0; j<allSkus[i].length; j++){
      // console.log('-----each individual sku-----------------');
      let skuFormatted = allSkus[i][j];
      delete skuFormatted.style_id; //maybe?
      let newSkuID = skuFormatted.id + offset_skusID;
      delete skuFormatted.id;
      skusObj[`${newSkuID}`] = skuFormatted;
    }
    // console.log('-----sku obj-----------------');
    // console.log(skusObj);
    allStyles[i]['skus'] = skusObj;
  }
  // console.log('-----after for loop-----------------');
  // console.log(allStyles);

  let formattedObj = {
    'product_id': product_id,
    'results': allStyles
  }
  console.log('returning', formattedObj);
  return formattedObj;
}

const findUniqueStyleIds = (array)=>{
  let unique = [];
  array.forEach(style=>{
    unique.push(style.id);
  })
  // console.log('unique',unique);
  return unique;
}


exports.findUniqueStyleIds = findUniqueStyleIds;
exports.formatReturnObject = formatReturnObject;