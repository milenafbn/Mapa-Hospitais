// const { marker } = require("leaflet");

var map = L.map('mapa').setView([-5.5, -45], 6);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     // maxBounds: [[-11.5, -48.5], [-1.5, -41.5]],
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
    maxBounds: [[-11.5, -48.5], [-1.5, -41.5]],
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

var pinsColors = [
    './images/circle-orange.svg',
    './images/circle-green.svg',
    './images/circle-red.svg',
    './images/circle-yellow.svg'
]

var codigoMun6;

fetch('../data/mapcidade.json')
    .then(response => response.json())
    .then(mapaData => {
        codigoMun6 = mapaData.features[0].properties.CD_MUN.slice(0, 6);
        applyGeoJSONToMap(mapaData);
        mapaGeoJson = mapaData;
    })
    .catch(error => console.error(error));

function applyGeoJSONToMap(mapaGeoJson) {
    // const regioesColors = {
    //     21001:
    //     21002:
    //     21003:
    //     21004:
    //     21005:
    //     21006:
    //     21007:
    //     21008:
    //     21009:
    //     21010:
    //     21011:
    //     21012:
    //     21013:
    //     21014:
    //     21015:
    //     21016:
    //     21017:
    //     21018:
    //     21019:

    // }

    const geoJSONLayer = L.geoJSON(mapaGeoJson, {
        style: function (feature) {
            var codigoMunicipio = feature.properties.CD_MUN;

            return {
                color: 'black',
                weight: 0.7,
                fillOpacity: 0,
            };
        },
    });
    geoJSONLayer.addTo(map);

    fetch('../data/get_dataHsp.php')
            .then(response => response.json())
            .then(dataHsp => {
                dadosHosp = dataHsp;
                dataHsp.forEach((marker, index) => {
                    const [lat, lgn] = marker.COORDENADAS;

                    var index = index % pinsColors.length;
                    var pin = L.icon({
                        iconUrl: pinsColors[index],
                        iconSize: [12.5, 20.5],  // Novo tamanho do ícone
                        iconAnchor: [6, 20.5],   // Metade do valor original
                        popupAnchor: [0, -20.5],   // Metade do valor original// point from which the popup should open relative to the iconAnchor
                        maxZoom: 1
                    });

                    L.marker([lat, lgn], {icon: pin}).addTo(map)
                        .bindPopup(`<strong>${marker.HOSPITAIS}</strong>
                        <br> CNES: ${marker.CNES}
                        <br> Endereço: ${marker.ENDERECO}`)

                    // console.log([lat, lgn]);
                });  

                const cod_reg = getCodigoRegiao(codigoMun6, dataHsp);
                console.log(cod_reg);
                // console.log(dadosHosp) //RECEBENDO!
            })
            .catch(error => console.error(error));


}



function getCodigoRegiao(codigoMun6, dadosHosp) {
    for (var i = 0; i < dadosHosp.length; i++) {
        if (dadosHosp[i]["MUNICIPIOS"] === codigoMun6) {
            // console.log(dadosHosp[i]["mun_codreg"]);
            return dadosHosp[i]["mun_codreg"];
            
        }
    }
    return null; // Retorna null se não encontrar uma correspondência
}

// const cod_reg = getCodigoRegiao(codigoMun6, dadosHosp)
// console.log(cod_reg)

// var plusIcon = L.icon({
//         iconUrl: './images/circle-green.svg',
//         iconSize: [12.5, 20.5],  // Novo tamanho do ícone
//         iconAnchor: [6, 20.5],   // Metade do valor original
//         popupAnchor: [0, -20.5],   // Metade do valor original// point from which the popup should open relative to the iconAnchor
//         maxZoom: 1
// });

// var orangeIcon = L.icon({iconUrl: './images/circle-orange.svg'})
//     redIcon = L.icon({iconUrl: './images/circle-red.svg'})
//     yellowIcon = L.icon({iconUrl: './images/circle-yellow.svg'})




// function colorPin (){
//     var randomIndex = Math.floor(Math.random() * pinsColors.length);
//     return pinsColors[randomIndex]
// }

// var pinUrl = colorPin();

