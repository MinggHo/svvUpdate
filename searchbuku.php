<?php

$db = mysqli_connect('localhost','root','','svv');

$data = json_decode( file_get_contents('php://input') );
$nama = $data->barang;

$sql = "SELECT Nama FROM barang WHERE Nama LIKE '%$nama%' ORDER BY Nama";

$result = $db->query($sql);

// $data = array();

if (!$result){
  echo mysqli_error($db);
} else
  while( $row = $result->fetch_object() )
    //$data[] = $row;
    echo "<option value='".$row->Nama."'>";

  //echo json_encode($data);
?>
