<?php

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
$sql = "SELECT HOSPITAIS, CNES, MUNICIPIOS, ENDERECO, COORDENADAS FROM tb_hsp";
$result = $conn->query($sql);

$markers = array();
while ($row = $result->fetch_assoc()) {
    //transforma string em array 
    $row['COORDENADAS'] = json_decode($row['COORDENADAS'], true);
        // Verifica se as coordenadas não são nulas
    if ($row['COORDENADAS'] !== null && count($row['COORDENADAS']) === 2) {
        $markers[] = $row;
    }
}

//fecha conexão
$conn->close();

header('Content-Type: application/json');
echo json_encode($markers);

