function $(str) {
		var s = str.substr(0, 1); // # . 
		var ss = str.substr(1); //#con ==> con
		switch (s) {
			case "#":
				return document.getElementById(ss);
				break;
			case ".":
				return getClass(ss);
				break;
			default:
				return document.getElementsByTagName(str);
		}
	}

	function getClass(classname) {
		if (document.getElementsByClassName) {
			return document.getElementsByClassName(classname);
		}

		var con = document.getElementsByTagName("*");

		var arr = [];

		for (var i = 0; i < con.length; i++) {
			// li
			// con aa bb
			var spl = con[i].className.split(" ");

			for (var j = 0; j < spl.length; j++) {

				if (spl[j] == classname) {
					arr.push(con[i]);
				}
			}
		}

		return arr;
	}



	function animate(obj, json, callback) {
		clearInterval(obj.timer);

		obj.timer = setInterval(function() {

			var flag = true
			for (attr in json) {
				var current = 0;
				if (attr == "opacity") {
					current = Math.round(parseInt(getStyle(obj, attr) * 100)) || 0; //0.3 == 30
				} else {
					current = parseInt(getStyle(obj, attr));
				}

				var step = (json[attr] - current) / 10;

				step = step > 0 ? Math.ceil(step) : Math.floor(step);


				if (attr == "opacity") {
					if ("opacity" in obj.style) {
						obj.style.opacity = (current + step) / 100; //0-1 0.3
					} else {
						obj.style.filter = "alpha(opacity:" + (current + step) + ")";
					}
				} else if (attr == "zIndex") {
					obj.style.zIndex = json[attr];
				} else {
					obj.style[attr] = current + step + "px";
				}


				if (json[attr] != current) {
					flag = false;
				}
			}

			if (flag) {
				clearInterval(obj.timer);


				if (callback) {
					callback();
				}
			}


		}, 20)
	}


	function getStyle(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr]; 
		} else {
			return window.getComputedStyle(obj, null)[attr]; 
		}
	}
