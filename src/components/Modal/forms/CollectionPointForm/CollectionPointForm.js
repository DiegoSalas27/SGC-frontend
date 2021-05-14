import { useState } from "react";
import { Formik, Form } from "formik";
import axios from "../../../../axios";
import * as Yup from "yup";
import CustomTextInput from "../../../common/Input/Input";
import { useEffect } from "react";

const CollectionForm = ({
  option,
  modalClose,
  setOperationResponse,
  editEntity,
  show,
}) => {
  const [error, setError] = useState(null);
  const [radio, setRadio] = useState("1");
  const [entity, setEntity] = useState(null);
  const [fetched, setFeched] = useState(false);

  useEffect(() => {
    editEntity && !fetched && getEntityById();
    return () => {
      setFeched(false);
      entity && setEntity(null);
    };
  }, [editEntity, entity, show]);

  async function getEntityById() {
    const reponse = await axios.get(`${option}/${editEntity}`);
    setFeched(true);
    setEntity(reponse.data);
    setRadio(reponse.data.tipo_punto.toString());
  }

  async function submitHandler(values, setSubmitting, resetForm) {
    let entity = { ...values };
    entity = { ...entity, typePoint: 3 };
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
      modalClose("Punto de acopio creado correctamente");
    } catch (err) {
      setSubmitting(false);
      setError(err.response.data.error);
      console.log(err.response.data);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: entity ? entity.nombre : "",
        longitude: entity ? entity.longitud : "",
        latitude: entity ? entity.latitud : "",
        capacidad: entity ? entity.capacidad : "",
        capacidad_actual: entity ? entity.capacidad_actual : "",
        area: entity ? (entity.area ? entity.area : "") : "",
        altura: entity ? (entity.altura ? entity.altura : "") : "",
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Este campo es obligatorio")
          .max(
            40,
            "El nombre de punto de acopio debe contener como máximo 40 caracteres"
          ),
        longitude: Yup.string().required("Este campo es obligatorio"),
        latitude: Yup.string().required("Este campo es obligatorio"),
        area: Yup.string().required("Este campo es obligatorio"),
        altura: Yup.string().required("Este campo es obligatorio"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitHandler(values, setSubmitting, resetForm);
      }}
    >
      {(props) => (
        <Form className="modalForm">
          <CustomTextInput name="name" type="text" placeholder="Nombres" />
          <div className="flex-input">
            <CustomTextInput
              name="longitude"
              type="number"
              placeholder="Longitud"
            />
            <CustomTextInput
              name="latitude"
              type="number"
              placeholder="Latitud"
            />
          </div>
          <div className="flex-input">
            <CustomTextInput
              disabled={true}
              name="capacidad"
              type="number"
              placeholder="Capacidad"
            />
            <span>
              m<sup>3</sup>
            </span>
            <CustomTextInput
              disabled={true}
              name="capacidad_actual"
              type="number"
              placeholder="0"
            />
            <span>
              m<sup>3</sup>
            </span>
          </div>
          <div className="flex-input">
            <CustomTextInput name="altura" type="number" placeholder="Altura" />
            <span>m</span>
            <CustomTextInput name="area" type="number" placeholder="Área" />
            <span>
              m<sup>2</sup>
            </span>
          </div>
          {/* <div className="button-stack">
            <div>
              <input
                type="radio"
                name="radio"
                value="1"
                checked={radio === "1"}
                onChange={(e) => setRadio(e.target.value)}
              />{" "}
              Inicio
            </div>
            <div>
              <input
                type="radio"
                name="radio"
                value="2"
                checked={radio === "2"}
                onChange={(e) => setRadio(e.target.value)}
              />{" "}
              Llegada
            </div>
            <div>
              <input
                type="radio"
                name="radio"
                value="3"
                checked={radio === "3"}
                onChange={(e) => setRadio(e.target.value)}
              />{" "}
              Acopio
            </div>
          </div> */}
          {error && <div className="error mt-3">{error}</div>}
          <div className="modalFooter">
            <button type="submit">
              {" "}
              {props.isSubmitting ? "Creando..." : "Confimar"}{" "}
            </button>
            <button type="button" onClick={modalClose}>
              {" "}
              Cancelar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CollectionForm;
