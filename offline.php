<?php
header("Content-Type: text/cache-manifest; charset=UTF-8");
function ls_r($d, $r) {
	$ls = glob($d."*", GLOB_MARK);
	if ($ls) foreach ($ls as $f) {
		if (!is_dir($f)) echo $r.$f."\n";
		else ls_r($f, $r);
	}
}
?>
CACHE MANIFEST

# <?= (int)(time()/2); ?>


CACHE:
<?php
ls_r("resources/", false);
?>
