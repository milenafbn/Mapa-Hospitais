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

$idReg = "";

$cl = ($idReg == "") ? "" : "AND mun_codreg = '".$idReg."' ";

// Consulta SQL para obter dados dos hospitais
$consultaHospitais = "SELECT HOSPITAIS, CNES, MUNICIPIOS, ENDERECO, COORDENADAS, mun_codreg  as 'COD_REG'
                     FROM tb_hsp h, tb_municipios m
                     WHERE h.CODMUN6 = m.mun_ibge6 ".$cl."";
$resultadoHospitais = $conn->query($consultaHospitais);

// Consulta SQL para obter códigos regionais distintos
$consultaRegioes = "SELECT DISTINCT mun_codreg AS 'CÓDIGO REGIONAL' FROM tb_municipios";
$resultadoRegioes = $conn->query($consultaRegioes);

$markers = array();

while ($row = $resultadoHospitais->fetch_assoc()) {
    // Transforma string em array 
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

