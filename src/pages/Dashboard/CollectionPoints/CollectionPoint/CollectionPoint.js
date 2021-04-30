import { useState } from 'react';
import './CollectionPoint.css';
import { tipo_punto } from '../../../../utils/constants';
import Edit from '../../../../assets/img/edit.png'
import puntoAcopio from '../../../../assets/img/puntoAcopio.png';

const CollectionPoint = ({
  id,
  capacidad,
  capacidad_actual,
  camion_id, 
  latitud,
  longitud,
  nombre,
  tipoPunto,
  addCollectionPoint,
  setEditEntity}) => {

  const [check, setCheck] = useState(false);

  function setCheckBox() {
    setCheck(!check);
    addCollectionPoint(id, !check);
  }
  
  return (
    <div className="collection-point">
      <img className="entityIconAcopio" src={puntoAcopio} alt="camnion"/>
      <h3>{nombre}</h3>
      <div>
        <p>LATITUD</p>
        <p>{latitud}</p>
      </div>
      <div>
        <p>LONGITUD</p>
        <p>{longitud}</p>
      </div>
      <div>
        <p>TIPO</p>
        <p>{tipo_punto[tipoPunto]}</p>
      </div>
      <div>
        <span>Capacidad: </span>
        <span>{ capacidad } m<sup>3</sup> </span>
      </div>
      <div>
        <span>Volumen actual: </span>
        <span>{ capacidad_actual } m<sup>3</sup></span>
      </div>
      <div className="options">
        <input type="checkbox" name={`check${id}`} checked={check} onChange={setCheckBox} /> &nbsp;&nbsp;
        <img onClick={() => setEditEntity(id)} src={Edit} alt=""/>
      </div>
    </div>
  );
};

export default CollectionPoint;
