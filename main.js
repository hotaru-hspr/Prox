/* Prox. - Social media to make you touch grass
   By hotaru (@hotaru_hspr)
   For Delta Inductions - Round 2
*/


//stuff for the login page
function username() {
    let user = document.getElementById("username").value;
    let users = [];

    for (let i=0, len=localStorage.length; i<len; i++) {
        users[i] = localStorage.key(i);
    }
	localStorage.setItem("temp", user); //in order to access the username from feed.html, we store the current session username in localstorage api with temp key

    if (users.includes(user)) {
        document.getElementById("lgntext").innerHTML = "<br>Welcome back, @" + user + '!';
        setTimeout(feedpage, 1000);
    }
    else {
        localStorage.setItem(user,'');
        document.getElementById("lgntext").innerHTML = "<br>Welcome, @" + user + '!';
        setInterval(feedpage, 1000);
    }
}


//if logged in, redirect to feed
function ifLoggedIn() {
	if (localStorage["temp"]) {
		window.location.href = "feed.html";
	}
}


//check if logged in, if not, redirect to login page
function checkLoggedIn() {
	if ((localStorage["temp"]) == null) {
		window.location.href = "login.html";
	}
}


//redirect to feed once logged in
function feedpage() {
    window.location.href = "feed.html";
}


//get current location
function getLocation() {
	const successCallback = (position) => {
		lat = position.coords.latitude;
		long = position.coords.longitude;

		localStorage.setItem("lat", JSON.stringify(lat));
		localStorage.setItem("long", JSON.stringify(long));
		
		console.log("Currently logged in:", localStorage["temp"]);
		console.log("Current latitude & longitude:", lat, long);
		document.getElementById("disploc").innerHTML = "Current coordinates: " + lat + ', ' + long + ' | Showing posts in a 1km radius';
		loadposts();
	};
		
	const errorCallback = (error) => {
		document.getElementById("disploc").innerHTML = "<h4 class='title'>Unable to check with the gods if anyone touched grass nearby :(</h4>";
		console.log(error);
	};

	navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}


//get posts from server, calculate distance from user, and display nearby ones
function loadposts() {
	var postshtml = '';

	fetch("http://127.0.0.1:5000/getPosts", {
	method: 'GET',
	}).then(function (response) {
		if (response.ok) {
			return response.json();
			}
			return Promise.reject(response);

	}).then(function (data) {
		for (let i=(data.length-1); i>=0; i--) {

			//Algorithm to calculate distance between two points - Haversine formula
			let plat = (parseFloat(lat) * Math.PI / 180) - (data[i].createdLat * Math.PI / 180);
			let plong = (parseFloat(long) * Math.PI / 180) - (data[i].createdLong * Math.PI / 180);
			
			let x = Math.pow(Math.sin(plat / 2), 2) + Math.cos(lat) * Math.cos(data[i].createdLat) * Math.pow(Math.sin(plong / 2),2);
			let y = 2 * Math.asin(Math.sqrt(x));
			let rad = 6371;
			let havdist = y*rad;

			// checking each post's distance from current location, to add to displayed posts if within 1km
			if (havdist <= 1) {
				if (JSON.parse(data[i].other) == localStorage["temp"]) {
					postshtml += '<div class="postbyuser" onclick="getPost(' + "'" + data[i].id + "'" + ')"><h4 class="title">' + data[i].title + '</h4><h4 class="username">' + '@' + JSON.parse(data[i].other) + '</h4><p class="content">' + data[i].content + '</p><p class="locid">' + data[i].createdLat + ', ' + data[i].createdLong + ' | Post ID: ' + data[i].id + '</p><button id="' + data[i].id + '" class="invis" value="' + data[i].id + '"></button></div><br>';
					console.log(data[i].id, ": Posted nearby")
					console.log("Distance from user in km: ", havdist);
				}
				else {
					postshtml += '<div class="post" onclick="getPost(' + "'" + data[i].id + "'" + ')"><h4 class="title">' + data[i].title + '</h4><h4 class="username">' + '@' + JSON.parse(data[i].other) + '</h4><p class="content">' + data[i].content + '</p><p class="locid">' + data[i].createdLat + ', ' + data[i].createdLong + ' | Post ID: ' + data[i].id + '</p><button id="' + data[i].id + '" class="invis" value="' + data[i].id + '"></button></div><br>';
					console.log(data[i].id, ": Posted nearby")
					console.log("Distance from user in km: ", havdist);
				}
			}
			else {
				console.log(data[i].id, ": Posted away from user")
				console.log("Distance from user in km:", havdist);
			}
		}

		//check if any posts are being sent, else add a message
		if (postshtml=='') {
			postshtml = "<h4 class='title'>Looks like no one touched grass nearby :(</h4>";
		}
		//update the posts that satisfy distance rule to HTML file
		document.getElementById("Posts").innerHTML = postshtml;
		console.log("Stored posts updated to feed");;

	}).catch(function (error) {
		console.warn('Oops, looks like we hit a roadblock!\n',error);
	});
}


//add post to db
function postToAPI() {
	fetch("http://127.0.0.1:5000/createPost", {
		method: 'POST',
		body: JSON.stringify({
			"id": 1,
			"title": document.getElementById("ptitle").value,
			"content": document.getElementById("pcontent").value,
			"createdLat": parseFloat(lat),
			"createdLong": parseFloat(long),
			"other": localStorage["temp"]
	}),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(response);
	}).then(function (data) {
		console.log(data);
		alert("Post added successfully!");
		location.reload();
	}).catch(function (error) {
		console.warn('Something went wrong.', error);
	});
}


//getting post by id
function getPost(id) {
	let posthtml = '';
	let editbox = [];
	fetch("http://127.0.0.1:5000/getPost/"+id, {
		method: 'GET',
		}).then(function (response) {
			if (response.ok) {
				return response.json();
				}
				return Promise.reject(response);

		}).then(function (data) {
			posthtml += '<h1 id="posttitle">' + data.title + '</h1><p id="postuser" class="username">By @' + JSON.parse(data.other) + '</p><p id="postcontent" class="content">' + data.content + '</p><p id="postid" class="locid" style="font-family: ; font-size: 15px; color: rgb(0, 0, 0);">' + data.createdLat + ', ' + data.createdLong + ' | Post ID: ' + data.id + '</p>';
			if (localStorage["temp"]==JSON.parse(data.other)) {
				posthtml += '<br><button id="delbut" class="postoptions" value="' + data.id + '"><img class="delete" src="Assets/delete.png" style="width: 20px; height: 20px;" onclick="deletepost(' + "'" + data.id + "'" + ')" onmouseover="deletered()"></button><button id="editbut" class="postoptions"><img class="edit" src="Assets/edit.png" style="width: 20px; height: 20px;" onmouseover="editgreen()"></button>';
				editbox[0] = data;
			}

			localStorage.setItem("openpost", posthtml);
			localStorage.setItem("editbox", JSON.stringify(editbox));
			window.location.href = "post.html";

		}).catch(function (error) {
			console.warn('Oops, looks like we hit a roadblock!\n',error);
	});
}


//show post in post page
function postDisplay() {
	document.getElementById("dispost").innerHTML = localStorage["openpost"];

	let editbox = JSON.parse(localStorage["editbox"]);
	document.title = "Post by @" + JSON.parse(editbox[0].other) + ' - Prox.';
	document.getElementById("ptitle").innerHTML = editbox[0].title;
	document.getElementById("pcontent").innerText = editbox[0].content;
	document.getElementById("editsend").value = editbox[0].id;
}


//deleting post from the db
function deletepost() {
	id=document.getElementById("delbut").value
	fetch("http://127.0.0.1:5000/deletePost/"+id, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(response);
	}).then(function (data) {
		console.log("Deleted post of id:", id);
		alert("Post has been deleted!");
		window.location.href = "feed.html";
	}).catch(function (error) {
		console.warn('Something went wrong.', error);
	});
}

// //edit a pre-existing post
function editpost() {
	let id = document.getElementById("editsend").value;
	fetch("http://127.0.0.1:5000/updatePost/"+id, {
		method: 'PUT',
		body: JSON.stringify({
			"title": document.getElementById("ptitle").value,
			"content": document.getElementById("pcontent").value,
			"createdLat": parseFloat(sessionStorage["lat"]),
			"createdLong": parseFloat(sessionStorage["long"]),
			"other": localStorage["temp"]
	}),
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (response) {
		if (response.ok) {
			return response.json();
		}
		return Promise.reject(response);
	}).then(function (data) {
		console.log("Updated post of ID:", id);
		alert("Post edited successfully!");
		window.location.href = "feed.html";
	}).catch(function (error) {
		console.warn('Something went wrong.', error);
	});
}


//display all posts by user in profile
function userposts() {
	var userpostshtml = '';

	fetch("http://127.0.0.1:5000/getPosts", {
	method: 'GET',
	}).then(function (response) {
		if (response.ok) {
			return response.json();
			}
			return Promise.reject(response);

	}).then(function (data) {
		for (let i=(data.length-1); i>=0; i--) {
			if (JSON.parse(data[i].other) == localStorage["temp"]) {
				userpostshtml += '<div class="postbyuser" onclick="getPost(' + "'" + data[i].id + "'" + ')"><h4 class="username">' + '@' + JSON.parse(data[i].other) + '</h4><h4 class="title">' + data[i].title + '</h4><p class="content">' + data[i].content + '</p><p class="locid">' + data[i].createdLat + ', ' + data[i].createdLong + ' | Post ID: ' + data[i].id + '</p><button id="' + data[i].id + '" class="invis" value="' + data[i].id + '"></button></div><br>';
			}
			}

		//check if any posts are being sent, else add a message
		if (userpostshtml == '') {
			userpostshtml = "<h4 class='title' style='color: black;'>You haven't posted anything :(</h4>";
		}

		document.getElementById("userPosts").innerHTML = userpostshtml;
		document.title = "@" + localStorage["temp"] + ' - Prox.';

		console.log("User's posts updated to profile");;

	}).catch(function (error) {
		console.warn('Oops, looks like we hit a roadblock!\n',error);
	});
}


//display username in profile page
function profileuser() {
	document.getElementById("user").innerHTML = '@' + localStorage["temp"] + "'s Profile";
}


//logout user
function logout() {
	localStorage.removeItem("temp");
	alert("Logged out successfully!");
	location.reload();
}

/*end of file*/
