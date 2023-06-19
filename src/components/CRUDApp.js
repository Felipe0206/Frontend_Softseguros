import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

const API_URL = 'https://delirious-cream-production.up.railway.app/api/Clientes/';

const CRUDApp = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    numero_documento: '',
    email: '',
    fecha_nacimiento: '',
    rol: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.log(error);
      setError('Error al obtener los datos');
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async () => {
    try {
      await axios.post(API_URL, formData);
      fetchData();
      setFormData({
        nombre_completo: '',
        numero_documento: '',
        email: '',
        fecha_nacimiento: '',
        rol: ''
      });
      setSnackbarMessage('Registro creado exitosamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
      setError('Error al crear el registro');
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setEditItemId(id);
    setFormData({
      nombre_completo: itemToEdit.nombre_completo,
      numero_documento: itemToEdit.numero_documento,
      email: itemToEdit.email,
      fecha_nacimiento: itemToEdit.fecha_nacimiento,
      rol: itemToEdit.rol
    });
    handleDialogOpen();
  };

  const handleUpdate = async () => {
    try {
      const updatedItem = {
        nombre_completo: formData.nombre_completo,
        numero_documento: formData.numero_documento,
        email: formData.email,
        fecha_nacimiento: formData.fecha_nacimiento,
        rol: formData.rol
      };
  
      await axios.put(`${API_URL}/${editItemId}/`, updatedItem);
  
      fetchData();
      setSnackbarMessage('Registro actualizado exitosamente');
      setSnackbarOpen(true);
      handleDialogClose(); // Cerrar el diálogo después de actualizar
  
    } catch (error) {
      console.log(error);
      setError('Error al actualizar el registro');
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchData();
      setSnackbarMessage('Registro eliminado exitosamente');
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
      setError('Error al eliminar el registro');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setEditItemId(null);
    setOpenDialog(false);
    setFormData({
      nombre_completo: '',
      numero_documento: '',
      email: '',
      fecha_nacimiento: '',
      rol: ''
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredData = data.filter((item) => {
    const nombre_completo = item.nombre_completo || '';
    const email = item.email || '';

    return (
      nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container maxWidth="md" style={{ padding: '24px' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        CRUD Softseguros
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <TextField
          label="Buscar"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: <Search />,
          }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleDialogOpen}
        >
          Crear Usuario
        </Button>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: 'black' }}>
            <TableCell style={{ color: 'white' }}>Nombre completo</TableCell>
            <TableCell style={{ color: 'white' }}>Número de documento</TableCell>
            <TableCell style={{ color: 'white' }}>Email</TableCell>
            <TableCell style={{ color: 'white' }}>Fecha de nacimiento</TableCell>
            <TableCell style={{ color: 'white' }}>Rol</TableCell>
            <TableCell style={{ color: 'white' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre_completo}</TableCell>
              <TableCell>{item.numero_documento}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.fecha_nacimiento}</TableCell>
              <TableCell>{item.rol}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(item.id)} style={{ color: ' rgb(25 118 210)' }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editItemId ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre completo"
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Número de documento"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fecha de nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            select
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            <option value="cliente">Cliente</option>
            <option value="administrador">Administrador</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={editItemId ? handleUpdate : handleCreate} color="primary">
            {editItemId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity="success" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CRUDApp;
