const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 确保数据库目录存在
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hospital.sqlite');
console.log('数据库路径:', dbPath);

// 只在数据库文件不存在时创建新数据库
const isNewDatabase = !fs.existsSync(dbPath);
console.log('是否为新数据库:', isNewDatabase);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log // 开启日志以便调试
});

// 定义模型
const Admin = sequelize.define('Admin', {
  adminId: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  password: { 
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Department = sequelize.define('Department', {
  departmentId: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  name: { 
    type: DataTypes.STRING,
    allowNull: false
  }
});

const Doctor = sequelize.define('Doctor', {
  doctorId: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  workTime: { 
    type: DataTypes.STRING, 
    defaultValue: '周一至周五 8:00-17:00'
  },
  departmentId: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  bio: { 
    type: DataTypes.STRING, 
    defaultValue: ''
  },
  remain: { 
    type: DataTypes.INTEGER, 
    defaultValue: 30
  },
  schedule: { 
    type: DataTypes.TEXT, 
    defaultValue: '{}'
  }
});

const Patient = sequelize.define('Patient', {
  idCard: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  age: { 
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  gender: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: false
  }
});

const Registration = sequelize.define('Registration', {
  regId: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    allowNull: false
  },
  patientId: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  dateTime: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  doctorId: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  departmentId: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  fee: { 
    type: DataTypes.FLOAT, 
    allowNull: false
  }
});

// 设置关联关系
Doctor.belongsTo(Department, { foreignKey: 'departmentId' });
Registration.belongsTo(Doctor, { foreignKey: 'doctorId' });
Registration.belongsTo(Patient, { foreignKey: 'patientId', targetKey: 'idCard' });
Registration.belongsTo(Department, { foreignKey: 'departmentId' });

// 初始化数据库
async function initDatabase() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 同步所有模型到数据库，只在新建数据库时强制重建表
    await sequelize.sync({ force: isNewDatabase });
    console.log('数据库表同步完成');
    
    // 只在新建数据库时初始化基础数据
    if (isNewDatabase) {
      // 初始化科室数据
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
      
      // 初始化管理员账号
      await Admin.create({
        adminId: 'admin',
        password: 'admin123'
      });
      console.log('管理员账号初始化完成');
      
      console.log('数据库初始化完成');
    }
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 执行初始化
initDatabase().catch(console.error);

module.exports = { sequelize, Admin, Department, Doctor, Patient, Registration };