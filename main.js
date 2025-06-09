const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { checkAdminLogin, changeAdminPassword } = require('./services/authService');
const { registerPatient, cancelRegistration } = require('./services/registrationService');
const { queryRegistrations, getPatientRegistrations, getDoctorRegistrations } = require('./services/queryService');
const { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor, updateSchedule } = require('./services/doctorService');
const { Department } = require('./database/database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('renderer/login.html');
  // mainWindow.webContents.openDevTools(); // 调试时可开启
}

app.whenReady().then(() => {
  createWindow();

  // 管理员相关
  ipcMain.handle('login-admin', async (event, id, pwd) => {
    return checkAdminLogin(id, pwd);
  });

  ipcMain.handle('change-admin-password', async (event, adminId, oldPassword, newPassword) => {
    return changeAdminPassword(adminId, oldPassword, newPassword);
  });

  // 医生相关
  ipcMain.handle('get-doctors', async (event, departmentId) => {
    return getDoctors(departmentId);
  });

  ipcMain.handle('get-doctor', async (event, doctorId) => {
    return getDoctorById(doctorId);
  });

  ipcMain.handle('update-doctor', async (event, doctorData) => {
    if (doctorData.doctorId) {
      return updateDoctor(doctorData.doctorId, doctorData);
    } else {
      return createDoctor(doctorData);
    }
  });

  ipcMain.handle('delete-doctor', async (event, doctorId) => {
    return deleteDoctor(doctorId);
  });

  ipcMain.handle('update-schedule', async (event, doctorId, schedule) => {
    return updateSchedule(doctorId, schedule);
  });

  // 科室相关
  ipcMain.handle('get-departments', async () => {
    try {
      console.log('开始获取科室列表...');
      const departments = await Department.findAll();
      console.log('获取到的科室数据:', JSON.stringify(departments, null, 2));
      return departments;
    } catch (error) {
      console.error('获取科室列表失败:', error);
      throw error;
    }
  });

  // 挂号相关
  ipcMain.handle('register-patient', async (event, data) => {
    return registerPatient(data);
  });

  ipcMain.handle('cancel-registration', async (event, regId) => {
    return cancelRegistration(regId);
  });

  // 查询相关
  ipcMain.handle('query-registrations', async (event, filter) => {
    return queryRegistrations(filter);
  });

  ipcMain.handle('get-patient-registrations', async (event, patientId) => {
    return getPatientRegistrations(patientId);
  });

  ipcMain.handle('get-doctor-registrations', async (event, doctorId, date) => {
    return getDoctorRegistrations(doctorId, date);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
