const { Patient, Registration, Doctor } = require('../database/database');
const { v4: uuidv4 } = require('uuid');

async function registerPatient(data) {
  const { patient, doctorId, departmentId } = data;
  if (!patient || !doctorId || !departmentId) {
    return { success: false, message: '参数不完整' };
  }
  try {
    // 检查患者是否存在
    let dbPatient = await Patient.findByPk(patient.idCard);
    if (!dbPatient) {
      dbPatient = await Patient.create({
        idCard: patient.idCard,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone
      });
    } else {
      // 更新患者信息
      await dbPatient.update({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone
      });
    }
    // 检查医生剩余号源
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor || doctor.remain <= 0) {
      return { success: false, message: '医生号源已满' };
    }
    // 创建挂号记录
    const regId = uuidv4();
    const now = new Date();
    const dateTime = now.toISOString().slice(0, 16).replace('T', ' ');
    await Registration.create({
      regId,
      patientId: patient.idCard,
      dateTime,
      doctorId,
      departmentId,
      fee: 10.0
    });
    // 扣减号源
    await doctor.update({ remain: doctor.remain - 1 });
    return { success: true, regId };
  } catch (e) {
    return { success: false, message: '挂号失败' };
  }
}

module.exports = { registerPatient };