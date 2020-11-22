const si = require('systeminformation');
const os = require('os');

/**
 * @type {Function}
 * @returns Promise that resolve to the current cpu(s)' load on the server => {Number} X%
 */
async function GetCurrentLoad() {
  return new Promise(
    (resolve, reject) => {
      let index = 0;
      /**
       * si.currentLoad require to be called at least 2 times 
       * to get correct stats about the cpu, 
       * that's why there is a setInterval
       */
      setInterval(function () {
        si.currentLoad();
        if (index === 2) {
          clearInterval(this)
          si.currentLoad()
            .then(data => resolve(data.currentload))
            .catch(error => reject(error));
        }
        index++;
      }, 100)
    });
}

/**
 * @type {Function}
 * @param {Number} cpu The cpu we want to retrieve current load from
 * @returns Promise that resolve to the cpus[cpu] load on the server => {Number} X%
 */
async function GetCurrentLoadOnCpu(cpu) {
  return new Promise(
    (resolve, reject) => {
      if(cpu > GetNumberOfCpus() - 1) reject('CPU number is out of range');
      si.currentLoad()
        .then(data => resolve(data.cpus[cpu].load))
        .catch(error => reject(error));
    });
}

/**
 * @type {Function}
 * @returns {Object} Promise that resolve to the current load of each cpu on the server => {cpu1: Number, cpu2: ...}
 */
async function GetCurrentLoadOnEach() {
  return new Promise(
    (resolve, reject) => {
      si.currentLoad()
        .then(data => {
          let eachCpuLoad = [];
          for(let i=0; i < data.cpus.length; i++) {
            eachCpuLoad.push({[`cpu${i}`]: data.cpus[i].load})
          }
          resolve(eachCpuLoad);
        })
        .catch(error => reject(error));
    });
}

/**
 * @type {Function}
 * @returns Promise that resolve to the cpus' average speed => {Number} X (GHz)
 */
async function GetAVGCpusSpeed() {
  return new Promise(
    (resolve, reject) => {
      si.cpuCurrentspeed()
        .then(data => { resolve(data.avg)})
        .catch(error => reject(error));
    });
}

function GetNumberOfCpus() {
  return os.cpus().length;
}

exports.GetCurrentLoad = GetCurrentLoad;
exports.GetCurrentLoadOnCpu = GetCurrentLoadOnCpu;
exports.GetCurrentLoadOnEach = GetCurrentLoadOnEach;
exports.GetAVGCpusSpeed = GetAVGCpusSpeed;
