import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import axios from '../../../../axios';
import * as Yup from 'yup';
import CustomTextInput from '../../../common/Input/Input';
import CustomSelect from '../../../common/Select/Select';
import './UserForm.css';
import Trucks from './../../../../pages/Dashboard/Trucks/Trucks';

const UserForm = ({ option, modalClose, setOperationResponse, editEntity, show }) => {
  const [error, setError] = useState(null);
  const [entity, setEntity] = useState(null);
  const [fetched, setFeched] = useState(false);
  const [roles, setRoles] = useState(null);
  const [trucks, setTrucks] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchTrucks(editEntity);
    return () => {
      setFeched(false);
      entity && setEntity(null);
    }
  }, [editEntity, entity, show]);

  async function fetchRoles() {
    try {
      const response = await axios.get('roles/all');
      setRoles(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function fetchTrucks(editEntity) {
    try {
      const response = await axios.get('trucks/all', {
        params: {
          available: true
        }
      });
      setTrucks(response.data);
      editEntity && !fetched &&  getEntityById();
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function getEntityById() {
    try {
      const reponse = await axios.get(`${option}/${editEntity}`);
      setFeched(true);
      setEntity(reponse.data);
      setTimeout(() => {
        setTrucks(trucks => [...trucks, { placa: reponse.data.camion_id}]);
      }, 100)

    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function submitHandler (values, setSubmitting, resetForm) {
    const rol_id = values.rol_id == 'Fiscalizador'? values.rol_id = 1 : values.rol_id = 2;
    const camion_id = trucks.find(truck => truck.placa === values.camion_id).id;
    let entity = { ...values, rol_id, camion_id: camion_id }
    let response;
    try {
      if (editEntity) {
        response = await axios.put(`${option}/${editEntity}`, entity);
      } else {
        response = await axios.post(`${option}/register`, entity);
      }

      console.log(response);
      resetForm();
      setSubmitting(false);
      setError(null);
      setOperationResponse(response);
      modalClose();
    } catch (err) {
      setSubmitting(false);
      setError(err.response.data);
      console.log(err.response.data);
    }
  }

  console.log(trucks);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        nombre_usuario: entity ? entity.nombre_usuario ? entity.nombre_usuario : '' : '',
        nombre: entity ? entity.nombre ? entity.nombre : '':  '',
        apellido: entity ? entity.apellido ? entity.apellido : '' : '',
        dni: entity ? entity.dni ? entity.dni : '' : '',
        fecha_nacimiento: entity ? ( entity.fecha_nacimiento ? entity.fecha_nacimiento.substr(0, 10) : '' ) : '',
        licencia_de_conducir: entity ? entity.licencia_de_conducir ? entity.licencia_de_conducir : '' : '',
        contrasena: '',
        rol_id: entity ? entity.rol_id === 1 ? 'Fiscalizador' : 'Conductor' : '',
        camion_id: entity ? entity.camion_id  : ''
      }}
      validationSchema={Yup.object({
        nombre_usuario: Yup.string()
        .required('Este campo es obligatorio'),
        nombre: Yup.string()
        .required('Este campo es obligatorio'),
        apellido: Yup.string()
        .required('Este campo es obligatorio'),
        dni: Yup.string()
        .min(8, 'El dni debe contener 8 números')
        .max(8, 'El dni debe contener 8 números')
        .required('Este campo es obligatorio'),
        fecha_nacimiento: Yup.string()
        .required('Este campo es obligatorio'),
        rol_id: Yup.string()
        .oneOf(roles ? roles.map(rol => rol.nombre) : [], 'Debe seleccionar un rol'),
        camion_id: Yup.string()
        .oneOf(trucks ? trucks.map(truck => truck.placa) : [], 'Debe seleccionar un camión')
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitHandler(values, setSubmitting, resetForm);
      }}
    >
      {props => (
        <Form className="modalForm">
          <div style={{marginLeft: "-25px" }} >
            <CustomTextInput name="nombre_usuario" type="text" placeholder="Nombre de usuario" />
            <CustomTextInput name="nombre" type="text" placeholder="Nombres" />
            <CustomTextInput name="apellido" type="text" placeholder="Apellidos" />
          </div>
          <div className="flex-input">
            <CustomTextInput name="dni" type="number" placeholder="DNI" />
            <CustomTextInput name="fecha_nacimiento" type="date" /> <span>Fecha de nacimiento</span>
          </div>
          <div style={{marginLeft: "-25px" }} >
            <div style={{marginLeft: "30px"}}>
              <CustomSelect label="camion_id" name="camion_id">
                <option value="">Seleccionar camión</option>
                {trucks && (
                  trucks.map(truck => {
                    return <option key={truck.placa} value={truck.placa}>{truck.placa}</option>
                  })
                )}
              </CustomSelect>
            </div>
            <CustomTextInput name="licencia_de_conducir" type="text" placeholder="Licencia de conducir" />
            {error && error.licencia_de_conducir && (
                  <div className="error mt-3">{error.licencia_de_conducir}</div>
                )}
            <div style={{marginLeft: "30px"}}>
              <CustomSelect label="rol_id" name="rol_id">
                <option value="">Seleccionar rol</option>
                {roles && (
                  roles.map(rol => {
                    return <option key={rol.nombre} value={rol.nombre}>{rol.nombre}</option>
                  })
                )}
              </CustomSelect>
              { error && error.rol_id && (
                <div className="error mt-3">{error.rol_id}</div>
              )}
            </div>
            <CustomTextInput name="contrasena" type="password" placeholder="Contraseña" />
            {error && error.contrasena && (
              <div className="error mt-3">{error.contrasena}</div>
            )}
          </div>
          <div className="modalFooter">
            <button type="submit"> {props.isSubmitting ? 'Creando...' : 'Confimar'} </button>
            <button type="button" onClick={modalClose}> Cancelar</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UserForm;