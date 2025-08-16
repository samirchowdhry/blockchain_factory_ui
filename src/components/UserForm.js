import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
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

const UserForm = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

//   return (
//     <div>
//       <Navbar />

// <Paper sx={{ width: '95%', maxWidth: '1200px', margin: 'auto', mt: 3, p: 2 }}>
//   <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Add New User</h2>
//   <form
//     onSubmit={(e) => {
//       e.preventDefault();
//       handleAddUser();
//     }}
//   >
//     {/* First Row: Input Fields */}
//     <Box
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: 2,
//         justifyContent: 'center',
//         mb: 2,
//       }}
//     >
//       <TextField
//         label="Name"
//         variant="outlined"
//         size="small"
//         value={newUser.displayName}
//         onChange={(e) =>
//           setNewUser({ ...newUser, displayName: e.target.value })
//         }
//       />
//       <TextField
//         label="Email"
//         variant="outlined"
//         size="small"
//         value={newUser.username}
//         onChange={(e) =>
//           setNewUser({ ...newUser, username: e.target.value })
//         }
//       />
//       <TextField
//         label="Password"
//         type="password"
//         variant="outlined"
//         size="small"
//         value={newUser.password}
//         onChange={(e) =>
//           setNewUser({ ...newUser, password: e.target.value })
//         }
//       />
//       <FormControl size="small" sx={{ minWidth: 150 }}>
//         <InputLabel id="role-label">Role</InputLabel>
//         <Select
//           labelId="role-label"
//           value={newUser.role}
//           label="Role"
//           onChange={(e) =>
//             setNewUser({ ...newUser, role: e.target.value })
//           }
//         >
//           <MenuItem value="ROLE_Admin">Admin</MenuItem>
//           <MenuItem value="ROLE_Warehouse">Warehouse</MenuItem>
//           <MenuItem value="ROLE_Packing">Packing</MenuItem>
//           <MenuItem value="ROLE_Transport">Transport</MenuItem>
//           <MenuItem value="ROLE_Delivery">Delivery</MenuItem>
//           <MenuItem value="ROLE_Verifier">Verifier</MenuItem>
//         </Select>
//       </FormControl>
//     </Box>

//     {/* Second Row: Submit Button */}
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//       }}
//     >
//       <Button
//         variant="contained"
//         color="primary"
//         type="submit"
//         sx={{ width: 200, height: 40 }}
//       >
//         Add User
//       </Button>

// <Button
// variant="contained"
//         color="primary"
//     sx={{ width: 150, height: 40, marginLeft: 2, color: 'white' }}
//     onClick={() =>
//       setNewUser({
//         displayName: '',
//         username: '',
//         password: '',
//         role: '',
//       })
//     }
//   >
//     Cancel
//   </Button>

//     </Box>
//   </form>
// </Paper>


//       <Paper sx={{ width: "95%", maxWidth: "1000px", margin: "auto", mt: 3, p: 2 }}>
//         <TextField
//           label="Search by Name or Email"
//           variant="outlined"
//           fullWidth
//           value={search}
//           onChange={handleSearch}
//           sx={{ mb: 2 }}
//         />
      
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Password</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredUsers
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell sx={{ py: 0.5 }}>{user.id}</TableCell>
//                     <TableCell sx={{ py: 0.5 }}>{user.displayName || "N/A"}</TableCell>
//                     <TableCell sx={{ py: 0.5 }}>{user.username || "N/A"}</TableCell>
//                     <TableCell sx={{ py: 0.5 }}>
//                       {Array.isArray(user.roles)
//                         ? user.roles.join(", ")
//                         : user.roles || "N/A"}
//                     </TableCell>
//                     <TableCell sx={{ py: 0.5 }}>*************</TableCell>
//                     <TableCell sx={{ py: 0.5 }}>
//                       <IconButton
//                         onClick={() => handleDelete(user.id)}
//                         color="error"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
       
//         <TablePagination
//           component="div"
//           count={filteredUsers.length}
//           page={page}
//           rowsPerPage={rowsPerPage}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </div>
//   );

return (
  <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f7f9fc', pb: 4 }}>
    <Navbar />

    <Container maxWidth="xl" sx={{ mt: 3 }}>
      {/* Add New User Form */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Add New User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
        >
          {/* First Row: Fields */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              mb: 2,
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              value={newUser.displayName}
              onChange={(e) =>
                setNewUser({ ...newUser, displayName: e.target.value })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              size="small"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
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
          </Box>

          {/* Button Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button variant="contained" type="submit" sx={{ width: 150, height: 40 }}>
              Add User
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: 150, height: 40 }}
              onClick={() =>
                setNewUser({
                  displayName: "",
                  username: "",
                  password: "",
                  role: "",
                })
              }
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>

      {/* User Table */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ height: "40px" }}>
                <TableCell sx={{ py: 0.5 }}>ID</TableCell>
                <TableCell sx={{ py: 0.5 }}>Name</TableCell>
                <TableCell sx={{ py: 0.5 }}>Email</TableCell>
                <TableCell sx={{ py: 0.5 }}>Role</TableCell>
                <TableCell sx={{ py: 0.5 }}>Password</TableCell>
                <TableCell sx={{ py: 0.5 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} sx={{ height: "40px" }}>
                    <TableCell sx={{ py: 0.5 }}>{user.id}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{user.displayName || "N/A"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{user.username || "N/A"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {Array.isArray(user.roles)
                        ? user.roles.join(", ")
                        : user.roles || "N/A"}
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>*************</TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <IconButton style={{marginLeft : "-48px"}}
                        onClick={() => handleDelete(user.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
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
    </Container>
  </Box>
);


};

export default UserForm;
