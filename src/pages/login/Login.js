import { useState } from "react";
import { useHistory } from "react-router";
import { Formik, Form } from "formik";
import jwt_decode from "jwt-decode";
import axios from "../../axios";
import * as Yup from "yup";
import logo from "../../assets/img/logo512.png";
import CustomTextInput from "../../components/common/Input/Input";
import setJWT from "../../utils/setJWT";
import MessageModal from "../../components/Modal/MessageModal";
const Login = ({ setLoggedIn }) => {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const history = useHistory();

  async function submitHandler(
    { username, password },
    setSubmitting,
    resetForm
  ) {
    const user = {
      username,
      password,
      confirmPassword: password,
    };
    try {
      const loggedIn = await axios.post("/users/login", user);

      const { token } = loggedIn.data;

      localStorage.setItem("jwtToken", token);

      setJWT(token); // set token in header

      console.log(loggedIn);
      resetForm();
      setSubmitting(false);
      setShowModal(false);
      setError(null);
      setLoggedIn(token);
      history.push("/main");
    } catch (err) {
      setSubmitting(false);
      if (
        err.response &&
        err.response.data.type &&
        err.response.data.type === "popup"
      ) {
        setModalContent(err.response.data.error);
        setShowModal(true);
        setError(null);
      } else {
        setShowModal(false);
        setError(err.response.data.error);
        console.log(err.response.data);
      }
    }
  }

  return (
    <div className="app">
      <MessageModal
        title="Error"
        show={showModal}
        modalClose={() => {
          setShowModal(false);
        }}
        content={modalContent}
      />
      <div className="section-container center h-500">
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={Yup.object({
            username: Yup.string().required("Este campo es obligatorio"),
            password: Yup.string()
              .min(6, "El contraseña debe contener al menos 6 caracteres")
              .required("Este campo es obligatorio"),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            submitHandler(values, setSubmitting, resetForm);
          }}
        >
          {(props) => (
            <Form className="authForm">
              <CustomTextInput
                name="username"
                type="text"
                placeholder="Ingrese usuario"
              />
              <CustomTextInput
                name="password"
                type="password"
                placeholder="Ingrese contraseña"
              />
              {error && <div className="error mt-3">{error}</div>}
              <div className="bottom-panel">
                {/* <p className="link-text">Olvidé mi contraseña</p> */}
                <button type="submit">
                  {props.isSubmitting ? "Cargando..." : "Ingresar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="logoBar">
        <img src={logo} alt="" width="150" />
      </div>
    </div>
  );
};

export default Login;
