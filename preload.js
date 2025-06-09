const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  loginAdmin: (id, pwd) => ipcRenderer.invoke('login-admin', id, pwd),
  registerPatient: (data) => ipcRenderer.invoke('register-patient', data),
  getDoctors: () => ipcRenderer.invoke('get-doctors'),
  updateSchedule: (doctorId, schedule) => ipcRenderer.invoke('update-schedule', doctorId, schedule),
  updateDoctor: (doc) => ipcRenderer.invoke('update-doctor', doc),
  queryRegistrations: (filter) => ipcRenderer.invoke('query-registrations', filter),
  getDepartments: () => ipcRenderer.invoke('get-departments'),
  getDoctors: () => ipcRenderer.invoke('get-doctors'),
  updateDoctor: (doc) => ipcRenderer.invoke('update-doctor', doc),
  deleteDoctor: (doctorId) => ipcRenderer.invoke('delete-doctor', doctorId)
});