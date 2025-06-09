const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { checkAdminLogin } = require('./services/authService');
const { registerPatient } = require('./services/registrationService');
const { queryRegistrations } = require('./services/queryService');
const { Doctor, Department } = require('./database/database');

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

  ipcMain.handle('login-admin', async (event, id, pwd) => {
    return checkAdminLogin(id, pwd);
  });

  ipcMain.handle('register-patient', async (event, data) => {
    return registerPatient(data);
  });

  ipcMain.handle('get-doctors', async () => {
    return Doctor.findAll();
  });

  ipcMain.handle('get-departments', async () => {
    return Department.findAll();
  });

  ipcMain.handle('update-schedule', async (event, id, sched) => {
    const doc = await Doctor.findByPk(id);
    if (!doc) return false;
    doc.schedule = sched;
    await doc.save();
    return true;
  });

  ipcMain.handle('update-doctor', async (event, docData) => {
    let doctor = await Doctor.findByPk(docData.doctorId);
    if (doctor) {
      Object.assign(doctor, docData);
      await doctor.save();
    } else {
      doctor = await Doctor.create(docData);
    }
    return true;
  });

  ipcMain.handle('delete-doctor', async (event, doctorId) => {
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return false;
    await doctor.destroy();
    return true;
  });

  ipcMain.handle('query-registrations', async (event, filter) => {
    return queryRegistrations(filter);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
