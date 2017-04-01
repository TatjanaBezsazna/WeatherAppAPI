// my ID on openweathermap.org
var APPID = "1e964e5e157f51456e69caa7cfe5ac27"; 
var bgDomain = 'https://s13.postimg.org';

//Collection of background images
var bgExtensions = {
	"broken clouds": '/nbuunckzb/broken_clouds.jpg',
	"proximity shower rain": '/4v51a9uev/proximity_shower_rain.jpg',
	"few clouds": '/4ksxd6qev/few_clouds.jpg',
	"light intensity shower rain": '/r0p50kkdz/light_intensity_shower_rain.jpg',
	"light rain": '/wq5dkvqk7/light_rain.jpg',
	"Sky is Clear": '/c2bbjvupj/sky_is_clear.jpg',
	"haze": '/5d06q4jzr/haze.jpg',
	"mist": '/n6vorf31z/mist.jpg',
	"moderate rain": '/7mob0vsxj/moderate_rain.jpg',
	"snow": '/vy7azfbqv/snow.jpg',
	"fog": '/dtzp11oon/fog.jpg',
	"shower rain": '/r9mpqhx6f/shower_rain.jpg',
	"overcast clouds": '/eeeq3qhx3/overcast_clouds.jpg',
	"scattered clouds": '/vhhhz8ylz/scattered_clouds.jpg',
	"light shower snow": '/8ic28g9zr/light_shower_snow.jpg'
}

var units = "metric"; // "metric" if celsius or "imperial" if farenheight

//weather data: 
var currentWeather;
var currentTemp; //initially "metric" (celsius)
var currentMain;

//function that choses a relevant background from background collection based on weather description
function background() {
	
	var backgroundExtension = bgExtensions["Sky is Clear"]; //default background
	
  	if(currentWeather || currentMain) {
		
		if(currentWeather in bgExtensions) {
			
			backgroundExtension = bgExtensions[currentWeather];
				
		} else {
			
			switch(currentMain) {
					
				case "Clear":
				backgroundExtension = bgExtensions["Sky is Clear"];
				break;
					
				case "Clouds":
				backgroundExtension = bgExtensions["broken clouds"];
				break;	
				
				case "Rain":
				backgroundExtension = bgExtensions["light intensity shower rain"];
				break;
				
				case "Snow":
				backgroundExtension = bgExtensions["snow"];
				break;
				
				case "Drizzle":
				backgroundExtension = bgExtensions["light rain"];
				break;
					
				default:
				backgroundExtension = bgExtensions["Sky is Clear"];	
						
				}
			}
		} 
	
	$("#bg").attr("src", bgDomain + backgroundExtension);
}

//functionality of unit button
//converts celsius to farenheight and vise versa 
function changeUnits() {
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
};

//function to display information from API on the main window
//as far as this function will  be used in execution context of asynchronous callback functions, for more convinience global variables are used
function weather(data) {
     var currentLocation = data.name;
	 var windSpeed = data.wind.speed;
  	 window.currentWeather = data.weather[0].description;
     window.currentTemp = Math.round(data.main.temp);
     window.currentMain = data.weather[0].main;

      
     $("#location").text(currentLocation);     
     $("#temp").text(currentTemp);
     $("#description").text(currentWeather);
     $("#wind").html("wind speed is " + windSpeed + " mph " );
}



	$.getJSON("http://ip-api.com/json?callback=?", function(data){

		var latitude = data.lat;
		var longitude = data.lon;
		var city = data.city;


		$.getJSON ("http://api.openweathermap.org/data/2.5/weather?units=metric" + "&lat=" + latitude + "&lon=" + longitude + "&APPID=" + APPID , function (data) {

			weather(data);
			background();	

			$("#location").text(city); //ip-api.com gets more precise name of city then when same coordinates are passed to api.openweathermap.org

		});

	});
