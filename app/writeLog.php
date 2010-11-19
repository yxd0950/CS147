<?php
//AP anonymous posting
//RP regular posting
//ZM map zoom
//CS company search
//BI bird icon
//BT bottom tweet button
//CL company list
function logActivity($data){
  $date = new DateTime();
  $myFile = "log.txt";
  //while ( !fopen($myFile,'a'))
  //	sleep(1);
  $fh = fopen($myFile,'a');
  //if (flock($fh,LOCK_EX | LOCK_NB))
  //{
  $data = $data." ".time()."\n";
  fwrite($fh,$data);
  fclose($fh);
  //flock($fh,LOCK_UN);
  // }
  
}
?>
