const categCounter = (arr) => {
  let searchCount = 0;
  for (let i = 0; i < arr.length; i++) {
    let curObj = arr[i];

    for (let keys in curObj) {
      let curKey = keys;
      if (curKey === "dataValues") {
        let curVal = curObj[curKey];
        if (typeof curVal === "object") {
          for (let keys in curVal) {
            let newKey = keys;
            let newVal = curVal[newKey];
            if (newVal === "jobsearch") {
              searchCount++;
            }
          }
        }
      }
    }
  }
  return searchCount;
};

const name = (arr, category) => {
  let resultArr = [];
  for (let i = 0; i < arr.length; i++) {
    let curObj = arr[i];
    for (let keys in curObj) {
      let curKey = keys;
      if (curKey === "dataValues") {
        let curVal = curObj[curKey];
        if (typeof curVal === "object") {
          for (let keys in curVal) {
            let newKey = keys;
            let newVal = curVal[newKey];
            if (newVal === category) {
              resultArr.push(curVal.name);
            }
          }
        }
      }
    }
  }
  return resultArr;
};

module.exports = {
  categCounter,
  name,
};
