const { sequelize, Admin, Department, Doctor, Patient, Registration } = require('./database');

async function checkDatabase() {
  try {
    console.log('开始检查数据库...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 检查科室表
    console.log('\n检查科室表...');
    const departments = await Department.findAll();
    console.log('科室数量:', departments.length);
    console.log('科室列表:');
    departments.forEach(dept => {
      console.log(`- ${dept.departmentId}: ${dept.name}`);
    });
    
    // 如果科室表为空，初始化数据
    if (departments.length === 0) {
      console.log('\n初始化科室数据...');
      const departmentList = [
        "普通外科", "骨科", "神经外科", "心胸外科", "泌尿外科",
        "肝胆外科", "肛肠外科", "烧伤科", "妇科", "产科",
        "儿科", "新生儿科", "眼科", "耳鼻喉科", "口腔科",
        "皮肤科", "风湿免疫科", "急诊科"
      ];
      
      for (const deptName of departmentList) {
        await Department.create({
          departmentId: deptName,
          name: deptName
        });
      }
      console.log('科室数据初始化完成');
    }
    
    console.log('\n数据库检查完成');
  } catch (error) {
    console.error('数据库检查失败:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase(); 