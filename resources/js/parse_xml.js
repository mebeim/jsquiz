// This object will parse the questions and return them as json

// Object: XMLParser (no arguments)
// Methods:
// .parseLevel(n, q, callback)


function XMLParser() {

	// == PRIVATE == //

	var _req = new XMLHttpRequest(), n, q, callback;

//TODO: define this var somewhere else. It stands for default "Answers Per Question"
	var APQ = 4;


	// Will request the XML file and parse it to a DOMObject
	function _getXML(url) {
		_req.open("GET", url);
		_req.send();
		_req.onreadystatechange = function() {
			if (_req.readyState == 4) {
				if (_req.status == 200)
					_parseLevel(200, _req.responseXML);
				else
					_parseLevel(_req.status);
			}
		};
		
	}
	
	// Will actually retrieve level data	
	function _parseLevel(status, xml) {
		if (status==200) {

			var qs		=  xml.getElementsByTagName("question"),
			    data	=  [],	// output var
			    pick_q	=  [],	// picked questions (id)
			    count_q	=  qs.length;
			    
			while (pick_q.length < q && pick_q.length < count_q) {
				var r1 = parseInt(Math.random()*count_q);
				// If this question has already been chosen, retry
				if (~pick_q.indexOf(r1)) continue;
				pick_q.push(r1);
				
				var snip	=  qs[r1].getElementsByTagName("snippet")[0].textContent.trim(),
				    ans_xml	=  qs[r1].getElementsByTagName("answers")[0],
				    ans		=  [],	// output answers
				    pick_a	=  [],	// picked answers (id)
				    count_a	=  ans_xml.children.length-1,
			        id_com	=  [],	// id of answers which are comments
			        id_r;			// id of the right answer
				    
				// Take the right answer
				var right =	ans_xml.getElementsByTagName("rightans")[0] ||
							ans_xml.getElementsByTagName("rightcom")[0];
				ans.push([
					right.textContent,
					["right", right.tagName.slice(5)]
				]);
				ans_xml.removeChild(right);
				
				// Choose randomly other answers/comments
				while (ans.length < APQ && ans.length < count_a+1) {
					var r2 = parseInt(Math.random()*count_a);
					if (~pick_a.indexOf(r2)) continue;
					pick_a.push(r2);
					ans.push([
						ans_xml.children[r2].textContent,
						[ ans_xml.children[r2].tagName ]
					])
				}
				
				// Shuffle answers (this alghoritm is pretty funny! found on csstricks)
				(function(o){
				for(var j,x,i=o.length;i;j=parseInt(Math.random()*i),x=o[--i],o[i]=o[j],o[j]=x);
				})(ans);
				
				// Remove labels and position "other" to the end
				for (var i=0; i < ans.length; i++) {
					if (ans[i][0].toLowerCase() == "other" && i!=ans.length-1)
						ans.push(ans.splice(i,1)[0]);
					if (~ans[i][1].indexOf("right"))
						id_r = i;
					if (~ans[i][1].indexOf("com"))
						id_com.push(i);
					ans[i] = ans[i][0];
				}
				
				// Prepare output
				data.push({
					"snippet":		snip,
					"right_answer":	id_r,
					"comments":		id_com,
					"answers":		ans
				});

			}
			
			callback({"status": "ok", "data": data});
			
		}
		else if (status == 404)
			callback({"status": "error", "type": "LEVEL_NOT_EXIST"});
		else
			callback({"status": "error", "type": "UNKNOWN"});
	}



	// == PUBLIC == //

	// Will retrieve level data
	//        n		int		level id
	//        q		int		number of questions to retrieve
	// callback		func	callback function. First argument will be a JSON object
	this.parseLevel = function (_n, _q, _callback) {
		n = _n;
		q = _q || APQ;
		callback = _callback;
		_getXML("levels/xml/"+n+".xml");
	}

}
