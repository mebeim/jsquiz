<?php

header("Content-Type: application/xml; charset=UTF-8");

$l = (int) $_GET["l"];
$i = (int) $_GET["i"];

if (file_exists("xml/".$l.".xml")) {

	$xml = simplexml_load_file("xml/".$l.".xml");

	if ($xml->question[$i])
		echo $xml->question[$i]->asXML();

}

?>
