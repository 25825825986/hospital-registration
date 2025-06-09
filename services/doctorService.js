const { Doctor, Department } = require('../database/database');
const { v4: uuidv4 } = require('uuid');

async function getDoctors(departmentId = null) {
  try {
    console.log('获取医生列表, 科室:', departmentId);
    const where = departmentId ? { departmentId } : {};
    const doctors = await Doctor.findAll({
      where,
      include: [{
        model: Department,
        attributes: ['name']
      }]
    });
    return doctors;
  } catch (error) {
    console.error('获取医生列表失败:', error);
    throw error;
  }
}

async function getDoctorById(doctorId) {
  try {
    console.log('获取医生信息:', doctorId);
    const doctor = await Doctor.findByPk(doctorId, {
      include: [{
        model: Department,
        attributes: ['name']
      }]
    });
    return doctor;
  } catch (error) {
    console.error('获取医生信息失败:', error);
    throw error;
  }
}

async function createDoctor(doctorData) {
  try {
    console.log('创建医生:', doctorData);
    // 生成医生ID: D + 科室首字母 + 4位随机数
    const department = await Department.findByPk(doctorData.departmentId);
    const deptInitial = department.name.charAt(0);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const doctorId = `D${deptInitial}${randomNum}`;
    
    const doctor = await Doctor.create({
      ...doctorData,
      doctorId,
      remain: doctorData.remain || 30,
      workTime: doctorData.workTime || '周一至周五 8:00-17:00',
      schedule: doctorData.schedule || '{}'
    });
    
    console.log('医生创建成功:', doctor.doctorId);
    return doctor;
  } catch (error) {
    console.error('创建医生失败:', error);
    throw error;
  }
}

async function updateDoctor(doctorId, doctorData) {
  try {
    console.log('更新医生信息:', doctorId);
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }
    
    Object.assign(doctor, doctorData);
    await doctor.save();
    console.log('医生信息更新成功');
    return doctor;
  } catch (error) {
    console.error('更新医生信息失败:', error);
    throw error;
  }
}

async function deleteDoctor(doctorId) {
  try {
    console.log('删除医生:', doctorId);
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }
    
    await doctor.destroy();
    console.log('医生删除成功');
    return true;
  } catch (error) {
    console.error('删除医生失败:', error);
    throw error;
  }
}

async function updateSchedule(doctorId, schedule) {
  try {
    console.log('更新医生排班:', doctorId);
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }
    
    doctor.schedule = schedule;
    await doctor.save();
    console.log('排班更新成功');
    return true;
  } catch (error) {
    console.error('更新排班失败:', error);
    throw error;
  }
}

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  updateSchedule
};
