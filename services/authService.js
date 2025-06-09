const fs = require('fs');
const path = require('path');
const { Admin } = require('../database/database');

function checkAdminLogin(id, pwd) {
  const configPath = path.join(__dirname, '../config/admin.json');
  if (!fs.existsSync(configPath)) return false;
  const config = JSON.parse(fs.readFileSync(configPath));
  if (id === config.adminId && pwd === config.password) {
    Admin.upsert({ adminId: config.adminId, password: config.password });
    return true;
  }
  return false;
}

module.exports = { checkAdminLogin };