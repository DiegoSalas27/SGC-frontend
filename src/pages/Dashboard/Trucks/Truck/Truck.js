import { useState } from 'react';
import Edit from '../../../../assets/img/edit.png'
import { tipo_combustible } from '../../../../utils/constants';
import './Truck.css';
import truck from '../../../../assets/img/wasteTruck.png';

const Truck = ({
  id,
  placa,
  capacidad,
  consumo,
  capacidad_actual,
  t_combustible,
  marca,
  modelo,
  setEditEntity,
  addTruck,
  }) => {

  const [check, setCheck] = useState(false);

  function setCheckBox() {
    setCheck(!check);
    addTruck(id, !check);
  }
  
  return (
    <>
      <div className="truck">
        <img className="entityIconTruck" src={truck} alt="camnion"/>
        <div className="truck-info">
          <h3>{placa}</h3>
          <div>
            <span>Capacidad: </span>
            <span>{ capacidad } m<sup>3</sup> </span>
          </div>
          <div>
            <span>Volumen actual: </span>
            <span>{ capacidad_actual } m<sup>3</sup></span>
          </div>
          <div>
            <span>Consumo: </span>
            <span>{ consumo}</span>
          </div>
          <div>
            <span>Marca: </span>
            <span>{ marca}</span>
          </div>
          <div>
            <span>Modelo: </span>
            <span>{ modelo}</span>
          </div>
          <div>
            <span>Combustible: </span>
            <span>{ tipo_combustible[t_combustible]}</span>
          </div>
        </div>
        <div className="options">
          <input type="checkbox" name={`check${id}`} checked={check} onChange={setCheckBox} /> &nbsp;&nbsp;
          <img onClick={() => setEditEntity(id)} src={Edit} alt=""/>
        </div>
      </div>
    </>
  );
};

export default Truck;
