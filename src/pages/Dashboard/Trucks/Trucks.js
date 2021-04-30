import { useEffect, useState } from "react";
import axios from '../../../axios';
import Truck from './Truck/Truck';
import './Trucks.css';

const Trucks = ({ entityArrayDelete, setEntityArrayDelete, operationResponse, setEditEntity }) => {
  const [trucks, setTrucks] = useState(null);

  useEffect(() => {
    fetchTrucks();
  }, [operationResponse])

  async function fetchTrucks() {
    const response = await axios.get('/trucks/all');
    setTrucks(response.data);
  }

  function addTruck(id, add) {
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
    <div className="trucks">
      { trucks && (
        trucks.map(truck => {
          return <Truck 
            key={truck.id}
            id={truck.id}
            placa={truck.placa}
            capacidad={truck.capacidad}
            consumo={truck.consumo}
            capacidad_actual={truck.capacidad_actual}
            t_combustible={truck.tipo_combustible}
            marca={truck.marca}
            modelo={truck.modelo}
            setEditEntity={setEditEntity}
            addTruck={addTruck} />
        })
      )}
    </div>
  );
};

export default Trucks;
