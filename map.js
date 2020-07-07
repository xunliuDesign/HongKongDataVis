// Global variables
var mapCenter = [114.169028, 22.372134];
var mapZoom = 10.57;


// --------------------------------------------------------
// 1. Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoieHVubGl1IiwiYSI6ImNrMXV5bzV2ZzA0aGUzaG16YWJybHllbjAifQ.11sHwcv-F_pZQpmW5PZxNw'; // replace this value with your own access token from Mapbox Studio

    // for more mapboxgl.Map options, see https://docs.mapbox.com/mapbox-gl-js/api/#map)
    var map = new mapboxgl.Map({
    	container: 'map', // this is the ID of the div in index.html where the map should go
        center: mapCenter, // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
        zoom: mapZoom, // set the default zoom programatically
    	style: 'mapbox://styles/xunliu/ckcc88mte1thp1imk87qlle7l', // replace this value with the style URL from Mapbox Studio
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

        ['Point_O', 'Pizza Hut'],                      // layers[0]
        ['Point_D', 'Delivery Destinations'],         // layers[1][1] = 'Parks'
        ['Point_D_Heatmap', 'Destination Heatmap'],     
        ['Shops', 'Surrounding Shops'],
        // add additional live data layers here as needed
    ]; 

    // functions to perform when map loads
    map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
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
            name: "01_Overview",
            description: "Ut nisl quam, fringilla efficitur elementum in, congue vel mi. Nullam consequat pharetra nibh, non accumsan nisl cursus sed. Pellentesque at ex lacus. Ut fringilla nunc id leo maximus ullamcorper. Donec volutpat placerat accumsan. Nulla id luctus diam. Aliquam tincidunt pulvinar mattis. Donec tempor, massa vel vehicula feugiat, diam sem suscipit nisi, eu tempor turpis lorem ac ipsum. Proin quis lectus mattis enim luctus faucibus sit amet vel metus. Etiam luctus nunc eget velit vestibulum posuere. Maecenas enim velit, elementum a suscipit vel, bibendum in odio. Nunc porta, eros nec vehicula pretium, tellus sapien fermentum risus, a pulvinar elit libero ut nisi. Nunc interdum lacus eu ornare dapibus. Suspendisse vitae diam eu turpis venenatis tempor. Ut sodales vel ex finibus facilisis. Nunc hendrerit, augue eget vulputate pellentesque, nibh erat imperdiet justo, id iaculis risus sem commodo urna.",
            //imagepath: "img/Darden Towe.jpg",
            bearing: 0,
            center: [114.067240, 22.464007],
            zoom: 12,
            pitch: 0,
            layersVis:['Point_D','Circle_O'],
            
        },
        'chapter02': {
            name: "02_Zoom in",
            description: "Aliquam mollis consequat libero, at egestas mi facilisis in. Maecenas sed porta arcu, nec mattis ligula. Sed a porta arcu. Aliquam vel nulla ac orci volutpat ullamcorper. Duis quis auctor urna. Duis id felis vel velit sagittis bibendum. Praesent rutrum velit vel est iaculis, et viverra sapien placerat. Suspendisse potenti. In interdum eu lorem ac cursus. Integer pulvinar lacus nec metus consequat vehicula. Aliquam efficitur vitae neque sed aliquam. Fusce interdum tempor neque vel interdum. Praesent dapibus sollicitudin arcu id finibus. Mauris risus magna, egestas in tristique et, egestas id arcu. Proin leo urna, sollicitudin non mattis in, tempor non nisi. Praesent commodo nibh sit amet dapibus egestas.",
            //imagepath: "img/McGuffey Park.jpg",
            bearing: 68,
            center: [114.010026, 22.429198],
            zoom: 11.87,
            pitch: 50,
            layersVis:['Point_D','Circle_O'],

        },
        'chapter03': {
            name: "03???",
            description: "Fusce iaculis nulla ut augue posuere, sit amet vestibulum quam elementum. Integer quis varius sem. Mauris fermentum tempus congue. Nulla facilisi. Vestibulum congue cursus tempor. Sed sit amet venenatis magna. Duis fermentum ligula eget auctor eleifend. Aenean ullamcorper arcu et diam pharetra, a pretium lectus porttitor. Donec non lacinia est. Nullam nec felis turpis. Curabitur hendrerit porta dolor, vitae vehicula est dictum id. Ut sollicitudin lectus est, et egestas felis tempus eu. Sed at dictum ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam et diam rutrum orci placerat euismod quis vitae dui. Praesent aliquam, quam ac suscipit laoreet, metus nulla mattis justo, et egestas lectus eros ac nulla.",
            //imagepath: "img/McIntire Park.jpg",
            bearing: 20,
            center: [ 113.989629, 22.429796],
            zoom: 15,
            pitch: 50,
            layersVis:['Point_D','Circle_O'],

        },
        'chapter04': {
            name: "04???",
            description: "Aenean rutrum finibus ex, quis mollis ante eleifend in. Vestibulum faucibus augue tellus, ac auctor tellus maximus sit amet. Nulla quis rutrum felis. Nullam a facilisis mi, in pretium orci. Vestibulum tempus odio et accumsan lacinia. Duis tempus, dolor sit amet tristique tempus, nisl neque tristique lacus, quis viverra est risus id quam. Donec condimentum massa vitae dui consectetur vehicula. Vivamus interdum nisi sed blandit fermentum. Proin a magna et est varius euismod non quis turpis. Cras rhoncus, nulla non faucibus vestibulum, felis nunc finibus nisi, dictum sollicitudin nibh leo non lorem. Donec ut nulla id nunc elementum luctus. Fusce sed justo ac metus pretium auctor ut eget magna. Vestibulum rhoncus nibh sit amet varius tincidunt.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [ 113.989629, 22.429796],
            zoom: 16.13,
            pitch: 25
        },
        'chapter05': {
            name: "05???",
            description: "Aenean rutrum finibus ex, quis mollis ante eleifend in. Vestibulum faucibus augue tellus, ac auctor tellus maximus sit amet. Nulla quis rutrum felis. Nullam a facilisis mi, in pretium orci. Vestibulum tempus odio et accumsan lacinia. Duis tempus, dolor sit amet tristique tempus, nisl neque tristique lacus, quis viverra est risus id quam. Donec condimentum massa vitae dui consectetur vehicula. Vivamus interdum nisi sed blandit fermentum. Proin a magna et est varius euismod non quis turpis. Cras rhoncus, nulla non faucibus vestibulum, felis nunc finibus nisi, dictum sollicitudin nibh leo non lorem. Donec ut nulla id nunc elementum luctus. Fusce sed justo ac metus pretium auctor ut eget magna. Vestibulum rhoncus nibh sit amet varius tincidunt.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [ 113.989629, 22.429796],
            zoom: 16.13,
            pitch: 25
        },
        'chapter06': {
            name: "06???",
            description: "Aenean rutrum finibus ex, quis mollis ante eleifend in. Vestibulum faucibus augue tellus, ac auctor tellus maximus sit amet. Nulla quis rutrum felis. Nullam a facilisis mi, in pretium orci. Vestibulum tempus odio et accumsan lacinia. Duis tempus, dolor sit amet tristique tempus, nisl neque tristique lacus, quis viverra est risus id quam. Donec condimentum massa vitae dui consectetur vehicula. Vivamus interdum nisi sed blandit fermentum. Proin a magna et est varius euismod non quis turpis. Cras rhoncus, nulla non faucibus vestibulum, felis nunc finibus nisi, dictum sollicitudin nibh leo non lorem. Donec ut nulla id nunc elementum luctus. Fusce sed justo ac metus pretium auctor ut eget magna. Vestibulum rhoncus nibh sit amet varius tincidunt.",
            //imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [ 113.989629, 22.429796],
            zoom: 16.13,
            pitch: 25
        }
    };

    console.log(chapters['chapter01']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h3>" + chapters[key]['name'] + "</h3>" + "<p>" + chapters[key]['description'] + "</p>"+"<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>").appendTo(newChapter);
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
 