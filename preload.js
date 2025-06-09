const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 管理员相关
  loginAdmin: (id, pwd) => ipcRenderer.invoke('login-admin', id, pwd),
  changeAdminPassword: (adminId, oldPassword, newPassword) => 
    ipcRenderer.invoke('change-admin-password', adminId, oldPassword, newPassword),
  
  // 医生相关
  getDoctors: (departmentId) => ipcRenderer.invoke('get-doctors', departmentId),
  getDoctor: (doctorId) => ipcRenderer.invoke('get-doctor', doctorId),
  updateDoctor: (doctorData) => ipcRenderer.invoke('update-doctor', doctorData),
  deleteDoctor: (doctorId) => ipcRenderer.invoke('delete-doctor', doctorId),
  updateSchedule: (doctorId, schedule) => ipcRenderer.invoke('update-schedule', doctorId, schedule),
  
  // 科室相关
  getDepartments: () => ipcRenderer.invoke('get-departments'),
  
  // 挂号相关
  registerPatient: (data) => ipcRenderer.invoke('register-patient', data),
  cancelRegistration: (regId) => ipcRenderer.invoke('cancel-registration', regId),
  
  // 查询相关
  queryRegistrations: (filter) => ipcRenderer.invoke('query-registrations', filter),
  getPatientRegistrations: (patientId) => ipcRenderer.invoke('get-patient-registrations', patientId),
  getDoctorRegistrations: (doctorId, date) => ipcRenderer.invoke('get-doctor-registrations', doctorId, date)
});