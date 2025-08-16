import React, { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import {
  Box,
  Container
} from "@mui/material";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
const [docType, setDocType] = useState('');

const userdata = JSON.parse(localStorage.getItem("userDataUser"));
      const userId = userdata.id;

 const handleChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile && selectedFile.type === "application/pdf") {
    setFile(selectedFile);
    setMessage('');
  } else {
    setFile(null);
    setMessage("Please select a valid PDF file.");
  }
};

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("trackNumber", orderId);

    if(userdata.roles === 'ROLE_Warehouse'){
         formData.append("fileName", 'Warehouse');
    }
    else if(userdata.roles === 'ROLE_Packing'){
         formData.append("fileName", 'Packing');
    }
    else if(userdata.roles === 'ROLE_Transport'){
         formData.append("fileName", 'Bill of Lading');
    }
    else if(userdata.roles === 'ROLE_Delivery'){
         formData.append("fileName", 'Delivery Note');
    }
    else{
    formData.append("fileName", docType);
    }

    

    try {

         const token = localStorage.getItem('token');

         
      formData.append("userId", userId);

      const res = await axios.post("http://localhost:8081/document/uploadPdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization" : `${token}`
        }
      });
      setMessage(res.data);
      setFile(null);
      
    } catch (err) {
      setMessage("Upload failed: " + (err.response?.data || err.message));
    }
  };

  return (
   <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f7f9fc', pb: 4 }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
      <h2>File Upload</h2>
      <form onSubmit={handleUpload}>

   <div>
        <label>Order ID:</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
      </div>

{userdata.roles === 'ROLE_Admin' && (
      <div>
        <label>Document Type:</label>
        <select value={docType} onChange={(e) => setDocType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="Order">Order</option>
          <option value="Warehouse">Warehouse</option>
          <option value="Packing">Packing</option>
           <option value="Bill of Lading">Bill of Lading</option>
            <option value="Delivery Note">Delivery Note</option>
        </select>
      </div>
)}
       

        <input type="file" accept="application/pdf" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
      </Container>
    </Box>
  );
}

export default FileUpload;
