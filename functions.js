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
  let resultObj = {};
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
              resultObj[curVal.name] = curVal.id;
            }
          }
        }
      }
    }
  }
  return resultObj;
};

const returnId = (arr, category) => {
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
              resultArr.push(curVal.id);
            }
          }
        }
      }
    }
  }
  return resultArr;
};

const categCount = (arr) => {
  let resultObj = {};
  for (let i = 0; i < arr.length; i++) {
    let curObj = arr[i];
    for (let keys in curObj) {
      let curKey = keys;
      if (curKey === "dataValues") {
        let curVal = curObj[curKey];
        if (typeof curVal === "object") {
          for (let keys in curVal) {
            let newKey = keys;
            if (newKey === "category") {
              let newVal = curVal[newKey];
              if (!resultObj[newVal]) {
                resultObj[newVal] = 1;
              } else {
                resultObj[newVal]++;
              }
            }
          }
        }
      }
    }
  }
  return resultObj;
};

// categ: num,
module.exports = {
  categCounter,
  name,
  returnId,
  categCount,
};
