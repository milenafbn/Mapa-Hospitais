<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Configuração do banco de dados
$servername = "127.0.0.1";
$username = "Milena";
$password = "mimi2013";
$dbname = "ssd_db_ct";

// Cria conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Consulta SQL
$sql = "SELECT mun_ibge7, mun_municipio, features_geometry_coordinatesp FROM tb_municipios";
$result = $conn->query($sql);

// Constrói o GeoJSON
$geojson = [
    'type' => 'FeatureCollection',
    'features' => [],
];

// Itera sobre os resultados da consulta
while ($row = $result->fetch_assoc()) {
    // A coluna 'features_geometry_coordinatesp' deve conter um array com as coordenadas
    $coordinates = json_decode($row['features_geometry_coordinatesp'], true);

    $feature = [
        'type' => 'Feature',
        'properties' => [
            'mun_ibge7' => $row['mun_ibge7'],
            'mun_municipio' => $row['mun_municipio'],
        ],
        'geometry' => [
            'type' => 'Point', // Ou outro tipo de geometria
            'coordinates' => $coordinates,
        ],
    ];

    array_push($geojson['features'], $feature);
}

// Fecha a conexão com o banco de dados
$conn->close();

// Envia o GeoJSON como resposta
header('Content-type: application/json');
echo json_encode($geojson);

