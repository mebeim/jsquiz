(function(l) {	
	var code = document.querySelector('pre');
	
	if (l) $.ajax('get.php?n=' + l + '&q=10000', { success: dump });
	else code.innerHTML = 'INVALID QUERY STRING.';
	
	function dump(x) {
		var r;
			
		code.innerHTML = '';
		for (var i in x.data) {
			code.innerHTML += '\n-------- QUESTION #'+ i + ' --------\n\n' + x.data[i].snippet + '\n\nANSWERS:  ';
			for (var j in x.data[i].answers) {
				r = j == x.data[i].right_answer;
				code.innerHTML += (r ? '<span style="color:red">' : '') + (j != 0 ? '          ' : '') + x.data[i].answers[j] + (r ? '</span>' : '') + '\n';
			}
		}
	}
})(level)

/***** PACKED *****

for(_=") { +r .inner ' (?< x.data  	';fo(vaanswer\\n' :')----document.querySelector('pre')codeHTML [i].(function(vax = JSON.parse(Text),code = ,r;=i in+= QUESTION #'+ i 'snippetANSWERS:	A ins= A ==right_;+=span style=\"color:red\"> (A != 0 ?					s[A]/span>';}}})()";g=/[-]/.exec(_);)with(_.split(g))_=join(shift());eval(_)

*/