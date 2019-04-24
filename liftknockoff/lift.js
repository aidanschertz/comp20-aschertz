var mylat = 0;
var mylng = 0;
var minDis = 100000000000;
var me = new google.maps.LatLng(mylat, mylng);
var info = new google.maps.InfoWindow();
var usernames =[];
var pos = [];
var distances = [];
var mks = [];
var type;
var wstatus;
var weiner = false;
var weinIndex;
var pic;
var map;
var marker;
var content;
var closeIndex = 0;
myOptions = {
    zoom: 10,
    center: me,
}

function initMap() {      
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    getLocation();
}

function getLocation() {
	if (navigator.geolocation) {navigator.geolocation.getCurrentPosition(function(position) {
		mylat = position.coords.latitude;
		mylng = position.coords.longitude;
		createMap();
	    });
    }
    else {
		alert("Geolocation not supported by browser");
    }
}

function createMap() {
    me = new google.maps.LatLng(mylat, mylng);
    map.panTo(me);
    marker = new google.maps.Marker({
	    position: me,
	    icon: "peachh.png"
        });
    marker.setMap(map);
    loadRideInfo();

    google.maps.event.addListener(marker, 'click', function (){
	    info.setContent(content);
	    info.open(map, marker);
        });
}
    
function loadRideInfo(){
    var request = new XMLHttpRequest();
    var url = 'https://vast-dawn-43727.herokuapp.com/rides';
    var params = 'orem=ipsum&name=binny';
    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onreadystatechange = function() {  
		if(request.readyState == 4 && request.status == 200) {
        	obj = JSON.parse(request.responseText);
        	
          	if (obj.vehicles){
		    	type = "vehicle"; 
		    	for (count = 0; count < obj.vehicles.length ; count++){
				usernames[count] = obj.vehicles[count].username;
				pos[count] = new google.maps.LatLng(obj.vehicles[count].lat, obj.vehicles[count].lng);
				distances[count] = google.maps.geometry.spherical.computeDistanceBetween(me,pos[count]) * 0.000621371;
                
				if (obj.vehicles[count].username == "WEINERMOBILE"){
			    	weiner = true;
			    	weinIndex = count;
			    	pic = "weinermobile1.png";
				}
				else{
			    	pic = "car1.png";
				}

				mks[count] = new google.maps.Marker({
					position: pos[count],
					icon: pic,
					data: obj.vehicles[count].username + " is " + distances[count] + " miles away"
			    	});
				mks[count].setMap(map);

		    	google.maps.event.addListener(mks[count], 'click', function (){
					info.setContent(this.data);
					info.open(map, this);
			    	});
		    	}

		    	if (weiner == true){
					wstatus = "The Weinermobile is " + distances[weinIndex] + " miles away from me!";
		    	} 
		    	else{
					wstatus = "The Weinermobile is nowhere to be seen";
		    	}
			}

            if (obj.passengers){
		    	type = "passenger";
		    	for (count = 0; count < obj.passengers.length ; count++){
					usernames[count] = obj.passengers[count].username;
					pos[count] = new google.maps.LatLng(obj.passengers[count].lat, obj.passengers[count].lng);
					distances[count] = google.maps.geometry.spherical.computeDistanceBetween(me,pos[count]) * 0.000621371;
                	
                	if (obj.passengers[count].username == "WEINERMOBILE"){
			    		weiner = true;
			    		weinIndex = count;
			    		pic = "weinermobile1.png";
					}
					else{
			    		pic = "cherry.png";
					}

					mks[count] = new google.maps.Marker({
						position: pos[count],
						icon: pic,
						data: obj.passengers[count].username + " is " + distances[count] + " miles away"
			    	});
					mks[count].setMap(map);

					google.maps.event.addListener(mks[count], 'click', function (){
						info.setContent(this.data);
						info.open(map, this);
			    	});
		    	}

		    	if (weiner == true){
					wstatus = "The Weinermobile is " + distances[weinIndex] + " miles away from me!";
		    	} 
		    	else{
					wstatus = "The Weinermobile is nowhere to be seen";
		    	}  
			}

            for (count = 0; count < pos.length ; count++){
				if (distances[count] < minDis){
		    		minDis = distances[count];
		    		closeIndex = count;
				}		
            }
            content = "User R5zer572:<br> The closest " + type + " is " + usernames[closeIndex] + ", they are " + minDis + " miles away<br>" + wstatus;
        }
    }
    request.send("username=R5zer572&lat="+mylat+"&lng="+mylng);
};

 