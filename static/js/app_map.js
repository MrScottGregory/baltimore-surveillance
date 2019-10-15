  // -------------------------------------------
  // BUILD MAP BASE LAYER
  // -------------------------------------------

  // define tile layer
  let streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    minZoom: 4,
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  })

  // create map object and set default layers
  let myMap = L.map("camera_map", {
    center: [39.296589, -76.61537],
    zoom: 11,
    layers: [streetmap]
  });


  // -------------------------------------------
  // GET CAMERA DATA AND CREATE CAMERA LAYER
  // -------------------------------------------
  
  d3.json("/cmap")
  .then(function(data){

    // CREATE VARIABLE TO HOLD ARRAY OF CIRCLES
    var cameras = []

    // LOOP THROUGH JSON, APPENDING CIRCLES & POP-UPS TO CAMERAS ARRAY
    for (var i = 0; i < data.length; i++) {

      // CREATE VARIABLE TO HOLD EACH CIRCLE CREATED IN LOOP
      var onecircle = L.circle([data[i].Latitude, data[i].Longitude], {
        color: "purple",
        weight: 1,
        opacity: .5,
        fillColor: "gold",
        fillOpacity: .8,
        radius: 100
    })
        .bindPopup("<p style='text-align:center'><b>Zip Code: " + data[i].ZipCode + "</b><br>["+data[i].Latitude+", "+data[i].Longitude+"]</p>");
      // APPEND EACH CIRCLE TO THE CAMERAS ARRAY
      cameras.push(onecircle); 
    }
    
    // ASSIGN CAMERAS ARRAY TO A LAYER GROUP
    var cameraLayer = L.layerGroup(cameras);

  // -------------------------------------------
  // CODE TO CREATE CIRCLES WITHOUT LAYER
  // -------------------------------------------

  // d3.json("/cmap")
  //   .then(function(data){

  //     // LOOP THROUGH JSON, CREATE CIRCLE WITH POPUP AT EACH COORDINATE
  //     for (var i = 0; i < data.length; i++) {
  //       L.circle([data[i].Latitude, data[i].Longitude], {
  //         color: "purple",
  //         weight: 1,
  //         opacity: .5,
  //         fillColor: "purple",
  //         fillOpacity: .5,
  //         radius: 100
  //     })
  //         .bindPopup("<p style='text-align:center'><b>Zip Code: " + data[i].ZipCode + "</b><br>["+data[i].Latitude+", "+data[i].Longitude+"]</p>")
  //         .addTo(myMap);
  //     }
  // });

  // -------------------------------------------
  // GET HOMICIDE DATA AND CREATE HEATMAP LAYER
  // -------------------------------------------
  
  d3.json("/hmap")
  .then(function(data){
  
    var homicideArray = [];
  
    for (var i = 0; i < data.length; i++) {
      var date = data[i].CrimeDate;
  
      if (date) {
        homicideArray.push([data[i].Latitude, data[i].Longitude]);
      }
    }
    var homicides = L.heatLayer(homicideArray, {
      minOpacity: .5,
      radius: 25,
      blur: 15,
      gradient: {0.5: 'pink', 1: 'red'}
    });
  

  // -------------------------------------------
  // GET SHOOTING DATA AND CREATE HEATMAP LAYER
  // -------------------------------------------

  d3.json("/smap")
  .then(function(data){
  
    var shootingsArray = [];
  
    for (var i = 0; i < data.length; i++) {
      var date = data[i].CrimeDate;
  
      if (date) {
        shootingsArray.push([data[i].Latitude, data[i].Longitude]);
      }
    }
    var shootings = L.heatLayer(shootingsArray, {
      minOpacity: .5,
      radius: 25,
      blur: 15,
      gradient: {0.5: 'grey', 1: 'black'}
    });
  

  // -------------------------------------------
  // GET PERSONAL CRIME DATA AND CREATE HEATMAP LAYER
  // -------------------------------------------

  d3.json("/pmap")
  .then(function(data){
  
    var personalArray = [];
  
    for (var i = 0; i < data.length; i++) {
      var date = data[i].CrimeDate;
  
      if (date) {
        personalArray.push([data[i].Latitude, data[i].Longitude]);
      }
    }
    var personal = L.heatLayer(personalArray, {
      minOpacity: .5,
      radius: 25,
      blur: 15,
      gradient: {0.5: 'violet', 1: 'purple'}
    });


  // -------------------------------------------
  // GET PROPERTY CRIME DATA AND CREATE HEATMAP LAYER
  // -------------------------------------------

  d3.json("/propmap")
  .then(function(data){

  
    var propertyArray = [];
  
    for (var i = 0; i < data.length; i++) {
      var date = data[i].CrimeDate;
  
      if (date) {
        propertyArray.push([data[i].Latitude, data[i].Longitude]);
      }
    }
    var property = L.heatLayer(propertyArray, {
      minOpacity: .5,
      radius: 25,
      blur: 15,
      gradient: {0.5: 'yellow', 1: 'lime'}
    });
  
  
  // -------------------------------------------
  // GET LARCENY CRIME DATA AND CREATE HEATMAP LAYER
  // -------------------------------------------

  d3.json("/lmap")
  .then(function(data){
  
    var larcenyArray = [];
  
    for (var i = 0; i < data.length; i++) {
      var date = data[i].CrimeDate;
  
      if (date) {
        larcenyArray.push([data[i].Latitude, data[i].Longitude]);
      }
    }
    var larceny = L.heatLayer(larcenyArray, {
      minOpacity: .5,
      radius: 25,
      blur: 15,
      gradient: {0.5: 'lightgray', 1: 'gray'}
    });
  
    // ESTABLISH OVERLAY LAYERS
    var overlayMaps = {
      "CCTV Locations": cameraLayer,
      "Homicides": homicides,
      "Shootings": shootings,
      "Personal Crimes": personal,
      "Property Crimes": property,
      "Larceny": larceny
    };

    // ESTABLISH BASE MAP LAYERS (FOR NOW, JUST THE BASIC STREET MAP)
    var baseMaps = {
      "Streetmap": streetmap
    };
    
    // CREATE THE USER CONTROL TO TOGGLE BETWEEN MAP OPTIONS
    L.control.layers(baseMaps, overlayMaps,{
      collapsed:false, 
      hideSingleBase:true
    }).addTo(myMap);
    // L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  });

  });
  
  });
  
  });

  });

});

