<?php 
	$found = Array();
	$missing = Array();
	
	for ($i = 1; $i < 30; $i++) if (file_exists("xml/".$i.".xml")) $found[] = $i;
	else $missing[] = $i;
	
	$found = implode(", ", $found);
	$missing = implode(", ", $missing);
?>		

<!DOCTYPE html>
<html>
<head>
	<title>Levels status</title>
	
	<meta charset="utf-8" />
	<script src="../resources/js/jquery.min.js"></script>
</head>
<body style="background: black; color: white;">
	<pre>
		<code></code>
	</pre>
	
	<script>
		var code = $('code')[0],
			tocheck = [<?= $found; ?>],
			missing = [<?= $missing; ?>];
		
		function out(what) {
			code.appendChild(what);
		}
		
		function say(what) {
			code.innerHTML += what;
		}
		
		function inspect(i) {
			if (tocheck[i] !== undefined) {
				level = tocheck[i];
			} else return;
			
			function questions(x) {
				if (x > 30) return;
				if (x == 30) return 30;
				if (x >= 25) return 15;
				if (x >= 22) return 10;
				if (x >= 18) return 9;
				if (x >= 15) return 8;
				if (x >= 10) return 7;
				if (x >= 8) return 6;
				if (x >= 5) return 5;
				if (x >= 3) return 4;
				if (x >= 1) return 3;
				return;
			}
			
			$.ajax('xml/' + level + '.xml', {
				success: function(data) {
					var n = data.querySelectorAll('question').length,
						r = questions(level),
						el = document.createElement('span');
					
					if (n > r) el.style.color = 'limegreen';
					else if (n == r) el.style.color = 'orange';
					else el.style.color = 'red';
					
					el.textContent = 'Level ' + level + ' \t--\>\t' + n + ' question' + (n > 1 ? 's' : ' ');
					el.textContent += ' (' + r + ' required)\t';
					el.textContent += (n >= r ? (n==r ? '±' + (n-r) : '+' + (n-r)) : n-r) + '\n';
					out(el);
					
					inspect(++i);
				}
			});
		}
		
		if (missing) {
			say('\n\n-------- MISSING LEVELS ---------\n\n');
			say(missing.join(', ') + '\n\n\n');
		}
		
		say('\n------ FOUND LEVELS STATUS ------\n\n');
		inspect(0);
	</script>
</body>
</html>