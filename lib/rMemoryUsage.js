const si = require('systeminformation');
const bytes = require('bytes');

/**
 * @type {Function}
 * @param {String|Array} type can be ['total', 'free', 'used', 'available']
 * @returns Promise that resolve to the memory associated with the type(s) passed as a param
 */
async function GetRAMInfo(type) {
  return new Promise(
    (resolve, reject) => {
      if (Array.isArray(type)) {

        const ram_fields = {};
        si.mem()
          .then(data => {
            type.forEach(t => {
              Object.defineProperty(ram_fields, t, {
                value: bytes(data[t]),
                enumerable: true,
                writable: false
              });
            });
            resolve(ram_fields);
          })
          .catch(error => reject(error));

      } else if (typeof type === 'string') {

        const type_accepted = ['total', 'free', 'used', 'available'];
        if (!type_accepted.includes(type)) reject("type must be one of the following  ['total', 'free', 'used', 'available']")
        si.mem()
          .then(data => resolve(bytes(data[type])))
          .catch(error => reject(error));

      } else {

        si.mem()
          .then(data => {
            Object.keys(data).forEach((key) => {
              data[key] = bytes(data[key])
            });
            resolve(data);
          })
          .catch(error => reject(error));

      }
    });
}

exports.GetRAMInfo = GetRAMInfo;
