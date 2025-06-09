const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'hospital.sqlite')
});

const Admin = sequelize.define('Admin', {
  adminId: { type: DataTypes.STRING, primaryKey: true },
  password: DataTypes.STRING
});

const Department = sequelize.define('Department', {
  departmentId: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING
});

const Doctor = sequelize.define('Doctor', {
  doctorId: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  workTime: DataTypes.STRING,
  departmentId: DataTypes.STRING,
  title: DataTypes.STRING,
  bio: DataTypes.STRING,
  remain: { type: DataTypes.INTEGER, defaultValue: 30 },
  schedule: DataTypes.TEXT
});

const Patient = sequelize.define('Patient', {
  idCard: { type: DataTypes.STRING, primaryKey: true },
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
  phone: DataTypes.STRING
});

const Registration = sequelize.define('Registration', {
  regId: { type: DataTypes.STRING, primaryKey: true },
  patientId: DataTypes.STRING,
  dateTime: DataTypes.STRING,
  doctorId: DataTypes.STRING,
  departmentId: DataTypes.STRING,
  fee: DataTypes.FLOAT
});

Doctor.belongsTo(Department, { foreignKey: 'departmentId' });
Registration.belongsTo(Doctor, { foreignKey: 'doctorId' });
Registration.belongsTo(Patient, { foreignKey: 'patientId', targetKey: 'idCard' });
Registration.belongsTo(Department, { foreignKey: 'departmentId' });

sequelize.sync();

module.exports = { sequelize, Admin, Department, Doctor, Patient, Registration };