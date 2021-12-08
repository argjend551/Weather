let weather = {
     Key: "60adf85f565ee7ccf3028f52177bd356",
     fetchweather: function (city) {
          fetch(
               "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.Key,

          )
               .then((response) => response.json())
               .then((data) => this.displayWeather(data));
     },
     displayWeather: function (data) {
          const { name } = data;
          const { icon, description } = data.weather[0];
          const { temp, humidity } = data.main;
          const { speed } = data.wind;
          console.log(name, icon, description, temp, humidity, speed);
          document.querySelector(".location-timezone").innerText = name;
          document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
          document.querySelector(".temperature-degree").innerText = Math.round(temp);


     },
     search: function () {
          this.fetchweather(document.querySelector(".search").value);
     }
};

let geocode = {
     reverseGeocode: function (latitude, longitude) {
          let api_key = '6c4ce7cd58ca4f1a97a7ebb7d03bd0d4';

          let api_url = 'https://api.opencagedata.com/geocode/v1/json'

          let request_url = api_url
               + '?'
               + 'key=' + api_key
               + '&q=' + encodeURIComponent(latitude + ',' + longitude)
               + '&pretty=1'
               + '&no_annotations=1';

          // see full list of required and optional parameters:
          // https://opencagedata.com/api#forward

          let request = new XMLHttpRequest();
          request.open('GET', request_url, true);

          request.onload = function () {
               // see full list of possible response codes:
               // https://opencagedata.com/api#codes

               if (request.status === 200) {
                    // Success!
                    let data = JSON.parse(request.responseText);
                    // alert(data.results[0].formatted); // print the location
                    weather.fetchweather(data.results[0].components.town);
               } else if (request.status <= 500) {
                    // We reached our target server, but it returned an error

                    console.log("unable to geocode! Response code: " + request.status);
                    let data = JSON.parse(request.responseText);
                    console.log('error msg: ' + data.status.message);
               } else {
                    console.log("server error");
               }
          };

          request.onerror = function () {
               // There was a connection error of some sort
               console.log("unable to connect to server");
          };

          request.send();  // make the request
     },
     getLocation: function () {
          function success(data) {
               geocode.reverseGeocode(data.coords.latitude, data.coords.longitude)
          }
          if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(success,test)

          } 
     }
};

document.querySelector(".btn").addEventListener("click", function () {
     slideDown();
     weather.search();

});

document.querySelector(".search").addEventListener("keyup", function (event) {
     if (event.key == "Enter") {
          slideDown()

          weather.search();
     }

});




document.querySelector(".btn1").addEventListener("click", function () {
     
     slideDown()

     geocode.getLocation();
});

function slideDown() {
     document.querySelector(".wrapper").style.height = 325 + "px";
}

function test() {
     document.querySelector(".location-timezone").innerText = "Enable your location."
}