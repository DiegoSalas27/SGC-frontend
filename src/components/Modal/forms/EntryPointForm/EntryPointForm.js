import { useState } from "react";
import { Formik, Form } from "formik";
import axios from "../../../../axios";
import * as Yup from "yup";
import CustomTextInput from "../../../common/Input/Input";
import { useEffect } from "react";

const EntryPointForm = ({ modalClose, show, setOperation }) => {
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    !entity && fetchEntryPoints();
    console.log(entity);
  }, [entity, show]);

  async function fetchEntryPoints() {
    const reponse = await axios.get(`/trucks/getEntryPoints`);
    setEntity(reponse.data);
  }

  async function submitHandler(values, setSubmitting, resetForm) {
    let response;
    try {
      response = await axios.post("/trucks/editEntryPoints", values);

      console.log(response);
      resetForm();
      setSubmitting(false);
      setEntity(null);
      modalClose();
    } catch (err) {
      setSubmitting(false);
      setEntity(null);
      console.log(err.response.data);
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        lat: entity ? entity.lat : "",
        lng: entity ? entity.lng : "",
      }}
      validationSchema={Yup.object({
        lat: Yup.string().required("Este campo es obligatorio"),
        lng: Yup.string().required("Este campo es obligatorio"),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        submitHandler(values, setSubmitting, resetForm);
      }}
    >
      {(props) => (
        <Form className="modalForm">
          <div className="flex-input">
            <CustomTextInput name="lat" type="number" placeholder="Longitud" />
            <CustomTextInput name="lng" type="number" placeholder="Latitud" />
          </div>
          <div className="modalFooter">
            <button type="submit">
              {props.isSubmitting ? "Creando..." : "Confimar"}
            </button>
            <button type="button" onClick={modalClose}>
              Cancelar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EntryPointForm;
