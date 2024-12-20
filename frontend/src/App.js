
import './App.css';
import ForgetPassword from './components/forgetpassword/forgetpassword';
import Login from './components/login/login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ResetPassword from './components/resetpassword/resetpassword';
import ConfirmPassword from './components/confirmpassword/confirmpassword';
import Register from './components/register/register';
import ProfilePage from './components/profilepage/profile';
import Admin from './components/admin/admin';
import Subscription from './components/subscription/subscription';
import User from './components/user/user';
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login/' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/confirmpassword' element={<ConfirmPassword />} />
          <Route path='/subscription' element={<Subscription />} />
          <Route path='/user' element = {<User/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
