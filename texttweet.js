/*! Texttweet.js
*  Author: Michael Scharnagl @justmarkup
*  Version: 0.1.0
*  License: MIT
*/

(function(w, d) {
	// wrap choosen text
	function highlight(text) {
		var inputText = d.body,
			innerHTML = inputText.innerHTML,
			index = innerHTML.indexOf(text);

		if (index >= 0) { 
			innerHTML = innerHTML.substring(0,index) + '<span id="highlight" class="highlight">' + innerHTML.substring(index,index+text.length) + '</span>' + innerHTML.substring(index + text.length);
			inputText.innerHTML = innerHTML 
		}
	}

	// highlight text from hash and scroll it into view.
	if (d.location.hash) {
		highlight(decodeURIComponent(d.location.hash).replace(/\+/g, ' ').split('#')[1]);
		setTimeout(function(){ d.getElementById("highlight").scrollIntoView({behavior: "smooth"}); }, 1000);
	}

	// cut the mustard, the selection part only works in modern browsers
	if ('querySelector' in d && 'addEventListener' in w && w.getSelection) {

		function trim(text) {
			return text && (text.trim? text.trim() : text.replace(/^\s+|\s+$/g, ''));
		}

		function encode (text) {
			return encodeURIComponent(trim(text))
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
				.replace(/\./g, '%2E')
				.replace(/~/g, '%7E')
				
				.replace(/%20/g, '+');
		}
		
		function decode (text) {
			return encodeURIComponent(text.replace(/\+/g, '%20').replace('#', '%23'));
		}
		
		function getSelectionCoords() {
			var range,
				rect,
				sel = w.getSelection(),
				x = 0, 
				y = 0;

			if (sel.rangeCount) {
				range = sel.getRangeAt(0).cloneRange();
				if (range.getClientRects) {
					range.collapse(true);
					rect = range.getClientRects()[0];
					x = rect.left;
					y = rect.top;
				}
			}

			return { x: x, y: y };
		}

		function getSelectionText() {
			var text = w.getSelection().toString(),
				shareButton = d.querySelector('.share-button');

			if (text) {
				d.querySelector('.highlight') ? d.querySelector('.highlight').className = "" : "";
				d.location.hash = encode(text);
				getSelectionCoords();
				shareButton.style.top = (getSelectionCoords().y) + 'px';
				shareButton.style.left = (getSelectionCoords().x) + 'px';
				shareButton.className = "share-button share-button-active";	
				shareButton.href = "http://www.twitter.com/share?text=" + text + '&url=' + decode(d.location.href);

			} else {
				shareButton.className = "share-button";
			}
		}

		d.documentElement.addEventListener("mousedown", function () {getSelectionText()}, false);
		d.documentElement.addEventListener("mouseup", function () {getSelectionText()}, false);
		d.documentElement.addEventListener("keydown", function () {getSelectionText()}, false);
		d.documentElement.addEventListener("keyup", function () {getSelectionText()}, false);
		w.addEventListener("scroll", function () {getSelectionText()}, false);
	}
})(this, this.document);