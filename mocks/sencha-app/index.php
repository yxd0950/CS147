<?php

include 'TwitterSearch.php';

	include 'EpiCurl.php';
	include 'EpiOAuth.php';
	include 'EpiTwitter.php';
	include 'config.php';
	 
	$twitterObj = new EpiTwitter($consumer_key, $consumer_secret);
	$oauth_token = $_GET['oauth_token'];
	$loginUrl = $twitterObj->getAuthorizationUrl();

	if ($oauth_token != '') {
		$twitterObj->setToken($oauth_token);
		$token = $twitterObj->getAccessToken();
		$twitterObj->setToken($token->oauth_token, $token->oauth_token_secret);
		setcookie('oauth_token',$token->oauth_token);
		setcookie('oauth_token_secret', $token->oauth_token_secret);
	}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">  
    <title>Tabs 2</title>
    <link rel="stylesheet" href="sencha-touch.css" type="text/css">
    <script type="text/javascript">
	var loginUrl = "<?php echo $loginUrl ?>";
	var oauth_token = "<?php echo $oauth_token ?>";
    </script>

    <script type="text/javascript" src="ext-touch.js"></script>    
    <script type="text/javascript" src="protovis.js"></script>
    <script type="text/javascript" src="index.js"></script>

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
      .buzz .x-panel-body {
        background-color: #ccc;
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
    echo "<ol>";
    foreach($results as $value) {
      echo "<li> $value->text </li>";
    }
    echo "</ol>";
    ?>
      </div>
      <div id="company-div">
        <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title> Welcome to NetApp </title>
    </head>
    <h1> NetApp </h1>
    <body>
    <table>
      <tr>
      <td width="506"><table>
      <tr>
        <td width="208"><h3>Company Name ("NetApp")</h3></td>
      </tr>
      <tr>
        <td height="100"><img name="" src="ntap_logo.jpg" width="128" height="128" alt="" /></td>
        <td width="280"><table>
        <tr>          
        <td height="32"><p> NetApp creates innovative products�storage systems and software that help customers around the world store, manage, protect, and retain one of their most precious corporate assets: their data. We are recognized throughout the industry for continually pushing the limits of today�s technology so that our customers never have to choose between saving money and acquiring the capabilities they need to be successful. </p></td>
        </tr>
        <tr>
        <td height="49"><h6><u><a href="http://www.netapp.com"><font color = "blue"> Click Here to Learn More </font></a></u></h6></td>
        </tr>
        </</td>
      </tr>
      </table>
    </td>
    </tr>
    </table>
    <h4> Open Positions: </h4>
    <ul>
    <li> Sr. Product Manager - Software Licensing</li>
    <li> Engineering Program Mgr - Product Supportability </li>
    <li> Senior IT Architect </li>
    <li> Software Engineer </li>
    </ul>
    </body>
    </html>
        <p>Some search stuff...</p>
      </div>
      <div id="map-div">
        <script type="text/javascript">
          new pv.Panel()
              .width(150)
              .height(150)
            .add(pv.Dot)
              .data([[.1, 1], [.5, 1.2], [.9, 1.7], [.2, 1.5], [.7, 2.2]])
              .left(function(d) { return d[0] * 150; })
              .bottom(function(d) { return d[1] * 50; })
            .root.render();
        </script>
      </div>
      <div id="home-div">
	<?php 
	//session_start();
	 if($oauth_token == '')
	 {
	 echo "<div style='width:200px;margin-top:200px;margin-left:auto;margin-right:auto'>";
	 echo "<a href='$loginUrl'>Sign In with Twitter</a>";
	 echo "</div>";
	 }
	 else
	 {
	 $twitterInfo= $twitterObj->get_accountVerify_credentials();
	 $twitterInfo->response;
	 
	 $username = $twitterInfo->screen_name;
	 $profilepic = $twitterInfo->profile_image_url;
	 
	 include 'update.php';
	 
	 }
	/*	 
	if(isset($_POST['submit']))
	 {
	 $msg = $_REQUEST['tweet'];
	 
	 $twitterObj->setToken($_SESSION['ot'], $_SESSION['ots']);
	 $update_status = $twitterObj->post_statusesUpdate(array('status' => $msg));
	 $temp = $update_status->response;
	 
 echo "<div align='center'>Updated your Timeline Successfully .</div>";
 }*/
?>
	</div>
    </div>
  </body>
</html>
