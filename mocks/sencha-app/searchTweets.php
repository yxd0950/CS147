<?php
	include 'TwitterSearch.php';
	$search = '';
	$results = '';
	if(isset($_GET['search'])) {
		$searchText = $_GET['search'];
		if ($searchText == "undefined" || $searchText == '') {
			$search = new TwitterSearch();
			$results = $search->with('SFJF10')->results();
		} else {
			$search = new TwitterSearch($searchText);
			$results = $search->with('SFJF10')->results();
		}
	}
	
	foreach($results as $value) {
?>
	<div class="tweet"> 
	<img src="<?php echo $value->profile_image_url; ?>" />
	<div class="x-tweetanchor"></div>
	<div class="tweet-bubble"> 
	<div class="tweet-content">
	<h2><?php echo $value->from_user; ?></h2>
	<p><?php echo $value->text; ?></p><strong></strong>
	</div>
	</div>
	</div>

<?php
	}
?>