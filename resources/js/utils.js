/* == Selector function == */

function _(sel, all) {
	var q = all ? document.querySelectorAll(sel) : document.querySelector(sel);
	var n = document.createElement("null");
	return q ? q : (all ? [n] : n);
}


/* == Some workarounds for unsupported methods == */

Object.getOwnPropertyDescriptor(Node.prototype, "children") || Object.defineProperty(
	Node.prototype,
	"children",
	{
		get: function() {
//TODO: return an instance of HTMLCollection
			return Array.prototype.filter.call(this.childNodes, function(el){return el.nodeType==1;});
		}
	}
);


/* == Other DOM-related useful stuff (replacing jq) == */

Object.defineProperties(Element.prototype, {
	// This stuff is hackerish, if classList is supported we use it, otherwise we fallback on manual
	addClass: {
		value: function(cl) {
			this.classList ?
			this.classList.add.apply(this.classList, cl.split(" ")) :
			// prevent adding the className if it's already there
			~this.className.split(" ").indexOf(cl) || (this.className = (this.className+" "+cl).trim());
		}
	},
	removeClass: {
		value: function(rms) {
			if (this.classList)
				this.classList.remove.apply(this.classList, rms.split(" "));
			else {
				rms = rms.split(" ");
				cls = this.className.split(" ");
				for (var i=0, j; rm = rms[i]; i++)
					// Remove all occurences of the same className
					while (~(j = cls.indexOf(rm))) cls.splice(j,1);
				this.className = cls.join(" ").trim();
			}
		}
	},
	// Handle this with CSS
	fadeIn: {
		value: function() {
			this.addClass("show");
			this.removeClass("hide");
		}
	},
	fadeOut: {
		value: function() {
			this.addClass("hide");
			this.removeClass("show");
		}
	}
});


/* == Other stuff == */

// Checks if Storage API is usable
function storageON() {
	try {
		localStorage.setItem("__test", "data");
	} catch (e) {
		if (/(QUOTA_?EXCEEDED|SecurityError|ReferenceError)/i.test(e.name))
			return false;
	} 
	return true;
}

// CustomEvent Polyfill for IE ≥ 9
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
