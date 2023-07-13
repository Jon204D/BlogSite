import React from 'react';
import './App.css';
//Repositories
import {BrowserRouter, Routes, Route} from 'react-router-dom';
//Credential Pages
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Logout from './Pages/Logout/Logout';
import Profile from './Pages/Profile/Profile';
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate';
import ProfileDelete from './Pages/ProfileDelete/ProfileDelete';
import ProfilePost from './Pages/ProfilePost/ProfilePost';
//Basic Pages
import Home from './Pages/Home/Home';
import PostUpload from './Pages/PostUpload/PostUpload';
import PostDetail from './Pages/PostDetail/PostDetail';
import PostUpdate from './Pages/PostUpdate/PostUpdate';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';

function App() {
  return (
    <>
      <div className='page_container'>
        <BrowserRouter>
          <Routes>
            <Route exact path='/Register' element={<Register/>} />;
            <Route exact path='/Login' element={<Login/>} />;
            <Route exact path='/Logout' element={<Logout/>} />;
            <Route exact path='/' element={<Home/>} />;
            <Route exact path='/:AccountUsername/Upload' element={<PostUpload/>} />;
            <Route exact path='/Post/:PostID' element={<PostDetail/>} />;
            <Route exact path='/:AccountUsername/Post/:PostID/Update' element={<PostUpdate/>} />;
            <Route exact path='/Profile/:AccountUsername' element={<Profile/>} />;
            <Route exact path='/Profile/:AccountUsername/Update' element={<ProfileUpdate/>} />;
            <Route exact path='/Profile/:AccountUsername/Delete' element={<ProfileDelete/>} />;
            <Route exact path='/Profile/:AccountUsername/Posts' element={<ProfilePost/>} />;
            <Route exact path='/AboutUS' element={<About/>} />;
            <Route exact path='/ContactUs' element={<Contact/>} />;
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
