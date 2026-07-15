import axios from 'axios';

async function testAuth() {
  const testUsername = 'testuser_' + Date.now();
  const testPassword = 'Password123';
  const registerCode = '9527';

  console.log('--- 测试注册 ---');
  try {
    const regRes = await axios.post('http://localhost:8009/user/register', {
      username: testUsername,
      password: testPassword,
      registerCode
    });
    console.log('注册成功:', regRes.data);
  } catch (err: any) {
    console.error('注册失败:', err.response?.data || err.message);
    process.exit(1);
  }

  console.log('\n--- 测试登录 ---');
  try {
    const loginRes = await axios.post('http://localhost:8009/user/login', {
      username: testUsername,
      password: testPassword
    });
    console.log('登录成功:', loginRes.data);
  } catch (err: any) {
    console.error('登录失败:', err.response?.data || err.message);
    process.exit(1);
  }
  
  console.log('\n✅ 注册与登录功能测试通过！');
}

testAuth();
