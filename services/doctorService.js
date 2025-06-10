const { Doctor, Department } = require('../database/database');

// 工具函数：解析21位01字符串为可读的上班时间
function parseScheduleString(scheduleStr) {
  // scheduleStr: 21位字符串，每3位为一组，第一位是否上班，第二位上午，第三位下午
  // 返回 { am: [...], pm: [...] }
  if (!scheduleStr || scheduleStr.length < 21) return { am: [], pm: [] };
  const weekMap = ['一', '二', '三', '四', '五', '六', '日'];
  let am = [], pm = [];
  for (let i = 0; i < 7; i++) {
    const base = i * 3;
    if (scheduleStr[base] === '1') {
      if (scheduleStr[base + 1] === '1') am.push('周' + weekMap[i]);
      if (scheduleStr[base + 2] === '1') pm.push('周' + weekMap[i]);
    }
  }
  return { am, pm };
}

// 生成workTime字符串
function getWorkTimeString(scheduleStr) {
  const { am, pm } = parseScheduleString(scheduleStr);
  let result = [];
  if (am.length) result.push(am.join('、') + ' 上午');
  if (pm.length) result.push(pm.join('、') + ' 下午');
  return result.join('；');
}

// 获取医生列表，附加workTime
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
    
    // 格式化返回数据
    const formattedDoctors = doctors.map(doc => {
      const doctorData = doc.get({ plain: true });
      return {
        id: doctorData.id,
        doctorId: doctorData.doctorId,
        name: doctorData.name,
        title: doctorData.title,
        departmentId: doctorData.departmentId,
        remain: doctorData.remain,
        bio: doctorData.bio,
        schedule: doctorData.schedule,
        Department: doctorData.Department ? {
          name: doctorData.Department.name
        } : null
      };
    });
    
    return formattedDoctors;
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
    if (!doctor) return null;
    const doctorData = doctor.get({ plain: true });
    return {
      ...doctorData,
      workTime: getWorkTimeString(doctorData.schedule || '')
    };
  } catch (error) {
    console.error('获取医生信息失败:', error);
    throw error;
  }
}

async function createDoctor(doctorData) {
  try {
    console.log('创建医生:', doctorData);

    // 获取科室信息
    const department = await Department.findByPk(doctorData.departmentId);
    if (!department) {
      throw new Error('科室不存在');
    }

    // 生成医生ID: 7位数字，从1开始递增
    let maxDoctor = await Doctor.findOne({
      order: [['doctorId', 'DESC']]
    });
    let nextId = 1;
    if (maxDoctor && maxDoctor.doctorId) {
      // 只保留数字部分
      let maxNum = parseInt(maxDoctor.doctorId, 10);
      if (!isNaN(maxNum)) {
        nextId = maxNum + 1;
      }
    }
    const doctorId = String(nextId).padStart(7, '0');

    const doctor = await Doctor.create({
      ...doctorData,
      doctorId,
      remain: doctorData.remain || 30,
      // workTime 字段已移除
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
