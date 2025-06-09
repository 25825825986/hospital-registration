const fs = require('fs');
const path = require('path');
const { Admin } = require('../database/database');

async function checkAdminLogin(adminId, password) {
  try {
    console.log('验证管理员登录:', adminId);
    const configPath = path.join(__dirname, '../config/admin.json');
    
    // 检查配置文件是否存在
    if (!fs.existsSync(configPath)) {
      console.error('管理员配置文件不存在');
      return false;
    }
    
    // 读取配置文件
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('读取管理员配置');
    
    // 验证账号密码
    if (adminId === config.adminId && password === config.password) {
      // 同步到数据库
      await Admin.upsert({
        adminId: config.adminId,
        password: config.password
      });
      console.log('登录验证成功');
      return true;
    }
    
    console.log('登录验证失败');
    return false;
  } catch (error) {
    console.error('验证管理员登录失败:', error);
    throw error;
  }
}

async function changeAdminPassword(adminId, oldPassword, newPassword) {
  try {
    console.log('修改管理员密码:', adminId);
    const configPath = path.join(__dirname, '../config/admin.json');
    
    // 检查配置文件是否存在
    if (!fs.existsSync(configPath)) {
      throw new Error('管理员配置文件不存在');
    }
    
    // 读取配置文件
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 验证原密码
    if (adminId !== config.adminId || oldPassword !== config.password) {
      throw new Error('原密码错误');
    }
    
    // 更新配置文件
    config.password = newPassword;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('密码修改成功');
    
    // 同步到数据库
    await Admin.upsert({
      adminId: config.adminId,
      password: newPassword
    });
    
    return true;
  } catch (error) {
    console.error('修改管理员密码失败:', error);
    throw error;
  }
}

module.exports = { checkAdminLogin, changeAdminPassword };