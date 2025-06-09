const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 管理员相关
  loginAdmin: (id, pwd) => ipcRenderer.invoke('login-admin', id, pwd),
  
  // 医生相关
  getDoctors: () => ipcRenderer.invoke('get-doctors'),
  updateDoctor: (doc) => ipcRenderer.invoke('update-doctor', doc),
  deleteDoctor: (doctorId) => ipcRenderer.invoke('delete-doctor', doctorId),
  updateSchedule: (doctorId, schedule) => ipcRenderer.invoke('update-schedule', doctorId, schedule),
  
  // 科室相关
  getDepartments: () => ipcRenderer.invoke('get-departments'),
  
  // 挂号相关
  registerPatient: (data) => ipcRenderer.invoke('register-patient', data),
  queryRegistrations: (filter) => ipcRenderer.invoke('query-registrations', filter)
});