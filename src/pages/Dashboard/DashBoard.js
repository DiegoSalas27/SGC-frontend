import { useLocation, useHistory } from "react-router";
import { useEffect, useState, useContext } from "react";
import jwt_decode from "jwt-decode";
import { SocketContext } from "../../context/SocketContext";
import SideBar from "../../components/SideBar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import AdminStart from "./AdminStart/AdminStart";
import CollectionPoints from "./CollectionPoints/CollectionPoints";
import Trucks from "./Trucks/Trucks";
import Users from "./Users/Users";
import Map from "./Map/Map";
import "./DashBoard.css";
import setJWT from "../../utils/setJWT";

const options = {
  enableHighAccuracy: false,
  timeout: 1000,
  maximumAge: 0,
};

const Dashboard = () => {
  const [entityArrayDelete, setEntityArrayDelete] = useState([]);
  const [operationResponse, setOperationResponse] = useState(null);
  const [editEntity, setEditEntity] = useState(null);
  const [route, setRoute] = useState(false);
  const [user, setUser] = useState(null);
  const [initialLode, setInitialLoad] = useState(null);
  const location = useLocation();
  const history = useHistory();

  const { socket } = useContext(SocketContext);

  useEffect(() => {}, [location]);

  useEffect(() => {
    setUser(jwt_decode(localStorage.getItem("jwtToken")));
    setInitialLoad(true);
  }, []);

  // Crear un marcador al estar conectado como conductor
  useEffect(() => {
    if (user && user.rol_id === 2) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const driverMarker = {
            nombre: user.nombre_usuario,
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            id: user.id,
          };
          socket.emit("marcador-nuevo", driverMarker);
        });
        setInterval(() => {
          navigator.geolocation.getCurrentPosition((position) => {
            const driverMarker = {
              nombre: user.nombre_usuario,
              latitud: position.coords.latitude,
              longitud: position.coords.longitude,
              id: user.id,
            };
            console.log(position.coords.latitude, position.coords.longitude);
            socket.emit("marcador-actualizado", driverMarker);
          });
        }, 1000);
        // navigator.geolocation.watchPosition(success, error, options);
      }
    } else {
      if (initialLode) {
        const { id, rol_id } = jwt_decode(localStorage.getItem("jwtToken"));
        if (rol_id === 2) {
          socket.emit("marcador-eliminar", id);
          localStorage.removeItem("jwtToken");
          setTimeout(() => {
            window.location.replace("/");
          }, 500);
        }
      } else if (!initialLode && user) {
        localStorage.removeItem("jwtToken");
        window.location.replace("/");
      }
    }
    return () => {
      socket.off("marcador-nuevo");
      socket.off("marcador-eliminar");
    };
  }, [socket, user, initialLode]);

  function logout() {
    setJWT(false);
    if (user.rol_id === 1) {
      setInitialLoad(false);
    } else {
      setUser(null);
    }
  }

  // function success(position) {
  //   console.log(position.coords.latitude, position.coords.longitude);
  //   const driverMarker = {
  //     nombre: user.nombre_usuario,
  //     latitud: position.coords.latitude,
  //     longitud: position.coords.longitude,
  //     id: user.id
  //   }
  //   socket.emit('marcador-actualizado', driverMarker);
  // };

  // function error(err) {
  //   console.warn('ERROR(' + err.code + '): ' + err.message);
  // };

  function renderPanel() {
    // eslint-disable-next-line default-case
    switch (location.pathname) {
      case "/main":
        return <AdminStart />;
      case "/main/user":
        return (
          <Users
            entityArrayDelete={entityArrayDelete}
            setEntityArrayDelete={setEntityArrayDelete}
            operationResponse={operationResponse}
            setEditEntity={setEditEntity}
          />
        );
      case "/main/collectionPoint":
        return (
          <CollectionPoints
            entityArrayDelete={entityArrayDelete}
            setEntityArrayDelete={setEntityArrayDelete}
            operationResponse={operationResponse}
            setEditEntity={setEditEntity}
          />
        );
      case "/main/truck":
        return (
          <Trucks
            entityArrayDelete={entityArrayDelete}
            setEntityArrayDelete={setEntityArrayDelete}
            operationResponse={operationResponse}
            setEditEntity={setEditEntity}
          />
        );
      case "/main/map":
        return <Map showRoute={route} user={user} />;
      case "/main/dashboard":
        return <AdminStart />;
    }
  }
  return (
    <div className="dashboard-container">
      <SideBar userRol={user && user.rol_id} userLogout={logout} />
      <NavBar
        userName={user ? user.nombre_usuario : ""}
        userRole={user && user.rol_id}
        entityArrayDelete={entityArrayDelete}
        setEntityArrayDelete={setEntityArrayDelete}
        setOperationResponse={setOperationResponse}
        editEntity={editEntity}
        setEditEntity={setEditEntity}
        setRoute={setRoute}
      />
      <div className="main-panel">{renderPanel()}</div>
    </div>
  );
};

export default Dashboard;
