// const { marker } = require("leaflet");

var map = L.map('mapa').setView([-5.5, -45], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // maxBounds: [[-11.5, -48.5], [-1.5, -41.5]],
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('../data/mapcidade.json')
    .then(response => response.json())
    .then(mapaData => {
        applyGeoJSONToMap(mapaData);
        mapaGeoJson = mapaData;

        fetch('../data/get_dataHsp.php')
            .then(response => response.json())
            .then(dataHsp => {
                dataHsp.forEach(marker => {
                    const [lat, lgn] = marker.COORDENADAS;
                    L.marker([lat, lgn], {icon: icon}).addTo(map)
                        .bindPopup(`Endereço: ${marker.ENDERECO }`)

                    console.log([lat, lgn]);
                });  
            })
            .catch(error => console.error(error));
    })
    .catch(error => console.error(error));

function applyGeoJSONToMap(mapaGeoJson) {
    const geoJSONLayer = L.geoJSON(mapaGeoJson, {
        style: function (feature) {
            return {
                color: 'red',
                weight: 0.7,
                fillOpacity: 0,
            };
        },
    });
    geoJSONLayer.addTo(map);
}

var icon = L.icon({
    iconUrl: '../data/location-dot-solid (1).svg',

    iconSize:     [20, 50], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
    
});
