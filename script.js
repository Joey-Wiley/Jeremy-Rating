const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//------

const countJeremys = (str) => {
	const re = /[j,J]eremy/g
	return ((str || '').match(re) || []).length
}

function apiError(data) {
	console.log("Error callback: " + data);
};



function onSearchInput() {
	var uri = encodeURI(document.getElementById("searchBar").value);
	theMovieDb.search.getMulti({ "query": uri }, successSearch, apiError);
}

var searchPredictions = document.getElementById("searchPredictions");
function successSearch(data) {
	var topThree = [];
	var preciseData = JSON.parse(data).results;
	var maxNum = (preciseData.length < 3) ? preciseData.length : 3;
	for (i = 0; i < maxNum; i++) {
		if (preciseData[i].media_type == "person") {
			continue;
		}
		topThree.push(preciseData[i]);
	}
	searchPredictions.innerHTML = "";

	if (topThree.length == 0) {
		searchPredictions.style.opacity = "0";
		document.getElementById('searchBar').style.borderBottomLeftRadius = "10px";
		document.getElementById('searchBar').style.borderBottomRightRadius = "10px";
		return;
	} else {
		searchPredictions.style.opacity = "1";
		document.getElementById('searchBar').style.borderBottomLeftRadius = "0px";
		document.getElementById('searchBar').style.borderBottomRightRadius = "0px";
	}

	searchPredictions.innerHTML = "";

	for (i = 0; i < topThree.length; i++) {
		var newSearchPrediction = document.createElement("div");
		if (topThree[i].media_type == "movie") {
			newSearchPrediction.setAttribute("onclick", "clickMovie(" + topThree[i].id + ",'" + topThree[i].media_type + "','" + topThree[i].title.replace("'", "&#39;").replace("'", "&#39") + "','" + topThree[i].backdrop_path + "')");
		} else if (topThree[i].media_type == "tv") {
			newSearchPrediction.setAttribute("onclick", "clickMovie(" + topThree[i].id + ",'" + topThree[i].media_type + "','" + topThree[i].name.replace("'", "&#39;").replace("'", "&#39") + "')");
		}
		newSearchPrediction.classList.add("searchPrediction");

		var newSearchPredictionImg = document.createElement("img");
		newSearchPredictionImg.classList.add("searchPredictionImg");
		if (topThree[i].poster_path == null) {
			newSearchPredictionImg.setAttribute("src", "/assets/noimage.png");
		} else {
			newSearchPredictionImg.setAttribute("src", "https://image.tmdb.org/t/p/w500" + topThree[i].poster_path);
		}

		var newSpan = document.createElement("div");
		newSpan.classList.add("searchPredictionTextContainer");

		var newSearchPredictionTxt = document.createElement("div");
		newSearchPredictionTxt.classList.add("searchPredictionTxt");
		if (topThree[i].media_type == "movie") {
			newSearchPredictionTxt.innerHTML = topThree[i].title;
		} else if (topThree[i].media_type == "tv") {
			newSearchPredictionTxt.innerHTML = topThree[i].name;
		}

		var newSearchPredictionDat = document.createElement("span");
		newSearchPredictionDat.classList.add("searchPredictionDat");

		breakme: if (topThree[i].release_date != undefined) {
			var dateString = JSON.stringify(topThree[i].release_date);
			
			var year = dateString.substring(1, 5);
			var month = parseInt(dateString.substring(6, 8));
			var day = parseInt(dateString.substring(9, 11));
			if (monthNames[month-1] == undefined) break breakme;
			newSearchPredictionDat.innerHTML = monthNames[month-1] + " " + day + ", " + year;
		} else {
			var dateString = JSON.stringify(topThree[i].first_air_date);

			var year = dateString.substring(1, 5);
			var month = parseInt(dateString.substring(6, 8));
			var day = parseInt(dateString.substring(9, 11));
			if (monthNames[month-1] == undefined) break breakme;
			newSearchPredictionDat.innerHTML = monthNames[month-1] + " " + day + ", " + year;
		}

		newSearchPrediction.appendChild(newSearchPredictionImg);
		newSearchPrediction.appendChild(newSpan);
		newSpan.appendChild(newSearchPredictionTxt);
		newSpan.appendChild(newSearchPredictionDat);
		searchPredictions.appendChild(newSearchPrediction);
	}
}

function clickMovie(id, mediaType, mediaName, mediaBackdrop) {
	document.getElementById("searchBar").value = "";
	onSearchInput();
	if (mediaType == "movie") {
		theMovieDb.movies.getCredits({ "id": id }, successCB, apiError);
	} else if (mediaType == "tv") {
		theMovieDb.tv.getCredits({ "id": id }, successCB, apiError);
	}
	document.getElementById("mediaTitle").innerHTML = mediaName;

	if (mediaBackdrop != null) {
		document.getElementById("headerBg").style.backgroundImage = "url('https://image.tmdb.org/t/p/w500" + mediaBackdrop + "')";
	} else {
		document.getElementById("headerBg").style.backgroundImage = "url('assets/headerImg.png')";
	}
}

function successCB(data) {
	var names = [];
	var data = JSON.parse(data);

	// Cast
	var castList = data.cast;
	for (o = 0; o < castList.length; o++) {
		names.push(castList[o].name);
	}
	// Crew
	var crewList = data.crew;
	for (o = 0; o < crewList.length; o++) {
		names.push(crewList[o].name);
	}

	var jeremyList = JSON.stringify(names)
	var numJeremys = countJeremys(jeremyList);
	var totalCredits = castList.length + crewList.length;
	var jeremyScore = (Math.round(100 * ((numJeremys / totalCredits) * 10000)) / 100).toFixed(2);


	const options = {
		startVal: parseInt(document.getElementById("scoreDisplayData").innerHTML),
	  decimalPlaces: 1,
	};
	let demo = new countUp.CountUp('scoreDisplayData', parseInt(jeremyScore), options);
	if (!demo.error) {
	  demo.start();
	} else {
	  console.error(demo.error);
	}
	
	window.location.replace('#results');
}