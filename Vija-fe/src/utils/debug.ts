// Debug utility để kiểm tra kết nối API

export const debugAPI = () => {
  console.log('=== DEBUG API ===');
  console.log('API URL:', import.meta.env.VITE_API_URL);
  console.log('Token:', localStorage.getItem('token'));
  console.log('User:', localStorage.getItem('user'));
  console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));
  console.log('================');
};

export const testAPIConnection = async () => {
  try {
    const response = await fetch('http://localhost:3000');
    const data = await response.json();
    console.log('✅ Backend đang chạy:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend không chạy:', error);
    return false;
  }
};
