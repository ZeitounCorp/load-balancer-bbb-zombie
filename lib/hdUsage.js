const hddSpace = require('hdd-space');
const si = require('systeminformation');
const bytes = require('bytes');

/**
 * @type {Function}
 * @returns Return the total Disk Size and the free space available => {free: '', size: ''}
 */
async function GetDiskInfo() {
  return new Promise(
    (resolve) => {
      hddSpace({ format: 'auto' }, function (info) {
        resolve(info.total);
      });
    });
}

/**
 * @type {Function}
 * @returns Return the total free space available (number in bytes)
 */
async function GetAvailableSpace() {
  return new Promise(
    (resolve) => {
      hddSpace(function (info) {
        resolve(info.total.free);
      });
    });
}

/**
 * @type {Function}
 * @returns Return the bytes read/written in an interval of 1 second
 */
async function GetDiskRWStats() {
  return new Promise(
    (resolve, reject) => {
      let index = 0;
      /**
       * si.fsStats require to be called at least 2 times
       * to get correct stats about the cpu, 
       * that's why there is a setInterval
       */
      setInterval(function () {
        si.fsStats();
        if (index === 2) {
          clearInterval(this)
          si.fsStats()
            .then(data => {
              const diskIO = {
                read_speed: bytes(data.rx_sec),
                write_speed: bytes(data.wx_sec)
              }
              resolve(diskIO)
            })
            .catch(error => reject(error));
        }
        index++;
      }, 1000)
    });
}

exports.GetDiskInfo = GetDiskInfo;
exports.GetAvailableSpace = GetAvailableSpace;
exports.GetDiskRWStats = GetDiskRWStats;

