// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import FileUpload from './components/FileUpload';
import VerifyUpload from './components/VerifyUpload';
import UserForm from './components/UserForm';
import Document from './components/Document';
import UpdateFile from './components/UpdateFile';

const App = () => {
    const token = localStorage.getItem('token');
    const userdata = JSON.parse(localStorage.getItem("userDataUser"));

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/fileupload" element={ token && userdata.roles !== 'ROLE_Verifier' ? <FileUpload /> : <Login />} />
          <Route path="/verifyupload" element={ token ? <VerifyUpload /> : <Login />} />
          <Route path="/userform" element={ token && userdata.roles === 'ROLE_Admin' ? <UserForm /> : <Login />} />
         <Route path="/document" element={ token ? <Document /> : <Login />} />
        <Route path="/updatefile" element={ token && userdata.roles === 'ROLE_Admin' ? <UpdateFile /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
