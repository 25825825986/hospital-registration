const { Doctor, Patient, Registration, Department } = require('../database/database');
const { v4: uuidv4 } = require('uuid');

async function registerPatient({ idCard, name, age, gender, phone, doctorId, departmentId, dateTime }) {
  try {
    console.log('开始挂号流程:', { idCard, doctorId, dateTime });
    
    // 检查医生是否存在且有余号
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }
    if (doctor.remain <= 0) {
      throw new Error('该医生已无余号');
    }
    
    // 检查科室是否存在
    const department = await Department.findByPk(departmentId);
    if (!department) {
      throw new Error('科室不存在');
    }
    
    // 检查是否重复挂号
    const existingRegistration = await Registration.findOne({
      where: {
        patientId: idCard,
        dateTime: dateTime
      }
    });
    if (existingRegistration) {
      throw new Error('该时间段已存在挂号记录');
    }
    
    // 创建或更新患者信息
    let patient = await Patient.findByPk(idCard);
    if (!patient) {
      patient = await Patient.create({ idCard, name, age, gender, phone });
      console.log('创建新患者:', idCard);
    } else {
      // 更新患者信息
      Object.assign(patient, { name, age, gender, phone });
      await patient.save();
      console.log('更新患者信息:', idCard);
    }
    
    // 计算挂号费用
    const fee = doctor.title === '主任医师' ? 10 : 5;
    
    // 创建挂号记录
    const registration = await Registration.create({
      regId: uuidv4(),
      patientId: idCard,
      doctorId,
      departmentId,
      dateTime,
      fee
    });
    console.log('创建挂号记录:', registration.regId);
    
    // 更新医生余号
    doctor.remain--;
    await doctor.save();
    console.log('更新医生余号:', doctor.remain);
    
    return {
      success: true,
      registration,
      patient,
      doctor
    };
  } catch (error) {
    console.error('挂号失败:', error);
    throw error;
  }
}

async function cancelRegistration(regId) {
  try {
    console.log('取消挂号:', regId);
    const registration = await Registration.findByPk(regId);
    if (!registration) {
      throw new Error('挂号记录不存在');
    }
    
    // 恢复医生余号
    const doctor = await Doctor.findByPk(registration.doctorId);
    if (doctor) {
      doctor.remain++;
      await doctor.save();
      console.log('恢复医生余号:', doctor.remain);
    }
    
    // 删除挂号记录
    await registration.destroy();
    console.log('删除挂号记录:', regId);
    
    return true;
  } catch (error) {
    console.error('取消挂号失败:', error);
    throw error;
  }
}

module.exports = { registerPatient, cancelRegistration };