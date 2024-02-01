// const { marker } = require("leaflet");

var map = L.map('mapa').setView([-5.5, -45], 6);

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
        // codigoMun6 = mapaData.features[0].properties.CD_MUN.slice(0, 6);
        applyGeoJSONToMap(mapaData);
        mapaGeoJson = mapaData;
    })
    .catch(error => console.error(error));

function applyGeoJSONToMap(mapaGeoJson, dadosHosp) {

    const regioesCores = {
        'Açailândia': '#009c47',          // Verde escuro
        'Caxias': '#febd11',              // Amarelo queimado
        'Chapadinha': '#d91a21',          // Vermelho
        'São Luís': '#f7901e',            // Laranja
        'Bacabal': '#45b649',             // Verde claro
        'Codó': '#f7901e',                // Laranja
        'Santa Inês': '#d91a21',          // Vermelho
        'Balsas': '#009c47',              // Verde escuro
        'Zé Doca': '#febd11',             // Amarelo queimado
        'Imperatriz': '#45b649',          // Verde claro
        'Itapecuru-Mirim': '#febd11',     // Amarelo queimado
        'Pinheiro': '#f7901e',            // Laranja
        'Barra do Corda': '#b7292f',      // Vermelho escuro
        'Rosário': '#45b649',             // Verde claro
        'Viana': '#febd11',               // Amarelo queimado
        'São João dos Patos': '#b7292f',  // Vermelho escuro
        'Pedreiras': '#f7901e',           // Laranja
        'Presidente Dutra': '#009c47',    // Verde escuro
        'Timon': '#009c47'                // Verde escuro
    };

    const geoJSONLayer = L.geoJSON(mapaGeoJson, {
        style: function (feature) {
            var codigoMunicipio = feature.properties.CD_MUN;
            var nomeRegiao = feature.properties.MUN_REGION;

            const cor = regioesCores[nomeRegiao] || '#febd11';

            return {
                color: 'red',
                weight: 0.7,
                fillOpacity: 0.7,
                fillColor: cor,
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
                        iconUrl: './images/circle-plus-solid.svg', //pinsColors[index]
                        iconSize: [12.5, 20.5],  // tamanho do ícone
                        iconAnchor: [6, 20.5],   
                        popupAnchor: [0, -20.5],   
                        maxZoom: 1
                    });

                    L.marker([lat, lgn], {icon: pin}).addTo(map)
                        .bindPopup(`<strong>${marker.HOSPITAIS}</strong>
                        <br> CNES: ${marker.CNES}
                        <br> Endereço: ${marker.ENDERECO}`)

                    // console.log([lat, lgn]);
                });  

                // console.log(dadosHosp) //RECEBENDO!
            })
            .catch(error => console.error(error));
}


// Função para obter a cor com base no código da região
// function getColorRegiao(nomeRegiao) {
//     // codigoRegiao = getCodigoRegiao(codigoMun6, dadosHosp);
//     // codigoRegiao = codigoRegiao ? codigoRegiao.toString() : null;
//     nomeRegiao = 

//     switch (nomeRegiao) {
//         case '21001':
//             return 'orange'; // Dourado
//         case '21002':
//             return '#FFD700'; // Dourado
//         case '21003':
//             return '#FFA07A'; // Salmão claro
//         case '21004':
//             return '#FF6347'; // Tomate
//         case '21005':
//             return '#FF4500'; // Laranja vermelho
//         case '21001':
//             return '#FF8C00'; // Laranja escuro
//         case '21006':
//             return '#FFDAB9'; // Pêssego
//         case '21007':
//             return '#FFB6C1'; // Rosa claro
//         case '21008':
//             return '#FF69B4'; // Rosa quente
//         case '21009':
//             return '#FF1493'; // Rosa profundo
//         case '21010':
//             return '#DA70D6'; // Orquídea
//         case '21011':
//             return '#8A2BE2'; // Azul violeta
//         case '21012':
//             return '#4B0082'; // Índigo
//         case '21013':
//             return '#0000FF'; // Azul
//         case '21014':
//             return '#00BFFF'; // Azul-claro
//         case '21015':
//             return '#00CED1'; // Turquesa média
//         case '21016':
//             return '#20B2AA'; // Verde-azulado
//         case '21017':
//             return '#32CD32'; // Verde-lima
//         case '21018':
//             return '#8FBC8F'; // Verde-mar
//         case '21019':
//             return '#556B2F'; // Verde-oliva
//         default:
//             return 'black'; // Cor padrão para regiões não mapeadas
//     }
// }




// function getCodigoRegiao(codigoMun6, dadosHosp) {
//     for (var i = 0; i < dadosHosp.length; i++) {
//         console.log(i)
//         console.log(`Comparando ${dadosHosp[i]["CODMUN6"]} com ${codigoMun6}`);
//         if (dadosHosp[i]["CODMUN6"] === codigoMun6) {
//             console.log(`Correspondência encontrada para ${codigoMun6}. Código Regional: ${dadosHosp[i]["COD_REG"]}`);
//             // console.log(dadosHosp[i]["mun_codreg"]);
//             return dadosHosp[i]["COD_REG"];
//         }
//     }
//     console.log(`Nenhuma correspondência encontrada para ${codigoMun6}`);
//     return null; // Retorna null se não encontrar uma correspondência
// }

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

