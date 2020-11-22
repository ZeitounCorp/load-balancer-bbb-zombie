const si = require('systeminformation');

/**
 * @type {Function}
 * @param {Number} percent
 * @returns Promise that resolve to a list of processes that consume x or more percent of the cpu
 */
async function GetProcessesList(percent) {
  return new Promise(
    (resolve, reject) => {
      si.processes()
        .then(data => resolve(data.list.filter(p => p.pcpu >= Number(percent))))
        .catch(error => reject(error));
    });
}

/**
 * @type {Function}
 * @param {String} status can be ['running', 'blocked', 'sleeping', 'unknown']
 * @returns Promise that resolve to a list of processes whiches statuses are equal to the status passed as a param to this fn
 */
async function GetProcessesListByStatus(status) {
  return new Promise(
    (resolve, reject) => {
      const status_accepted = ['running', 'blocked', 'sleeping', 'unknown'];
      if (!status_accepted.includes(status)) reject("status must be one of the following ['running', 'blocked', 'sleeping', 'unknown']")
      si.processes()
        .then(data => resolve(data.list.filter(p => p.state === status)))
        .catch(error => reject(error));
    });
}

/**
 * @type {Function}
 * @returns Promise that resolve to the process details of the cpu most intensive process
 */
async function GetMostIntensiveProcess() {
  return new Promise(
    (resolve, reject) => {
      si.processes()
        .then(data => { 
          const cpu_usage_max = Math.max(...data.list.map(p => p.pcpu));
          const process = {
            cpu_percent: cpu_usage_max,
            process_id: data.list.filter(p => p.pcpu === cpu_usage_max)[0].pid,
            process_name: data.list.filter(p => p.pcpu === cpu_usage_max)[0].name
          }
          resolve(process)
        })
        .catch(error => reject(error));
    });
}

exports.GetProcessesList = GetProcessesList;
exports.GetProcessesListByStatus = GetProcessesListByStatus;
exports.GetMostIntensiveProcess = GetMostIntensiveProcess;
