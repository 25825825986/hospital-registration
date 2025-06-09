const { Doctor, Patient, Registration } = require('../database/database');
const { v4: uuidv4 } = require('uuid');

async function registerPatient({ idCard, name, age, gender, phone, doctorId, departmentId, dateTime }) {
  let patient = await Patient.findByPk(idCard);
  if (!patient) {
    patient = await Patient.create({ idCard, name, age, gender, phone });
  }

  const doctor = await Doctor.findByPk(doctorId);
  if (doctor.remain <= 0) throw new Error('No remaining registrations');

  const fee = doctor.title.includes('主任') ? 10 : 5;
  await Registration.create({
    regId: uuidv4(),
    patientId: idCard,
    doctorId,
    departmentId,
    dateTime,
    fee
  });

  doctor.remain--;
  await doctor.save();
  return true;
}

module.exports = { registerPatient };