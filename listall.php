<?php

require "connect.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$result = $link->query("SELECT * FROM barang");

$data = array();

if($result->num_rows>0){
  while ($row = $result->fetch_object()) {
    $data[] = $row;
  }
} else {
  $data[] = null;
}

$link -> close();
echo json_encode($data);
?>
