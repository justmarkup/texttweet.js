/*! Texttweet.js
*  Author: Michael Scharnagl @justmarkup
*  Version: 0.1.0
*  License: MIT
*/

(function( w, d ) {
	'use strict';

	var TextTweet = function (shareC) {

		var shareClass = shareC || false,
			isModern = 'querySelector' in d && 'addEventListener' in w && w.getSelection,
			shareable = true,
			selectionNode,
			trim,
			encode,
			decode,
			getSelectionCoords,
			findParentBySelector,
			collectionHas,
			getSelectionText;

		// wrap choosen text
		function highlight(text) {
			var inputText = d.body,
				innerHTML = inputText.innerHTML,
				index = innerHTML.indexOf(text);

			if (index >= 0) {
				innerHTML = innerHTML.substring(0,index) + '<span id="highlight" class="highlight">' + innerHTML.substring(index,index+text.length) + '</span>' + innerHTML.substring(index + text.length);
				inputText.innerHTML = innerHTML;
			}
		}

		// highlight text from hash and scroll it into view.
		if (d.location.hash) {
			highlight(decodeURIComponent(d.location.hash).replace(/\+/g, ' ').split('#')[1]);
			setTimeout(function(){ d.getElementById("highlight").scrollIntoView({behavior: "smooth"}); }, 1000);
		}

		// cut the mustard, the selection part only works in modern browsers
		if (isModern) {

			trim = function (text) {
				return text && (text.trim? text.trim() : text.replace(/^\s+|\s+$/g, ''));
			};

			encode = function (text) {
				return encodeURIComponent(trim(text))
					.replace(/'/g, '%27')
					.replace(/\(/g, '%28')
					.replace(/\)/g, '%29')
					.replace(/\*/g, '%2A')
					.replace(/\./g, '%2E')
					.replace(/~/g, '%7E')
					
					.replace(/%20/g, '+');
			};
			
			decode = function (text) {
				return encodeURIComponent(text.replace(/\+/g, '%20').replace('#', '%23'));
			};
			
			getSelectionCoords = function () {
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
			};

			collectionHas = function (a, b) {
				for(var i = 0, len = a.length; i < len; i ++) {
					if(a[i] == b) return true;
				}
				return false;
			};

			findParentBySelector = function (elm, selector) {
				var all = document.querySelectorAll(selector);
				var cur = elm.parentNode;

				while(cur && !collectionHas(all, cur)) {
					cur = cur.parentNode;
				}
				return cur;
			};

			getSelectionText = function () {

				var text = w.getSelection().toString(),
					shareButton = d.querySelector('.share-button');

				if (shareClass && text) {
					selectionNode = window.getSelection().anchorNode.parentElement;

					if (selectionNode.className && selectionNode.className.match(shareClass.substring(1))) {
						shareable = true;
					} else if(findParentBySelector(selectionNode, shareClass) === null) {
						shareable = false;
					} else {
						shareable = true;
					}

				}

				if (text && shareable) {

					if (d.querySelector('.highlight')) {
						d.querySelector('.highlight').className = "";
					}
					d.location.hash = encode(text);
					getSelectionCoords();
					shareButton.style.top = (getSelectionCoords().y) + 'px';
					shareButton.style.left = (getSelectionCoords().x) + 'px';

				
					shareButton.className = "share-button share-button-active";
					shareButton.href = "http://www.twitter.com/intent/tweet?text=" + text + '&url=' + decode(d.location.href);

				} else {
					shareButton.className = "share-button";
				}

			};
			d.documentElement.addEventListener("mousedown", function () {getSelectionText();}, false);
			d.documentElement.addEventListener("mouseup", function () {getSelectionText();}, false);
			d.documentElement.addEventListener("keydown", function () {getSelectionText();}, false);
			d.documentElement.addEventListener("keyup", function () {getSelectionText();}, false);
			w.addEventListener("scroll", function () {getSelectionText();}, false);
		}
	};

	window.TextTweet = TextTweet;

})( this, this.document );
