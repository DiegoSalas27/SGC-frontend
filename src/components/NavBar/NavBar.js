import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import user from "../../assets/img/user.png";
import Modal from "../Modal/Modal";
import "./NavBar.css";

const NavBar = ({
  userName,
  userRole,
  entityArrayDelete,
  setEntityArrayDelete,
  setOperationResponse,
  editEntity,
  setEditEntity,
  setRoute,
}) => {
  const [sectionTitle, setSectionTitle] = useState(
    userRole === 2 ? "Inicio Conductor" : "Inicio Administrador"
  );
  const [showCrudButtons, setShowCrudButtons] = useState(false);
  const [showWatchRoute, setWatchRoute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState("create");
  const [option, setOption] = useState("");
  const location = useLocation();

  useEffect(() => {
    setNavBarTitle();
  }, [location]);

  function setNavBarTitle() {
    setEntityArrayDelete([]);
    setRoute(false);
    setWatchRoute(false);
    switch (location.pathname) {
      case "/main": {
        setSectionTitle(
          userRole === 2 ? "Inicio Conductor" : "Inicio Administrador"
        );
        setShowCrudButtons(false);
        break;
      }
      case "/main/user": {
        setSectionTitle("Lista de usuario");
        setShowCrudButtons(true);
        setOption("/users");
        break;
      }
      case "/main/collectionPoint": {
        setSectionTitle("Lista puntos de acopio");
        setShowCrudButtons(true);
        setOption("/collectionPoints");
        break;
      }
      case "/main/truck": {
        setSectionTitle("Lista de camiones");
        setShowCrudButtons(true);
        setOption("/trucks");
        break;
      }
      case "/main/map": {
        setSectionTitle("Recorrido en tiempo real");
        setShowCrudButtons(false);
        setWatchRoute(true);
        break;
      }
      case "/main/dashboard": {
        setSectionTitle("Dashboard principal");
        setShowCrudButtons(false);
        break;
      }
    }
  }

  function setModal(operation) {
    setOperation(operation);
    setShowModal(true);
  }

  return (
    <div className="navbar-container">
      <ul>
        <li>
          <p>{sectionTitle}</p>
          <span className="subtitle">Bienvenido {userName}</span>
        </li>
        {showCrudButtons && (
          <div className="navButtons">
            <button
              onClick={() => {
                setEditEntity(null);
                setModal("create");
              }}
            >
              Agregar
            </button>
            <button onClick={() => setModal("delete")}>Eliminar</button>
            {location.pathname === "/main/collectionPoint" && (
              <button
                onClick={() => {
                  setEditEntity(null);
                  setModal("entryPoint");
                }}
              >
                Punto de partida
              </button>
            )}
          </div>
        )}
        {showWatchRoute && (
          <div className="navButtons">
            <button onClick={() => setRoute(true)}>Ver recorrido</button>
          </div>
        )}
        <li>
          <img src={user} /> &nbsp;&nbsp;&nbsp;
          <span className="subtitle">{userName}</span>
        </li>
      </ul>
      <Modal
        show={showModal}
        operation={operation}
        setOperation={setOperation}
        option={option}
        entityArrayDelete={entityArrayDelete}
        setEntityArrayDelete={setEntityArrayDelete}
        setOperationResponse={setOperationResponse}
        editEntity={editEntity}
        modalClose={() => {
          setEditEntity(null);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default NavBar;
