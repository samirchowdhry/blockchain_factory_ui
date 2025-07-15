import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";
import Navbar from "./Navbar";


const Document = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  // Fetch Data
  const fetchUsers = () => {

    const userdata = JSON.parse(localStorage.getItem("userDataUser"));

    const token = localStorage.getItem("token");

    if(userdata.roles === 'ROLE_Admin'){
    fetch("http://localhost:8081/document/getDocument", {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
    }
    else{

        var orderstatus = '';

        if(userdata.roles === 'ROLE_Warehouse'){
          orderstatus = 'Warehouse';
        }
        else if(userdata.roles === 'ROLE_Packing'){
            orderstatus = 'Packing';
        }
        else if(userdata.roles === 'ROLE_Transport'){
            orderstatus = 'Bill of Lading';
        }
        else if(userdata.roles === 'ROLE_Delivery'){
            orderstatus = 'Delivery Note';
        }
        
        fetch(`http://localhost:8081/document/getDocumentByStatus?status=${orderstatus}&&userId=${userdata.id}`, {
  headers: {
    Authorization: `${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    setUsers(data);
    setFilteredUsers(data);
  })
  .catch((error) => console.error("Error fetching users:", error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = users.filter((user) => {
      const track = user.trackNumber ? String(user.trackNumber).toLowerCase() : "";
      const status = user.orderStatus ? user.orderStatus.toLowerCase() : "";
      return track.includes(value) || status.includes(value);
    });

    setFilteredUsers(filtered);
  };

  // Handle Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${dd}-${MM}-${yyyy} ${hh}:${mm}:${ss}`;
};

  return (
    <div>
      <Navbar />
      <Paper sx={{ width: "100%", margin: "auto", mt: 3, p: 2 }}>
        <TextField
          label="Search by Order Number or Status"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Order Number</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Update Date</TableCell>
                <TableCell>Upload By</TableCell>
                <TableCell>Verify By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow>
                    <TableCell>{user.orderStatus || "N/A"}</TableCell>
                    <TableCell>{user.trackNumber || "N/A"}</TableCell>
                <TableCell>{user.createdAt ? formatDate(user.createdAt) : "N/A"}</TableCell>
                <TableCell>{user.updatedAt ? formatDate(user.updatedAt) : "N/A"}</TableCell>
                <TableCell>{user.uploadedBy || "N/A"}</TableCell>
                <TableCell>{user.verifyBy || "N/A"}</TableCell>
                  
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default Document;
