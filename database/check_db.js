const { sequelize, Admin, Department, Doctor, Patient, Registration } = require('./database');

async function checkDatabase() {
  try {
    // 检查数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查表结构
    console.log('\n检查表结构:');
    
    // 检查 Admin 表
    const adminAttributes = Admin.rawAttributes;
    console.log('\nAdmin 表结构:');
    Object.keys(adminAttributes).forEach(key => {
      console.log(`${key}: ${JSON.stringify(adminAttributes[key])}`);
    });

    // 检查 Department 表
    const deptAttributes = Department.rawAttributes;
    console.log('\nDepartment 表结构:');
    Object.keys(deptAttributes).forEach(key => {
      console.log(`${key}: ${JSON.stringify(deptAttributes[key])}`);
    });

    // 检查 Doctor 表
    const doctorAttributes = Doctor.rawAttributes;
    console.log('\nDoctor 表结构:');
    Object.keys(doctorAttributes).forEach(key => {
      console.log(`${key}: ${JSON.stringify(doctorAttributes[key])}`);
    });

    // 检查 Patient 表
    const patientAttributes = Patient.rawAttributes;
    console.log('\nPatient 表结构:');
    Object.keys(patientAttributes).forEach(key => {
      console.log(`${key}: ${JSON.stringify(patientAttributes[key])}`);
    });

    // 检查 Registration 表
    const regAttributes = Registration.rawAttributes;
    console.log('\nRegistration 表结构:');
    Object.keys(regAttributes).forEach(key => {
      console.log(`${key}: ${JSON.stringify(regAttributes[key])}`);
    });

    // 检查数据
    console.log('\n检查数据:');
    
    const adminCount = await Admin.count();
    console.log(`Admin 表记录数: ${adminCount}`);

    const deptCount = await Department.count();
    console.log(`Department 表记录数: ${deptCount}`);

    const doctorCount = await Doctor.count();
    console.log(`Doctor 表记录数: ${doctorCount}`);

    const patientCount = await Patient.count();
    console.log(`Patient 表记录数: ${patientCount}`);

    const regCount = await Registration.count();
    console.log(`Registration 表记录数: ${regCount}`);

    // 检查关联关系
    console.log('\n检查关联关系:');
    
    // 检查医生和科室的关联
    const doctors = await Doctor.findAll({
      include: [Department]
    });
    console.log(`医生-科室关联数: ${doctors.length}`);

    // 检查挂号和医生的关联
    const registrations = await Registration.findAll({
      include: [Doctor, Patient, Department]
    });
    console.log(`挂号关联数: ${registrations.length}`);

  } catch (error) {
    console.error('检查数据库时出错:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 