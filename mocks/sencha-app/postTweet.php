<?php
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'EpiTwitter.php';
include 'config.php';

if (($_COOKIE['oauth_token']) != '') {
  $twitterObj = new EpiTwitter($consumer_key, $consumer_secret,$_COOKIE['oauth_token'],$_COOKIE['oauth_token_secret']);
} else {
  $twitterObj = new EpiTwitter($consumer_key, $consumer_secret, $my_oauth_token, $my_oauth_token_secret);
}

if ( $_GET['tweet'] != '') {
  $msg = $_GET['tweet'].(' #SFJF10');
  $update_status = $twitterObj->post_statusesUpdate(array('status' => $msg));
  $temp = $update_status->response;
  echo 'Tweet posted!';
} else {
  echo 'Please write your tweet before posting.';
}
?>
