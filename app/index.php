<?php
include 'TwitterSearch.php';
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'EpiTwitter.php';
include 'config.php';

$twitterObj = new EpiTwitter($consumer_key, $consumer_secret);
$oauthToken = $_GET['oauth_token'];
$loginUrl = $twitterObj->getAuthorizationUrl();

if ($oauthToken != '') {
  $loginOrOut = 'Logout';//logout out
  $isLoggedIn = true;
  $twitterObj->setToken($oauthToken);
  $token = $twitterObj->getAccessToken();
  $twitterObj->setToken($token->oauth_token, $token->oauth_token_secret);
  setcookie('oauth_token',$token->oauth_token);
  setcookie('oauth_token_secret', $token->oauth_token_secret);
} else {
  $loginOrOut = 'Login with Twitter';//login
  $isLoggedIn = false;
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Fairly Guided</title>
    <link rel="stylesheet" href="sencha-touch.css" type="text/css">
    <link rel="stylesheet" href="app.css" type="text/css">
    <script type="text/javascript">
      // For use in following javascript code
      var $loginUrl = "<?php echo $loginUrl ?>";
      var $logoutUrl = "logout.php";
      var $oauthToken = "<?php echo $oauthToken ?>";
      var $loginOrOut = "<?php echo $loginOrOut ?>";
      var $isLoggedIn = <?php echo $isLoggedIn ? 'true' : 'false' ?>;
    </script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.4.3.min.js"></script>
    <script type="text/javascript" src="sencha-touch.js"></script>
    <script type="text/javascript" src="protovis.js"></script>
    <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
    <script type="text/javascript" src="companies.js"></script>
    <script type="text/javascript" src="index.js"></script>
    <script type="text/javascript" src="infobox.js"></script>
    <style type="text/css" media="screen">
      body {
        background-color: #333;
      }
      .x-tabpanel > .x-panel-body .x-panel-body {
        padding: 100px 0;
        text-align: center;
        font-size: 72px;
        font-weight: bold;
        color: rgba(0,0,0,.2);
        text-shadow: rgba(255,255,255,.2) 0 1px 0;
        padding: 100px 15%;
      }
      .x-phone .x-tabpanel > .x-panel-body .x-panel-body {
        padding: 30px 20px;
        font-size: 36px;
      }
      .x-phone p {
        font-size: 16px;
        line-height: 18px;
      }
      h1 {
        font-weight: bold;
      }
      p {
        font-size: 24px;
        line-height: 30px;
      }
      .home .x-panel-body {
        background-color: #ccc;
      }
      .search .x-panel-body {
        background-color: #ccc;
      }
      .buzz {
        background-color: #333;
      }
      .buzz .x-panel-body {
        padding: 0;
      }
      .x-tabpanel > .x-panel-body .x-panel-body {
        padding: 0;
      }
      .x-tab img.twitterbird, .x-button img.x-icon-mask.twitterbird {
        -webkit-mask-image: url('twitterbird.png');
      }
      div.tweet {
        -webkit-box-orient: horizontal;
        display: -webkit-box;
        font-size: 18px;
        font-weight: normal;
        margin: 15px;
        margin-top 10px;
        text-align: left;
        padding: 2px;
      }
      div.tweet img {
        border: 2px solid white;
        background-color: white;
        height: 60px;
        width: 60px;
      }
      div.tweet-bubble {
        -webkit-box-flex: 1;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        overflow-x: hidden;
        overflow-y: hidden;
        position: relative;
        margin-left: 15px;
      }
      div.tweet-content {
        background-color: white;
      }
      div.tweet-content p {
        font-size: 18px;
      }
      div.tweet-content h2 {
        font-size: 18px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div style="display:none;">
      <div id="search-div">
<?php
function searchTweets($searchContent) {
}
$search = new TwitterSearch('stanford');
$results = $search->results();
?>
        <ol>
<?php
foreach($results as $value) {
?>
          <li><?php echo $value->text?></li>";
<?php
}
?>
        </ol>
      </div>

      <div id="tweet-div" style="background-color:#333;">
      </div>

      <div id="company-div">
        <h3 id="company-name"></h3>
        <h4>Position types</h4>
        <ul id="company-positions"></ul>
        <h4>Majors of interest</h4>
        <ul id="company-majors"></ul>
        <h4>Degrees of interest</h4>
        <ul id="company-degrees"></ul>
      </div>
      <div id="home-div">
<?php
if($oauthToken == '') {
  echo '<p style="font-variant:small-caps;color:grey;">You are logged in Anonymously</p>';
} else {
  $twitterInfo= $twitterObj->get_accountVerify_credentials();
  $twitterInfo->response;
  $username = $twitterInfo->screen_name;
  $profilepic = $twitterInfo->profile_image_url;
  include 'update.php';
}
include 'CareerFair.php';
?>
      </div>
    </div>
  </body>
</html>
