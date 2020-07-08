// Global variables
var mapCenter = [114.131459, 22.414532];
var mapZoom = 10.6;


// --------------------------------------------------------
// 1. Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoieHVubGl1IiwiYSI6ImNrMXV5bzV2ZzA0aGUzaG16YWJybHllbjAifQ.11sHwcv-F_pZQpmW5PZxNw'; // replace this value with your own access token from Mapbox Studio

    // for more mapboxgl.Map options, see https://docs.mapbox.com/mapbox-gl-js/api/#map)
    var map = new mapboxgl.Map({
    	container: 'map', // this is the ID of the div in index.html where the map should go
        center: mapCenter, // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
        zoom: mapZoom, // set the default zoom programatically
    	style: 'mapbox://styles/xunliu/ckccq2m896rrz1jnzvd5gzijy', // replace this value with the style URL from Mapbox Studio
    });


// --------------------------------------------------------
// 2. Show a modal window when About button is clicked
// A modal window is an element that sits on top of an application's main window. It can be opened and closed without reloading the page

    $("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
        $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
        $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
    });

    $(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
        $("#screen").fadeToggle();
        $(".modal").fadeToggle();
    });




// -------------------------------------------------------- 
// 5. Popups
// See tutorial at https://docs.mapbox.com/help/tutorials/add-points-pt-3/
// See example of popups on click at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/ 
// See example of popups on hover at https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['Point_O']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stores.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(stores[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Store ID: ' + stores[0].properties.Store + '</h3>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });


// -------------------------------------------------------- 
// 6. Show/hide layers
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]

        ['Point_O', 'PizzaHut'],                      // layers[0]
        ['Point_D', 'Delivery Destinations'],         // layers[1][1] = 'Parks'
        ['Point_D_Heatmap', 'Destination Heatmap'],     
        ['Shops', 'Surrounding Shops'],
        ['Circle_O', 'Value of Each Store'],
        ['Bar_O', 'value of Each Store 3D'],
        ['Optimized_Sample30KOD', 'Original Delivery Routes'],
        ['Optimized_Sample30KO1D', 'Optimized Delivery Routes'],
        ['Buffer_1k', 'Original Location 1k Buffer'],
        ['Buffer_3k', 'Original Location 3k Buffer'],
        ['Newstores', 'Suggested Store Location'],
        ['Newstore_1k', 'Suggested Location 1k Buffer'],
        ['Newstore_3k', 'Suggested Location 3k Buffer']


        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
        
    });






// -------------------------------------------------------- 
// 8. Scroll to zoom through sites
// See example at https://docs.mapbox.com/mapbox-gl-js/example/scroll-fly-to/
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'chapter01': {
            name: "01: Current Problems",
            description: "Current Delivery Locations:<br> This maps shows all currrent delivery locations, while the darker red is the distance to the PizzaHut, radius of each circle represents the value of each delivery.",
            //imagepath: "img/Darden Towe.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 10.6,
            pitch: 0,
            
        },
        'chapter02': {
            name: "",
            description: "Heatmap of Current Delivery Locations:<br>All delivery locations/per delivery are visaulized as heatmap. As many locations have multiple delivery through the survey period.",
            //imagepath: "img/McGuffey Park.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 10.6,
            pitch: 0,
        },
         'chapter03': {
            name: "",
            description: "Current Delivery Locations Changing Through Time:<br> Visualization of current delivery data within 24 hours. You can change the slider to navigate to different time period.",
            //imagepath: "img/McGuffey Park.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 10.6,
            pitch: 0,
        },
        'chapter04': {
            name: "",
            description: "Demand From Different PizzaHut Stores:<br> Different Pizzahut Stores has significant uneven demand for delivery. The radius of the circles shows the total value of all delivery from each Pizzahut Stores",
            //imagepath: "img/McIntire Park.jpg",
            bearing: 17.41,
            center: [114.134088, 22.410199],
            zoom: 11,
            pitch: 60.00,
        },
        'chapter05': {
            name: "",
            description: "Zoomed in to Yuen Long District:<br> Lets zoom in to Yuen Long District to visualize the current delivery systems.",
            //imagepath: "img/McIntire Park.jpg",
            bearing: -8.56,
            center: [114.014922, 22.441275],
            zoom:12.95,
            pitch: 60.00,
        },
        'chapter06': {
            name: "02: An AI Enabled Demand Prediction",
            description: " Delivery Network Optimization System:<br> that integrates internal analysis (e.g. food demand, delivery fleet, inventory capacity, customer profiles) and external analysis about uncertainties and trends.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 11,
            pitch: 0,
        },
        'chapter07': {
            name: "",
            description: "Demand by Regions:<br> Demand by hours and region Food popularity by region Inventory improvements.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 11,
            pitch: 0,
        },
        'chapter08': {
            name: "",
            description: "Delivery Networks:<br>Inefficient dispatch Possibility of shared trips Global optimization.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 11,
            pitch: 0,
        },    
        'chapter09': {
            name: "",
            description: "Service Radius:<br> Inefficient location Possibility of new stores Global optimization.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: -40.54,
            center: [114.197381, 22.352413],
            zoom:11.21,
            pitch: 56.50,
        },  
        'chapter10': {
            name: "03: Solution",
            description: "Suggested Store Locations:<br>",
            //imagepath: "img/Rivanna River.jpg",
            bearing: -40.54,
            center: [114.197381, 22.352413],
            zoom:11.21,
            pitch: 56.50,
        },  
         'chapter11': {
            name: "",
            description: "New Service Radius for Suggested Store Locations:<br>",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 10.6,
            pitch: 0,
        }, 
          'chapter13': {
            name: "",
            description: "New Delivery Networks for Suggested Store Locations:<br>",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [114.131459, 22.414532],
            zoom: 11,
            pitch: 0,
        }

    };

    console.log(chapters['chapter01']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" +"<br>"+ chapters[key]['name'] +"<br><br>"+"</h3>" + "<p>" + chapters[key]['description'] + "</p>"+"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>").appendTo(newChapter);
    }

//If include images
//    for (var key in chapters) {
//        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
//        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
//    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);
        
        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }
    


// -------------------------------------------------------- 
// 9. Reset map button
    
    $("#reset").click(function() {
        map.setFilter("Point_D", null);
        map.setFilter("Point_D_Heatmap", null);
        map.setFilter("YuenLangDistrictO1D", null);
        map.setFilter("YuenLangDistrictOD", null);
        map.setFilter("Optimized_Sample30KO1D", null);
        map.setFilter("Optimized_Sample30KOD", null);

        
        document.getElementById('active-hour').innerText = 'All Day';

        
//        // Reset all layers to visible
//        for (i=0; i<layers.length; i++) {
//            map.setLayoutProperty(layers[i][0], 'visibility', 'visible'); 
//            $("#" + layers[i][0]).addClass('active');
//        }                   

    });


// -------------------------------------------------------- 
// 10. Time Slider
document.getElementById('slider').addEventListener('input', function(e) {
  var hour = parseInt(e.target.value);
  // update the map
  map.setFilter('Point_D', ['==', ['get', 'Hrs'], hour]);
  map.setFilter('Point_D_Heatmap', ['==', ['get', 'Hrs'], hour]);
  map.setFilter('YuenLangDistrictO1D', ['==', ['get', 'Hrs'], hour]);
  map.setFilter('YuenLangDistrictOD', ['==', ['get', 'Hrs'], hour]);
  map.setFilter('Optimized_Sample30KO1D', ['==', ['get', 'Hrs'], hour]);
  map.setFilter('Optimized_Sample30KOD', ['==', ['get', 'Hrs'], hour]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var hour12 = hour % 12 ? hour % 12 : 12;

  // update text in the UI
  document.getElementById('active-hour').innerText = hour12 + ampm;
});

