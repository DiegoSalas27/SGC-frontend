import { Link } from "react-router-dom";
import user from "../../assets/img/user.png";
import collectionPoint from "../../assets/img/puntoAcopio.png";
import truck from "../../assets/img/truck.png";
import map from "../../assets/img/map.png";
import dashboard from "../../assets/img/dashboard.png";
import logout from "../../assets/img/logout.ico";
import logo from "../../assets/img/logo512.png";
import "./SideBar.scss";
import setJWT from "../../utils/setJWT";
import { useState } from "react";

const SideBar = ({ userLogout, userRol }) => {
  const [open, setOpen] = useState(true);

  const openMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={`sidebard-container ${open ? 'display-block':'display-none'}`}>
        <ul>
          <Link className="nav-link" to="/main">
            <img
              src={logo}
              alt=""
              width="120"
              style={{ marginTop: "-24px", marginBottom: "20px" }}
            />
          </Link>
          {userRol && userRol === 1 && (
            <>
              <Link className="nav-link" to="/main/user">
                <li>
                  <img src={user} width="40" /> Usuario
                </li>
              </Link>

              <Link className="nav-link" to="/main/collectionPoint">
                <li>
                  <img src={collectionPoint} width="40" /> Punto de acopio
                </li>
              </Link>

              <Link className="nav-link" to="/main/truck">
                <li>
                  <img src={truck} width="40" /> Camión recolector
                </li>
              </Link>
              {/* <Link className="nav-link" to="/main/dashboard">
              <li>
                <img src={dashboard} width="40" /> Dashboard
              </li>
            </Link> */}
            </>
          )}
          <Link className="nav-link" to="/main/map">
            <li>
              <img src={map} width="40" /> Ver mapa
            </li>
          </Link>
          <li onClick={userLogout}>
            <img src={logout} width="40" /> Cerrar sesión
          </li>
          <div class="close small-x" onClick={()=>closeMenu()}></div>
        </ul>
      </div>

      <div className="hamburger" onClick={() => openMenu()}>
        <span></span>
        <span></span>
        <span></span>
      </div>

    </>
  );
};

export default SideBar;
