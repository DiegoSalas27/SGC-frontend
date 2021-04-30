import { useEffect, useState } from "react";
import axios from '../../../axios';
import CollectionPoint from './CollectionPoint/CollectionPoint';
import './CollectionPoints.css';

const CollectionPoints = ({ entityArrayDelete, setEntityArrayDelete, operationResponse, setEditEntity }) => {
  const [collectionPoints, setCollectionPoints] = useState(null);

  useEffect(() => {
    fetchCollectionPoints();
  }, [operationResponse])

  async function fetchCollectionPoints() {
    const response = await axios.get('/collectionPoints/all');
    setCollectionPoints(response.data);
  }

  function addCollectionPoint(id, add) {
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
    <div className="collection-points">
      { collectionPoints && (
        collectionPoints.map(collection => {
          return <CollectionPoint 
            key={collection.id}
            id={collection.id}
            camion_id={collection.camion_id}
            capacidad={collection.capacidad}
            capacidad_actual={collection.capacidad_actual}
            latitud={collection.latitud}
            longitud={collection.longitud}
            nombre={collection.nombre}
            tipoPunto={collection.tipo_punto}
            setEditEntity={setEditEntity}
            addCollectionPoint={addCollectionPoint} />
        })
      )}
    </div>
  );
};

export default CollectionPoints;
