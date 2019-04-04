const reportGenerator = (meta = {}) => {
  const keyList = Object.keys(meta)
  
  let flatMetaSize = 0
  let flatTotalSpendTime = 0
  const flatMeta = []
  for(const key of keyList) {
    flatMeta.push({
      ...meta[key],
      id: key
    })
  }
  
  const resourceTypeList = [...new Set(flatMeta.map(item => item.resourceType))]
  
  const reportList = []
  for(const type of resourceTypeList) {
    const fileList = []
  
    const typeList = flatMeta.filter( item => item.resourceType === type)
    const totalSize = typeList.reduce(function(_total, item) {
      const {id, size, fileName} = item
      const sizeInKb = Math.ceil(size/1024)
      fileList.push({id, size: sizeInKb, fileName})
      return _total + (sizeInKb);
    }, 0);
    const totalSpendTime = typeList.reduce(function(_total, item) {
      const {spendTime} = item
      return _total + (spendTime);
    }, 0);
  
    reportList.push({type, totalSize, totalSpendTime, file: fileList})
    flatMetaSize += totalSize
    flatTotalSpendTime += totalSpendTime
  }
  
  console.log(`[INFO] Total Traffic: ${flatMeta.length} file, ${(flatMetaSize/1024)}mb`)
  console.log(`[INFO] ${resourceTypeList.length} types of file: `)
  reportList.forEach( item => {
    const {type, totalSize, file = []}  = item
    console.log(`[INFO] ${file.length}  ${type}   ${totalSize}kb`)
  
    // file.forEach( ({fileName, size}) => console.log(`                   - ${size}kb   ${fileName}`))
  })

  return {
    totalSpendTime: flatTotalSpendTime,
    totalFile: flatMeta.length,
    totalSize: flatMetaSize, //kb
    reportList,
  }
}

module.exports = {reportGenerator}