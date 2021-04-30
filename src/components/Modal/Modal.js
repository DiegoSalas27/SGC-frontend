import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "../../axios";
import "./Modal.css";
import Backdrop from "../Backdrop/Backdrop";
import CollectionForm from "./forms/CollectionPointForm/CollectionPointForm";
import TruckForm from "./forms/TruckForm/TruckForm";
import UserForm from "./forms/UserForm/UserForm";
import EntryPointForm from "./forms/EntryPointForm/EntryPointForm";

const Modal = ({
  show,
  modalClose,
  option,
  operation,
  setOperation,
  entityArrayDelete,
  setEntityArrayDelete,
  setOperationResponse,
  editEntity,
}) => {
  const [mTitle, setModalTitle] = useState();
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    modalTitle();
  }, [location, option, operation, editEntity]);

  function modalTitle() {
    // eslint-disable-next-line default-case
    switch (location.pathname) {
      case "/main/user": {
        if (editEntity !== null) {
          operation !== "edit" && setOperation("edit");
          setModalTitle("Editar usuario");
          break;
        } else {
          if (operation === "create") {
            setModalTitle("Registrar usuario");
            break;
          } else if (operation === "delete") {
            setModalTitle("Eliminar usuario");
            break;
          } else {
            setModalTitle("Editar usuario");
            break;
          }
        }
      }
      case "/main/collectionPoint": {
        if (editEntity !== null) {
          operation !== "edit" && setOperation("edit");
          setModalTitle("Editar punto de acopio");
          break;
        } else {
          if (operation === "create") {
            setModalTitle("Registrar punto de acopio");
            break;
          } else if (operation === "delete") {
            setModalTitle("Eliminar punto de acopio");
            break;
          } else if (operation === "entryPoint") {
            setModalTitle("Ingresar punto de partida");
            break;
          } else {
            setModalTitle("Editar punto de acopio");
            break;
          }
        }
      }
      case "/main/truck": {
        if (editEntity !== null) {
          operation !== "edit" && setOperation("edit");
          setModalTitle("Editar camión recolector");
          break;
        } else {
          if (operation === "create") {
            setModalTitle("Registrar camión recolector");
            break;
          } else if (operation === "delete") {
            setModalTitle("Eliminar camión recolector");
            break;
          } else {
            setModalTitle("Editar camión recolector");
            break;
          }
        }
      }
    }
  }

  function renderForm() {
    // eslint-disable-next-line default-case
    switch (location.pathname) {
      case "/main/user": {
        if (editEntity !== null) {
          return (
            <UserForm
              option={option}
              modalClose={modalClose}
              setOperationResponse={setOperationResponse}
              editEntity={editEntity}
            />
          );
        } else {
          if (operation === "create") {
            return (
              <UserForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                show={show}
              />
            );
          } else if (operation === "delete") {
            return deleteForm("Usuarios");
          } else {
            return (
              <UserForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                editEntity={editEntity}
              />
            );
          }
        }
      }
      case "/main/collectionPoint": {
        if (editEntity !== null) {
          return (
            <CollectionForm
              option={option}
              modalClose={modalClose}
              setOperationResponse={setOperationResponse}
              editEntity={editEntity}
            />
          );
        } else {
          if (operation === "create") {
            return (
              <CollectionForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                show={show}
              />
            );
          } else if (operation === "delete") {
            return deleteForm("Puntos de acopio");
          } else if (operation === "entryPoint") {
            return (
              <EntryPointForm
                modalClose={modalClose}
                show={show}
                setOperation={setOperation}
              />
            );
          } else {
            return (
              <CollectionForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                editEntity={editEntity}
              />
            );
          }
        }
      }
      case "/main/truck": {
        if (editEntity !== null) {
          return (
            <TruckForm
              option={option}
              modalClose={modalClose}
              setOperationResponse={setOperationResponse}
              editEntity={editEntity}
            />
          );
        } else {
          if (operation === "create") {
            return (
              <TruckForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                show={show}
              />
            );
          } else if (operation === "delete") {
            return deleteForm("Camiónes recolectores");
          } else {
            return (
              <TruckForm
                option={option}
                modalClose={modalClose}
                setOperationResponse={setOperationResponse}
                editEntity={editEntity}
              />
            );
          }
        }
      }
    }
  }

  function deleteForm(entityName) {
    return (
      <>
        <div className="deleteFormTitle">
          {entityArrayDelete.length > 0 ? (
            <p>¿Estás seguro de eliminar los {entityName} seleccionados?</p>
          ) : (
            <p>No ha seleecionado {entityName}</p>
          )}
        </div>
        {error && <div className="error mt-3">{error}</div>}
        <div className="modalFooter">
          {entityArrayDelete.length > 0 ? (
            <>
              <button onClick={deleteEntities}> Confirmar </button>
              <button onClick={modalClose}> Cancelar</button>
            </>
          ) : (
            <button onClick={modalClose}> Cerrar </button>
          )}
        </div>
      </>
    );
  }

  async function deleteEntities() {
    try {
      let response;
      entityArrayDelete.map(async (id, index) => {
        response = await axios.delete(`${option}/${id}`);
        console.log(response);
        if (index === entityArrayDelete.length - 1) {
          setError(null);
          setOperationResponse(response);
          setEntityArrayDelete([]);
          modalClose();
        }
      });
    } catch (err) {
      setError(err.response.data.error);
      console.log(err.response.data);
    }
  }

  return (
    <>
      <Backdrop show={show || editEntity} clicked={modalClose} />
      <div
        className="modal"
        style={{
          transform:
            show || editEntity ? "translateY(-70px)" : "translateY(-100vh)",
          opacity: show || editEntity ? "1" : "0",
        }}
      >
        <div className="modalHeader">
          <h3>{mTitle}</h3>
        </div>
        <div className="modal-content">{renderForm()}</div>
      </div>
    </>
  );
};

export default Modal;
