import { useEffect, useState } from "react";
import axios from '../../../axios';
import User from './User/User';
import './Users.css';

const Users = ({ entityArrayDelete, setEntityArrayDelete, operationResponse, setEditEntity }) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [operationResponse])

  async function fetchUsers() {
    const response = await axios.get('/users/all');
    setUsers(response.data);
  }

  function addUser(id, add) {
    if(add) {
      const prevArr = entityArrayDelete.slice();
      prevArr.push(id);
      setEntityArrayDelete(prevArr);
    } else {
      const prevArr = entityArrayDelete.slice();
      const indexFound = prevArr.findIndex(e => e === id);
      prevArr.splice(indexFound, 1);
      setEntityArrayDelete(prevArr);
    }
    console.log(entityArrayDelete);
  }

  return(
    <div className="users">
      { users && (
        users.map(user => {
          return <User 
            key={user.id}
            id={user.id}
            nombre_usuario={user.nombre_usuario}
            nombre={user.nombre}
            apellido={user.apellido}
            dni={user.dni}
            fecha_nacimiento={user.fecha_nacimiento}
            anio_ingreso={user.anio_ingreso}
            licencia_de_conducir={user.licencia_de_conducir}
            camion_id={user.camion_id}
            rol_id={user.rol_id}
            setEditEntity={setEditEntity}
            addUser={addUser} />
        })
      )}
    </div>
  );
};

export default Users;
