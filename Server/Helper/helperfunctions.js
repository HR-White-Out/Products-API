const pool = require('../../Database/db.js');

const formatReturnObject = (allStylesPhotos, allSkus)=>{
  console.log('--------------in formatReturnObject--------------------');
  console.log('helper function format allStylesPhotos', allStylesPhotos);
  console.log('helper function format allSkus', allSkus);
  // const offset_prodID = 40343;
  const offset_prodID = 0;
  // const offset_styleID = 240499;
  const offset_styleID = 0;

  let product_id = allStylesPhotos[0].product_id+offset_prodID;
  console.log('product_id', product_id);

  let uniqueStyleIds = findUniqueStyleIds(allStylesPhotos);
  let stepInterval = allStylesPhotos.length/uniqueStyleIds;
  if (!Number.isInteger(stepInterval)) {
    console.log('length of allStylesPhoto', allStylesPhotos.length);
    console.log('uniqueStyleIds', uniqueStyleIds);
    console.error('uh oh');
  }
  else {
    console.log('we good');
  }
  let formattedObj = {
    'product_id': product_id,
    'results': '___FILL ME IN'
  }
  console.log('returning', formattedObj);
}

const findUniqueStyleIds = (allStylePhotos)=>{
  let count = 0;
  let seen = {};
  for (let i = 0; i<allStylePhotos.length; i++){
    // console.log(allStylePhotos[i].style_id);
    if (seen[allStylePhotos[i].style_id]===undefined){
      seen[allStylePhotos[i].style_id] = "seen";
    }
  }
  // console.log('seen obj', seen);
  for (const num in seen){
    count ++;
  }
  console.log('count is', count);
  console.log('seen is',seen);
  return count;
}


exports.formatReturnObject = formatReturnObject;