const { Registration, Patient, Doctor, Department } = require('../database/database');
const { Op } = require('sequelize');

async function queryRegistrations(filter = {}) {
  try {
    console.log('查询挂号记录:', filter);
    const where = {};
    
    // 构建查询条件
    if (filter.patientId) {
      where.patientId = filter.patientId;
    }
    if (filter.doctorId) {
      where.doctorId = filter.doctorId;
    }
    if (filter.departmentId) {
      where.departmentId = filter.departmentId;
    }
    if (filter.startDate && filter.endDate) {
      where.dateTime = {
        [Op.between]: [filter.startDate, filter.endDate]
      };
    }
    
    const registrations = await Registration.findAll({
      where,
      include: [
        {
          model: Patient,
          attributes: ['name', 'age', 'gender', 'phone']
        },
        {
          model: Doctor,
          attributes: ['name', 'title']
        },
        {
          model: Department,
          attributes: ['name']
        }
      ],
      order: [['dateTime', 'DESC']]
    });
    
    return registrations;
  } catch (error) {
    console.error('查询挂号记录失败:', error);
    throw error;
  }
}

async function getPatientRegistrations(patientId) {
  try {
    console.log('获取患者挂号记录:', patientId);
    const registrations = await Registration.findAll({
      where: { patientId },
      include: [
        {
          model: Doctor,
          attributes: ['name', 'title']
        },
        {
          model: Department,
          attributes: ['name']
        }
      ],
      order: [['dateTime', 'DESC']]
    });
    
    return registrations;
  } catch (error) {
    console.error('获取患者挂号记录失败:', error);
    throw error;
  }
}

async function getDoctorRegistrations(doctorId, date) {
  try {
    console.log('获取医生挂号记录:', doctorId, date);
    const where = { doctorId };
    if (date) {
      where.dateTime = {
        [Op.like]: `${date}%`
      };
    }
    
    const registrations = await Registration.findAll({
      where,
      include: [
        {
          model: Patient,
          attributes: ['name', 'age', 'gender', 'phone']
        }
      ],
      order: [['dateTime', 'ASC']]
    });
    
    return registrations;
  } catch (error) {
    console.error('获取医生挂号记录失败:', error);
    throw error;
  }
}

module.exports = {
  queryRegistrations,
  getPatientRegistrations,
  getDoctorRegistrations
};