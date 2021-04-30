import { useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { CustomMap } from "./MapConfig";
import axios from "../../../axios";
import "./Map.css";
import { SocketContext } from "../../../context/SocketContext";
import { useState } from "react";

const puntoInicial = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

const Map = ({ showRoute, user }) => {
  const [map, setMap] = useState(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    setMap(new CustomMap("map"));
  }, []);

  useEffect(() => {
    map && initMarkers();
  }, [map, showRoute]);

  // Escuchar como fiscalizador conductores activos
  useEffect(() => {
    if (map && showRoute) {
      socket.emit("marcadores-activos", {});
      socket.on("marcadores-activos", (marcadores) => {
        for (const key of Object.keys(marcadores)) {
          map.addMarker(marcadores[key], "truck", key);
        }
      });
    }
    return () => {
      socket.off("marcadores-activos");
    };
  }, [socket, showRoute]);

  // Escuchar como fiscalizador nuevos de conductores que se conectan
  useEffect(() => {
    const decoded = jwt_decode(localStorage.getItem("jwtToken"));
    if (decoded.rol_id === 1 && showRoute) {
      socket.on("marcador-nuevo", (marcador) => {
        if (map) {
          map.addMarker(marcador, "truck", marcador.id);
        }
      });
    }
    return () => {
      socket.off("marcador-nuevo");
    };
  }, [socket, showRoute, map]);

  // Mover marcador mediante sockets
  useEffect(() => {
    const decoded = jwt_decode(localStorage.getItem("jwtToken"));
    if (decoded.rol_id === 1 && showRoute) {
      socket.on("marcador-actualizado", (marcador) => {
        if (map) {
          map.updateMarker(marcador, marcador.id);
        }
      });
    }
    return () => {
      socket.off("marcador-actualizado");
    };
  }, [socket, showRoute, map]);

  // Escuchar como fiscalizador conductores que se desconectan
  useEffect(() => {
    if (map && showRoute) {
      socket.on("marcador-eliminar", (id) => {
        map.deleteMarker(id);
      });
    }
    return () => {
      socket.off("marcador-eliminar");
    };
  }, [socket, showRoute]);

  async function initMarkers() {
    let responseTrash;
    try {
      responseTrash = await axios.get("collectionPoints/all");
      responseTrash.data.forEach((entity) => {
        map.addMarker(entity, "trash", entity.id);
      });
      // map.addSelfMarker();
    } catch (err) {
      console.log(err);
    }

    if (showRoute) {
      const responseTrucks = await axios.get("/trucks/getAllDrivers");

      const json_locations = responseTrash.data.map((trash) => {
        return {
          id: trash.id,
          demand: trash.capacidad_actual,
          lat: trash.latitud,
          lng: trash.longitud,
        };
      });

      const json_drivers = responseTrucks.data.map((driver) => {
        return {
          id: driver.id,
          license_plate: driver.placa,
          driver: driver.driver,
          capacity: driver.capacidad - driver.capacidad_actual,
          lat: driver.lat,
          lng: driver.lng,
        };
      });

      console.log("YO ENVIO", json_drivers);
      console.log("TACHOS", json_locations);

      const response = await axios.post("/collectionPoints/optimize", {
        json_locations: JSON.stringify(json_locations),
        json_drivers: JSON.stringify(json_drivers),
      });

      console.log(response);

      if (user && user.rol_id === 2) {
        // if you are the driver, you can only see yourself
        response.data.response.trucks = response.data.response.trucks.filter(
          (truck) => truck.id === user.id
        );
      }

      map.showTruckRoutes(response.data.response.trucks);
    }
  }

  return <div id="map" className="map"></div>;
};

export default Map;
