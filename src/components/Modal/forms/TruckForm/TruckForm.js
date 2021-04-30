import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import axios from '../../../../axios';
import * as Yup from 'yup';
import CustomTextInput from '../../../common/Input/Input';
import './TruckForm.css';

const TruckForm = ({ option, modalClose, setOperationResponse, editEntity, show }) => {
  const [error, setError] = useState(null);
  const [radio, setRadio] = useState('1')
  const [entity, setEntity] = useState(null);
  const [fetched, setFeched] = useState(false);

  useEffect(() => {
    editEntity && !fetched &&  getEntityById();
    return () => {
      setFeched(false);
      entity && setEntity(null);
    }
  }, [editEntity, entity, show]);

  async function getEntityById() {
    const reponse = await axios.get(`${option}/${editEntity}`);
    setFeched(true);
    setEntity(reponse.data);
    setRadio(reponse.data.tipo_combustible.toString());
  }

  async function submitHandler (values, setSubmitting, resetForm) {
    let entity = { ...values }
    entity = { ...entity, tipo_combustible: radio}
    let response;
    try {
      if (editEntity) {
        response = await axios.put(`${option}/${editEntity}`, entity);
      } else {
        response = await axios.post(option, entity);
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

  return (
    <Formik
      enableReinitialize
      initialValues={{
        placa: entity ? entity.placa : '',
        capacidad: entity ? entity.capacidad : '',
        capacidad_actual: entity ? entity.capacidad_actual : '',
        consumo: entity ? entity.consumo : '',
        marca: entity ? entity.marca : '',
        modelo: entity ? entity.modelo : '',
      }}
      validationSchema={Yup.object({
        placa: Yup.string()
        .required('Este campo es obligatorio'),
        capacidad: Yup.string()
        .required('Este campo es obligatorio'),
        consumo: Yup.string()
        .required('Este campo es obligatorio'),
        marca: Yup.string()
        .required('Este campo es obligatorio'),
        modelo: Yup.string()
        .required('Este campo es obligatorio'),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitHandler(values, setSubmitting, resetForm);
      }}
    >
      {props => (
        <Form className="modalForm">
          <div style={{marginLeft: "-25px" }} >
            <CustomTextInput name="placa" type="text" placeholder="Placa" />
            { error && error.placa && (
              <div className="error mt-3">{error.placa}</div>
            )}
          </div>
          <div className="flex-input">
            <CustomTextInput name="capacidad" type="number" placeholder="Capacidad" /><span>m<sup>3</sup></span> 
            <CustomTextInput name="consumo" type="number" placeholder="Consumo" /> <span>Galones</span> 
          </div>
          <div className="flex-input">
            <CustomTextInput disable="true" name="capacidad_actual" type="number" placeholder="0" /><span>m<sup>3</sup></span> 
          </div>
          <div className="flex-input">
            <div className="button-stack">
              <div>
                <input 
                  type="radio" 
                  name="radio"
                  value="1"
                  checked={radio === "1"} 
                  onChange={(e) => setRadio(e.target.value)} /> Gasolina 98
              </div>
              <div>
                <input 
                  type="radio" 
                  name="radio"
                  value="2"
                  checked={radio === "2"} 
                  onChange={(e) => setRadio(e.target.value)} /> Petróleo
              </div>
              <div>
                <input 
                  type="radio" 
                  name="radio"
                  value="3"
                  checked={radio === "3"} 
                  onChange={(e) => setRadio(e.target.value)} /> Diesel 82
              </div>
            </div>
            <div className="flex-input col">
              <CustomTextInput name="marca" type="text" placeholder="Marca" />
              <CustomTextInput name="modelo" type="text" placeholder="Modelo" />
            </div>
          </div>
          {/* { error && (
            <div className="error mt-3">{error}</div>
          )} */}
          <div className="modalFooter">
            <button type="submit"> {props.isSubmitting ? 'Creando...' : 'Confimar'} </button>
            <button type="button" onClick={modalClose}> Cancelar</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default TruckForm;