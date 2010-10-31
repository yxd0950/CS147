<?php
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'EpiTwitter.php';
include 'config.php';
$twitterObj = new EpiTwitter($consumer_key, $consumer_secret,$_COOKIE['oauth_token'],$_COOKIE['oauth_token_secret']);

if(isset($_GET['tweet'])) {
  $msg = $_GET['tweet'];
  $update_status = $twitterObj->post_statusesUpdate(array('status' => $msg));
  $temp = $update_status->response;
?>
Posted tweet: <?php echo $msg ?>
<?php
}
?>
