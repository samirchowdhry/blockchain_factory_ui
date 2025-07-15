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
  IconButton,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./Navbar";
import Box from '@mui/material/Box';

const UserForm = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [newUser, setNewUser] = useState({
    displayName: "",
    username: "",
    password: "",
    role: "",
  });

  // Fetch Data
  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8081/auth/admin/getAllUsers", {
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
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add User
  const handleAddUser = () => {
    const token = localStorage.getItem("token");
    const userToSend = {
      displayName: newUser.displayName,
      username: newUser.username,
      password: newUser.password,
      roles: newUser.role,
    };

    fetch("http://localhost:8081/auth/admin/addNewUser", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then(() => {
        fetchUsers();
        setNewUser({ displayName: "", username: "", password: "", role: "" });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  // Handle Delete
  const handleDelete = (userId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8081/auth/admin/deleteUser?userId=${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Cannot Delete User because it is in the system.");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchUsers();
      })
      .catch((error) =>
        console.error("Error deleting user or fetching users:", error)
      );
  };

  // Handle Search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);

    const filtered = users.filter((user) => {
      const name = user.displayName ? user.displayName.toLowerCase() : "";
      const email = user.username ? user.username.toLowerCase() : "";
      return name.includes(value) || email.includes(value);
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

  return (
    <div>
      <Navbar />
      <Paper sx={{ width: "80%", margin: "auto", mt: 3, p: 2 }}>
        <h2>Add New User</h2>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={newUser.displayName}
          onChange={(e) =>
            setNewUser({ ...newUser, displayName: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={newUser.username}
          onChange={(e) =>
            setNewUser({ ...newUser, username: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newUser.password}
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={newUser.role}
            label="Role"
            onChange={(e) =>
              setNewUser({ ...newUser, role: e.target.value })
            }
          >
            <MenuItem value="ROLE_Admin">Admin</MenuItem>
            <MenuItem value="ROLE_Warehouse">Warehouse</MenuItem>
            <MenuItem value="ROLE_Packing">Packing</MenuItem>
             <MenuItem value="ROLE_Transport">Transport</MenuItem>
              <MenuItem value="ROLE_Delivery">Delivery</MenuItem>
               <MenuItem value="ROLE_Verifier">Verifier</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </Paper>
      <Paper sx={{ width: "80%", margin: "auto", mt: 3, p: 2 }}>
        <TextField
          label="Search by Name or Email"
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.displayName || "N/A"}</TableCell>
                    <TableCell>{user.username || "N/A"}</TableCell>
                    <TableCell>
                      {Array.isArray(user.roles)
                        ? user.roles.join(", ")
                        : user.roles || "N/A"}
                    </TableCell>
                    <TableCell>*************</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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

export default UserForm;
