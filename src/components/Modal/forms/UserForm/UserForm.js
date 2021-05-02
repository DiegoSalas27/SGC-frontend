import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import axios from "../../../../axios";
import * as Yup from "yup";
import CustomTextInput from "../../../common/Input/Input";
import CustomSelect from "../../../common/Select/Select";
import "./UserForm.css";
import Trucks from "./../../../../pages/Dashboard/Trucks/Trucks";
import { date } from "yup/lib/locale";
import MessageModal from "../../MessageModal";

const UserForm = ({
  option,
  modalClose,
  setOperationResponse,
  editEntity,
  show,
}) => {
  const [error, setError] = useState(null);
  const [entity, setEntity] = useState(null);
  const [fetched, setFeched] = useState(false);
  const [roles, setRoles] = useState("");
  const [trucks, setTrucks] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState(null);
  const [showDropdownAndLicense, setShowDropdownAndLicense] = useState(false);
  const [rolValue, setRolValue] = useState("");
  const [camionValue, setCamionValue] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchTrucks(editEntity);
    return () => {
      setFeched(false);
      entity && setEntity(null);
    };
  }, [editEntity, entity, show]);

  async function fetchRoles() {
    try {
      const response = await axios.get("roles/all");
      setRoles(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function fetchTrucks(editEntity) {
    try {
      const response = await axios.get("trucks/all", {
        params: {
          available: true,
        },
      });
      setTrucks(response.data);
      editEntity && !fetched && getEntityById();
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function getEntityById() {
    setLicenseNumber(null);
    setRolValue("");
    setCamionValue("");
    try {
      const response = await axios.get(`${option}/${editEntity}`);
      setFeched(true);
      if (response.data.rol_id === 1) {
        setShowDropdownAndLicense(false);
        setRolValue("Fiscalizador");
        setCamionValue("");
      } else {
        setShowDropdownAndLicense(true);
        setRolValue("Conductor");
        setCamionValue(response.data.camion_id);
      }
      setEntity(response.data);
      setLicenseNumber(response.data.licencia_de_conducir);
      setTimeout(() => {
        setTrucks((trucks) => [...trucks, { placa: response.data.camion_id }]);
      }, 500);
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  async function submitHandler(values, setSubmitting, resetForm) {
    debugger;
    const rol_id =
      rolValue == "Fiscalizador"
        ? (values.rol_id = 1)
        : rolValue == "Conductor"
        ? (values.rol_id = 2)
        : (values.rol_id = null);
    let entity;
    if (rol_id === 2) {
      if (camionValue !== "") {
        const camion_id = trucks.find((truck) => truck.placa === camionValue)
          .id;
        entity = {
          ...values,
          rol_id,
          camion_id,
          licencia_de_conducir: licenseNumber && licenseNumber.toString(),
        };
      } else {
        setSubmitting(false);
        setError({ camion_id: "Debe seleccionar un camión" });
        return;
      }
    } else if (rol_id === 1) {
      entity = {
        ...values,
        rol_id,
        camion_id: null,
        licencia_de_conducir: null,
      };
    } else {
      setSubmitting(false);
      setError({ rol_id: "Debe seleccionar un rol" });
      return;
    }

    let response;
    try {
      if (editEntity) {
        response = await axios.put(`${option}/${editEntity}`, entity);
      } else {
        response = await axios.post(`${option}/register`, entity);
      }

      console.log(response);
      resetForm();
      setRolValue("");
      setLicenseNumber(null);
      setSubmitting(false);
      setError(null);
      setOperationResponse(response);
      modalClose("Usuario creado correctamente");
    } catch (err) {
      setSubmitting(false);
      setError(err.response.data);
      console.log(err.response.data);
    }
  }

  console.log(trucks);

  function onlyNumber(e) {
    setLicenseNumber(e.target.value.replace(/[^0-9]/g, ""));
  }

  function handleDropdownChange(e, typeDropDown) {
    if (typeDropDown === "rol_id") {
      if (e.target.value === "Fiscalizador") {
        setShowDropdownAndLicense(false);
      } else {
        setShowDropdownAndLicense(true);
      }
      setRolValue(e.target.value);
    } else {
      if (e.target.value !== "")
        error && error.camion_id && delete error.camion_id;
      setCamionValue(e.target.value);
    }
  }

  console.log(entity);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          nombre_usuario: entity
            ? entity.nombre_usuario
              ? entity.nombre_usuario
              : ""
            : "",
          nombre: entity ? (entity.nombre ? entity.nombre : "") : "",
          apellido: entity ? (entity.apellido ? entity.apellido : "") : "",
          dni: entity ? (entity.dni ? entity.dni : "") : "",
          fecha_nacimiento: entity
            ? entity.fecha_nacimiento
              ? entity.fecha_nacimiento.substr(0, 10)
              : ""
            : "",
          contrasena: "",
          rol_id: entity
            ? entity.rol_id === 1
              ? "Fiscalizador"
              : "Conductor"
            : "",
          camion_id: entity ? entity.camion_id : "",
        }}
        validationSchema={Yup.object({
          nombre_usuario: Yup.string().required("Este campo es obligatorio"),
          nombre: Yup.string()
            .max(
              40,
              "El nombre no puede contener más de 40 caracteres de texto"
            )
            .matches(/^[A-Za-z]+$/, "El nombre solo puede contener caracteres")
            .required("Este campo es obligatorio"),
          apellido: Yup.string()
            .max(
              40,
              "El nombre no puede contener más de 40 caracteres de texto"
            )
            .matches(
              /^[A-Za-z ]+$/,
              "Los apellidos solo pueden contener caracteres"
            )
            .required("Este campo es obligatorio"),
          dni: Yup.string()
            .min(8, "El dni debe contener 8 números")
            .max(8, "El dni debe contener 8 números")
            .required("Este campo es obligatorio"),
          fecha_nacimiento: Yup.date()
            .min(
              new Date("01-01-2002"),
              "La fecha de nacimiento debe ser mayor a 2002"
            )
            .required("Este campo es obligatorio"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          submitHandler(values, setSubmitting, resetForm);
        }}
      >
        {(props) => (
          <Form className="modalForm">
            <div style={{ marginLeft: "-25px" }}>
              <CustomTextInput
                name="nombre_usuario"
                type="text"
                placeholder="Nombre de usuario"
              />
              <CustomTextInput
                name="nombre"
                type="text"
                placeholder="Nombres"
              />
              <CustomTextInput
                name="apellido"
                type="text"
                placeholder="Apellidos"
              />
            </div>
            <div className="flex-input">
              <CustomTextInput name="dni" type="number" placeholder="DNI" />
              <CustomTextInput name="fecha_nacimiento" type="date" />{" "}
              <span>Fecha de nacimiento</span>
            </div>
            <div style={{ marginLeft: "-25px" }}>
              {showDropdownAndLicense && (
                <>
                  <div style={{ marginLeft: "30px" }}>
                    <CustomSelect
                      onChange={(e) => handleDropdownChange(e, "camion_id")}
                      label="camion_id"
                      name="camion_id"
                      value={camionValue}
                    >
                      <option value="">Seleccionar camión</option>
                      {trucks &&
                        trucks.map((truck) => {
                          return (
                            <option key={truck.placa} value={truck.placa}>
                              {truck.placa}
                            </option>
                          );
                        })}
                    </CustomSelect>
                    {error && error.camion_id && (
                      <div className="error mt-3">{error.camion_id}</div>
                    )}
                  </div>
                  <input
                    name="licencia_de_conducir"
                    placeholder="Licencia de conducir"
                    type="tel"
                    onChange={onlyNumber}
                    value={licenseNumber}
                    maxLength="9"
                  />
                  {error && error.licencia_de_conducir && (
                    <div className="error mt-3">
                      {error.licencia_de_conducir}
                    </div>
                  )}
                </>
              )}
              <div style={{ marginLeft: "30px" }}>
                <CustomSelect
                  onChange={(e) => handleDropdownChange(e, "rol_id")}
                  label="rol_id"
                  name="rol_id"
                  value={rolValue}
                >
                  <option value="">Seleccionar rol</option>
                  {roles &&
                    roles.map((rol) => {
                      return (
                        <option key={rol.nombre} value={rol.nombre}>
                          {rol.nombre}
                        </option>
                      );
                    })}
                </CustomSelect>
                {error && error.rol_id && (
                  <div className="error mt-3">{error.rol_id}</div>
                )}
              </div>
              <CustomTextInput
                name="contrasena"
                type="password"
                placeholder="Contraseña"
              />
              {error && error.contrasena && (
                <div className="error mt-3">{error.contrasena}</div>
              )}
            </div>
            <div className="modalFooter">
              <button type="submit">
                {props.isSubmitting ? "Creando..." : "Confirmar"}{" "}
              </button>
              <button type="button" onClick={modalClose}>
                Cancelar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserForm;
