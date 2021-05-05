import collectionPoint from "../../../assets/img/trash-s-icon.svg";
import user from "../../../assets/img/user-s-icon.svg";
import truck from "../../../assets/img/truck-s-icon.svg";
import axios from "axios";

export class CustomMap {
  constructor(divId) {
    this.googleMap = new window.google.maps.Map(
      document.getElementById(divId),
      {
        zoom: 12,
        center: {
          lat: -12.122587,
          lng: -76.992705,
        },
      }
    );
    this.markers = {};
  }

  addSelfMarker() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const marker = new window.google.maps.Marker({
          map: this.googleMap,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          icon: user,
        });

        marker.addListener("click", () => {
          const inforWindow = new window.google.maps.InfoWindow({
            content: "Este eres tú",
          });

          inforWindow.open(this.googleMap, marker);
        });
      });
    }
  }

  updateMarker(mappable, id) {
    console.log(mappable.latitud, mappable.longitud);
    const position = new window.google.maps.LatLng(
      mappable.latitud,
      mappable.longitud
    );
    this.markers[id.toString() + "truck"] &&
      this.markers[id.toString() + "truck"].setPosition(position);
  }

  deleteMarker(id) {
    this.markers[id.toString() + "truck"].setMap(null);
    delete this.markers[id.toString() + truck];
  }

  addMarker(mappable, entityName, id) {
    // can pass any argument that satisfies de Mappable interface defined
    const marker = new window.google.maps.Marker({
      map: this.googleMap,
      position: {
        lat: mappable.latitud,
        lng: mappable.longitud,
      },
      icon: entityName === "trash" ? collectionPoint : truck,
    });

    marker.id = id;

    this.markers[marker.id.toString() + entityName] = marker;

    marker.addListener("click", () => {
      const inforWindow = new window.google.maps.InfoWindow({
        content: mappable.nombre,
      });

      inforWindow.open(this.googleMap, marker);
    });
  }

  async showTruckRoutes2(trucks){
    var directionsService = this.googleMap.DirectionsService;
    var directionsDisplay = this.googleMaps.DirectionsRenderer;
    
    directionsDisplay.setMap(map);
    
    var data = trucks;

    console.log(data);

    this.calculateAndDisplayRoute(directionsService, directionsDisplay, data);
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, data) {
       
    for(var j = 0; j < data.length; ++j){

      console.log(data[j]);

      var len = Object.keys(data[j].names_route).length;

      for(var i = 0; i < len - 1; ++i){
        directionsService.route({
          origin: data[j].names_route[i],
          destination: data[j].names_route[i + 1],
          travelMode: 'DRIVING'
          }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
    }
  }

  async showTruckRoutes(trucks) {
    // send tracks currently in the database with their ids, license_plate, driver, capacity and current garbashe volume
    // send trash currently in the database with their ids, capacity and current garbashe volume, coordinates

    // backend returns trucks with the following data:
    // id, distance, license_plate, driver, route(matrix)

    // const trucks = [
    //   {
    //     id: 1,
    //     distance: "100",
    //     license_plate: "KJKAD1",
    //     driver: "Pedro Salinas",
    //     route: [
    //       [-77.013743, -12.177352][(-77.00831, -12.170845)], // lng, lat
    //       [-77.007002, -12.172308],
    //       [-77.005851, -12.171445],
    //       [-77.005054, -12.172625],
    //     ],
    //   },
    //   {
    //     id: 2,
    //     distance: "200",
    //     license_plate: "1A0AS0",
    //     driver: "Juan Dominguez",
    //     route: [
    //       [-77.013892, -12.176537],
    //       [-77.014595, -12.175761],
    //       [-77.01496, -12.176097],
    //       [-77.013384, -12.177706],
    //     ],
    //   },
    // ];

    var colors = [];

    trucks.forEach((_) => {
      colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
    });

    var infowindow = new window.google.maps.InfoWindow();

    // process the loaded GeoJSON data.
    var bounds = new window.google.maps.LatLngBounds();

    let map = this.googleMap.data.map;

    if (map) {
      window.google.maps.event.addListener(
        map.data,
        "addfeature",
        function (e) {
          if (e.feature.getGeometry().getType() === "MultiLineString") {
            var polys = e.feature.getGeometry().getArray();
            for (var i = 0; i < polys.length; i++) {
              for (var j = 0; j < polys[i].getLength(); j++) {
                var poly = new window.google.maps.Polyline({
                  map: this.map,
                  path: polys[i].getArray(),
                  strokeColor: colors[i % colors.length],
                });
                window.google.maps.event.addListener(
                  poly,
                  "click",
                  (function (poly, i, feature) {
                    return function () {
                      infowindow.setContent(
                        feature.getProperty("Distance" + i) +
                          "<br>" +
                          feature.getProperty("Camion" + i) +
                          "<br>" +
                          feature.getProperty("Conductor" + i)
                      );
                      infowindow && infowindow.setPosition(polys[i].getAt(0));
                      infowindow.open(this.map);
                    };
                  })(poly, i, e.feature)
                );
                bounds.extend(polys[i].getAt(j));
              }
            }
            this.map.fitBounds(bounds);
            this.map.data.setMap(null);
          }
        }
      );

      const properties = {};
      const coordinates = [];

      for (const [index, truck] of trucks.entries()) {
        properties[`Distance${index}`] = "Distancia: " + truck.distance + "km";
        properties[`Camion${index}`] = "Placa: " + truck.license_plate;
        properties[`Conductor${index}`] = "Conductor: " + truck.driver;
        for (const route of truck.route.entries()) {
          route[0] = parseFloat(route[0]);
          route[1] = parseFloat(route[1]);
        }
        coordinates.push(truck.route);
      }

      var jsonData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: properties,
            geometry: {
              type: "MultiLineString",
              coordinates, // each matrix represents a truck route
            },
          },
        ],
      };

      this.googleMap.data.addGeoJson(jsonData);
      window.google.maps.event.addDomListener(window, "load");
    }
  }
}
