// my ID on openweathermap.org
var APPID = "1e964e5e157f51456e69caa7cfe5ac27"; 

//Collection of background images
var backgrounds = [
  {bg: "https://s13.postimg.org/nbuunckzb/broken_clouds.jpg", dscr: "broken clouds"},
  {bg: "https://s13.postimg.org/4v51a9uev/proximity_shower_rain.jpg", dscr: "proximity shower rain"},
  {bg: "https://s13.postimg.org/4ksxd6qev/few_clouds.jpg", dscr: "few clouds"},
  {bg: "https://s13.postimg.org/r0p50kkdz/light_intensity_shower_rain.jpg", dscr: "light intensity shower rain"},
  {bg: "https://s13.postimg.org/wq5dkvqk7/light_rain.jpg", dscr: "light rain"},
  {bg: "https://s13.postimg.org/c2bbjvupj/sky_is_clear.jpg", dscr: "Sky is Clear"},
  {bg: "https://s13.postimg.org/5d06q4jzr/haze.jpg", dscr: "haze"},
  {bg: "https://s13.postimg.org/n6vorf31z/mist.jpg", dscr: "mist"},
  {bg: "https://s13.postimg.org/7mob0vsxj/moderate_rain.jpg", dscr: "moderate rain"},
  {bg: "https://s13.postimg.org/vy7azfbqv/snow.jpg", dscr: "snow"},
  {bg: "https://s13.postimg.org/dtzp11oon/fog.jpg", dscr: "fog"},
  {bg: "https://s13.postimg.org/r9mpqhx6f/shower_rain.jpg", dscr: "shower rain"},
  {bg: "https://s13.postimg.org/eeeq3qhx3/overcast_clouds.jpg", dscr: "overcast clouds"},
  {bg: "https://s13.postimg.org/vhhhz8ylz/scattered_clouds.jpg", dscr: "scattered_clouds"},
  {bg: "https://s13.postimg.org/8ic28g9zr/light_shower_snow.jpg", dscr: "light shower snow"},
]


var units = "metric"; // "metric" if celsius or "imperial" if farenheight

//weather data: 
var latitude;
var longitude;
var currentLocation;
var currentWeather;
var currentTemp; //initially "metric" (celsius)
var currentMain;
var windSpeed;
var city;


//functionality of unit button
//converts celsius to farenheight and vise versa 
$('.units').click(function(){
    if (units === "imperial") {
        currentTemp = Math.round((currentTemp -  32)  * 5/9);
        $("#temp").text(currentTemp);
        $(".units").text("°C");
        units = "metric";
    } else {
        currentTemp = Math.round(currentTemp * 9/5 + 32);
        $("#temp").text(currentTemp);
        $(".units").text("°F");
        units = "imperial";
    }  
});

//function to display information from API on the main window
//as far as this function will  be used in execution context of asynchronous callback functions, for more convinience global variables are used
function weather(data) {
      window.currentLocation = data.name;
      window.currentWeather = data.weather[0].description;
      window.currentTemp = Math.round(data.main.temp);
      window.currentMain = data.weather[0].main;
      window.windSpeed = data.wind.speed;
      
      
     $("#location").text(currentLocation);     
     $("#temp").text(currentTemp);
     $("#description").text(currentWeather);
     $("#wind").html("wind speed is " + windSpeed + " mph " );
}

//function that choses a relevant background from background collection based on weather description
function background() {
	
  	if(currentWeather || currentMain) {
		 
	for(var i = 0; i < backgrounds.length; i++ ) { 
	  
        if(currentWeather === backgrounds[i].dscr) {
			
          $("#bg").attr("src", backgrounds[i].bg);
			
          break;
			
        } else {
			
          if(currentMain === "Clear") {
			  
          $("#bg").attr("src", backgrounds[5].bg);
			  
          } else if (currentMain === "Clouds") {
			  
          $("#bg").attr("src", backgrounds[0].bg);
			  
          } else if (currentMain === "Rain") {
			  
          $("#bg").attr("src", backgrounds[3].bg); 
			  
          } else if (currentMain === "Snow") {
			  
          $("#bg").attr("src", backgrounds[9].bg);  
			  
          } else if (currentMain === "Drizzle") {
			  
          $("#bg").attr("src", backgrounds[4].bg); 
			  
          }
        }
      } 
		
  }	else {
	  
		  $("#bg").attr("src", backgrounds[3].bg);
	  
  }
}

		//function for succesfull data transmition from navigator
		function success(position) {

				window.latitude = position.coords.latitude;
				window.longitude = position.coords.longitude;   

			 $.getJSON ("http://api.openweathermap.org/data/2.5/weather?units=metric" + "&lat=" + latitude + "&lon=" + longitude + "&APPID=" + APPID , function (data) { 

				 weather(data);

				 background();
			 });
			
			var checkIfConfirmed = setInterval(function() {
				if(!window.latitude) {
					error();
				}
			}, 5000);


		};

		// if not possible to get data from navigator - it is being transfered from ip-api.com
		function error() {
		
          $.getJSON("http://ip-api.com/json?callback=?", function(data){
			  
				window.latitude = data.lat;
				window.longitude = data.lon;
				window.city = data.city;
				
			
				$.getJSON ("http://api.openweathermap.org/data/2.5/weather?units=metric" + "&lat=" + latitude + "&lon=" + longitude + "&APPID=" + APPID , function (data) {

					weather(data);

					background();	

					$("#location").text(city); //ip-api.com gets more precise name of city then when same coordinates are passed to api.openweathermap.org

				});

			});
			
		};

			navigator.geolocation.getCurrentPosition(success, error);



