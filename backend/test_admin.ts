import axios from 'axios';

async function testAdmin() {
  const commonUsername = 'testcommon_' + Date.now();
  const adminUsername = 'testadmin_' + Date.now();
  const password = 'Password123';
  const commonCode = '9527';
  const adminCode = '230713';

  let commonToken = '';
  let adminToken = '';

  console.log('--- 1. 注册普通用户 ---');
  try {
    await axios.post('http://localhost:8009/user/register', {
      username: commonUsername,
      password,
      registerCode: commonCode
    });
    const loginRes = await axios.post('http://localhost:8009/user/login', {
      username: commonUsername,
      password
    });
    commonToken = loginRes.data.data.token;
    console.log('普通用户注册登录成功');
  } catch (err: any) {
    console.error('普通用户注册登录失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 2. 注册管理员用户 ---');
  try {
    await axios.post('http://localhost:8009/user/register', {
      username: adminUsername,
      password,
      registerCode: adminCode
    });
    const loginRes = await axios.post('http://localhost:8009/user/login', {
      username: adminUsername,
      password
    });
    adminToken = loginRes.data.data.token;
    console.log('管理员用户注册登录成功');
  } catch (err: any) {
    console.error('管理员用户注册登录失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 3. 普通用户获取设置 ---');
  try {
    const res = await axios.get('http://localhost:8009/setting/get', {
      headers: { Authorization: `Bearer ${commonToken}` }
    });
    const { globalSetting } = res.data.data;
    if (globalSetting !== null) {
      console.error('普通用户不应获取到全局设置！');
      process.exit(1);
    }
    console.log('普通用户获取设置测试通过，无法访问全局设置。');
  } catch (err: any) {
    console.error('普通用户获取设置失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 4. 管理员获取设置 ---');
  try {
    const res = await axios.get('http://localhost:8009/setting/get', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const { globalSetting } = res.data.data;
    if (globalSetting === null) {
      console.error('管理员用户应该获取到全局设置！');
      process.exit(1);
    }
    console.log('管理员获取设置测试通过，已获取全局设置:', globalSetting);
  } catch (err: any) {
    console.error('管理员获取设置失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 5. 管理员保存全局设置 ---');
  try {
    const getRes = await axios.get('http://localhost:8009/setting/get', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const { userSettings, globalSetting } = getRes.data.data;
    
    // 修改一个全局设置
    const originalPort = globalSetting.httpProxyPort;
    globalSetting.httpProxyPort = originalPort === 7890 ? 7891 : 7890;

    const saveRes = await axios.post('http://localhost:8009/setting/save', {
      userSettings,
      globalSetting
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    console.log('保存请求响应:', saveRes.data);

    // 再次获取验证是否修改成功
    const getRes2 = await axios.get('http://localhost:8009/setting/get', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const newGlobalSetting = getRes2.data.data.globalSetting;
    
    if (newGlobalSetting.httpProxyPort === globalSetting.httpProxyPort) {
      console.log('管理员保存全局设置测试通过，已更新为:', newGlobalSetting.httpProxyPort);
    } else {
      console.error('全局设置未被正确更新！');
      process.exit(1);
    }
    
    // 恢复原来的设置
    newGlobalSetting.httpProxyPort = originalPort;
    await axios.post('http://localhost:8009/setting/save', {
      userSettings,
      globalSetting: newGlobalSetting
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('全局设置已恢复初始状态。');

  } catch (err: any) {
    console.error('管理员保存全局设置失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n✅ 管理员后台管理与全局参数设置功能测试通过！');
}

testAdmin();
