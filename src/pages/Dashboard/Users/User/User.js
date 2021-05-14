import { useState } from "react";
import Edit from "../../../../assets/img/edit.png";
import { rol } from "../../../../utils/constants";
import user from "../../../../assets/img/user.png";
import "./User.css";

const User = ({
  id,
  nombre_usuario,
  nombre,
  apellido,
  dni,
  fecha_nacimiento,
  anio_ingreso,
  licencia_de_conducir,
  camion_id,
  rol_id,
  setEditEntity,
  addUser,
}) => {
  const [check, setCheck] = useState(false);

  function setCheckBox() {
    setCheck(!check);
    addUser(id, !check);
  }

  return (
    <>
      <div className="user">
        <img className="entityIconUser" src={user} alt="user" />
        <div className="user-info">
          <h3>{`${nombre} ${apellido}`}</h3>
          <div>
            <span>Nombre de usuario: </span>
            <span>{nombre_usuario}</span>
          </div>
          <div>
            <span>Fecha de nacimiento: </span>
            <span>{new Date(fecha_nacimiento).toLocaleDateString()}</span>
          </div>
          <div>
            <span>DNI: </span>
            <span>{dni}</span>
          </div>
          <div>
            <span>Rol: </span>
            <span>{rol[rol_id]}</span>
          </div>
          {licencia_de_conducir && (
            <div>
              <span>Licencia: </span>
              <span>{licencia_de_conducir}</span>
            </div>
          )}
        </div>
        <div className="options">
          <input
            type="checkbox"
            name={`check${id}`}
            checked={check}
            onChange={setCheckBox}
          />{" "}
          &nbsp;&nbsp;
          <img onClick={() => setEditEntity(id)} src={Edit} alt="" />
        </div>
      </div>
    </>
  );
};

export default User;
