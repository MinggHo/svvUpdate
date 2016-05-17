<?php
include('./connect.php');

$data = json_decode( file_get_contents('php://input') );
$new = $data->id;

$sqlm = "SELECT * FROM barang where Nama='$new'";
$resultm=mysqli_query($link,$sqlm);
$num_rowsm=mysqli_num_rows($resultm);
$rowm = mysqli_fetch_assoc($resultm);

if ($rowm > 0){
  // Data Found
  echo $rowm['Harga'];
} else {
  // Data not found
  echo "Data not found";
}
?>
