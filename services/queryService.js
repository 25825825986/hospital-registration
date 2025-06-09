const { Registration, Doctor, Patient, Department } = require('../database/database');

async function queryRegistrations(filter = {}) {
  return await Registration.findAll({
    where: filter,
    include: [Doctor, Patient, Department]
  });
}

module.exports = { queryRegistrations };