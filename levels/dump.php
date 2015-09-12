<?php

$l	=  empty($_GET["l"]) ? "false" : (int) $_GET["l"];

$doctitle = $l != "false" ? "Level ".$l." dump" : "Level dump"; 

?>

<!DOCTYPE html>
<html>
<head>
	<title><?= $doctitle;?></title>
	
	<meta charset="utf-8" />
	<script src="../resources/js/jquery.min.js"></script>
</head>
<body>
	<pre>
		<code></code>
	</pre>
	
	<script>
		var level = <?= $l;?>;
	</script>
	<script src="../resources/js/level-dump.js"></script>
</body>
</html>