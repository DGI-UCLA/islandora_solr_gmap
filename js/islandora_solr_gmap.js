$(document).ready(function() {
  
  // set and/or populate variables globally
  // latlong object
  lat_lons = Drupal.settings.islandora_solr_gmap.latlong;
  markerUrl = Drupal.settings.islandora_solr_gmap.markers;

  // set map
  initialize_map();
  
  // popup settings
  $('#gmap-overlay, #gmap-overlay-close').click(function() {
    // @TODO: make fade speed configureable through admin interface
    // fadeOut and empty markup
    $('#gmap-overlay-wrap').fadeOut(150, function() {
      $(this).find('#gmap-overlay').html('');
      // This fixes a *very* annoying FF bug where it remembers the last scrollbar position.
      // http://stackoverflow.com/questions/2694243/how-to-reset-persistent-scrollbar-position-after-div-refresh-in-ff3
      $(this).show();
      $('#gmap-overlay').scrollTop(0);
      $(this).hide();
    });
    return false;
  });
});





// @TODO: all these settings should be configurable through the admin interface.

function initialize_map() {
  // Give them something to look at while the map loads:
  // @TODO: set via admin UI
  init_lat_lon = "34.052234,-118.243685";

  // set variables
  var markers = [];
  var marker_icons = [];
  var selected_marker_icons = [];
  var map;
  var bounds = new google.maps.LatLngBounds();
  
  var latlng = new google.maps.LatLng(34.052234,-118.243685);
  var opts = {
    zoom: 14,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: true,
    styles: [
        {
          featureType: "administrative.land_parcel",
          stylers: [
            {visibility: "off"}
          ]
        },{
          featureType: "landscape.man_made",
          stylers: [
            {visibility: "off"}
          ]
        },{
          featureType: "transit",
          stylers: [
            {visibility: "off"}
          ]
        },{
          featureType: "road.highway",
          elementType: "labels",
          stylers: [
            {visibility: "off"}
          ]
        },{
          featureType: "poi.business",
          stylers: [
            {visibility: "off"}
          ]
        }
      ]
  };

  // set map
  map = new google.maps.Map(document.getElementById('islandora-solr-gmap'), opts);
  

  // Create markers for each number.
  marker_icons.push(null);  // it's easier to be 1-based.
  selected_marker_icons.push(null);
  for (var i = 0; i < 100; i++) {
    var num = i + 1;
    var size = (num == 1 ? 9 : (num < 10 ? 13 : (num < 100 ? 25 : 39)));
    marker_icons.push(new google.maps.MarkerImage(
      markerUrl[0],
      new google.maps.Size(size, size),
      new google.maps.Point((i%10)*39, Math.floor(i/10)*39),
      new google.maps.Point((size - 1) / 2, (size - 1)/2)
    ));
    selected_marker_icons.push(new google.maps.MarkerImage(
      markerUrl[1],
      new google.maps.Size(size, size),
      new google.maps.Point((i%10)*39, Math.floor(i/10)*39),
      new google.maps.Point((size - 1) / 2, (size - 1)/2)
    ));
  }
  

  // place markers
  var total = 0;
  var init_marker = null;
  
  // go over each coordinate to create markers
  for (var lat_long in lat_lons) {

    var ll = lat_long.split(" "); // set this in admin settings how this is done.
    //alert(ll);
    var recs = lat_lons[lat_long];
    var recsLength = recs.length;

    // get the title of the first object
    markerTitle = lat_lons[lat_long][0].mods_title_s[0];

    // add a more string if there's more than one image in a marker
    if (recsLength > 1) {
      markerTitle += ' +' + (recsLength -1) + ' ' + Drupal.t('more');
    }

    // set coordinates
    var myLatLng = new google.maps.LatLng(parseFloat(ll[0]), parseFloat(ll[1]));

    // defines a new marker
    marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      flat: true,
      visible: true,
      icon: marker_icons[recsLength > 100 ? 100 : recsLength],
      title: markerTitle
      
    });    
    
    // add this marker to the markers arrray
    markers.push(marker);
    
    // adds to the marker bound
    bounds.extend(myLatLng);

    
    
    (function(lat_long, marker) {
      google.maps.event.addListener(marker, 'click', function() {
        showPopup(lat_long, marker);
      });

      google.maps.event.addListener(marker, 'mouseover', function() {
        showPopupHover(lat_long, marker);
      });

      // @TODO: figure out if popup should be removed on mouseout. Make this optional?
      // @TODO: speed should come from admin configuration
      google.maps.event.addListener(marker, 'mouseout', function() {
        markerOut(150);
      });
    
    })(lat_long, marker);
    
  }
  
  // fit the bounds we created
  map.fitBounds(bounds);
  
}


/**
 * Show Popup
 */
function showPopup(lat_long, marker) {
  // get all objects in clicked coordinates
  var recs = lat_lons[lat_long];
  // new object
  var gmap = new Object();
  // it seems to be important to create a new object and attach the stringified object to it.
  // What didn't seem to work:
  // 'gmap=' + JSON.stringify(recs);
  // gmap['gmap'] = recs;
  gmap['gmap'] = JSON.stringify(recs);

  $.ajax({
    type: "POST",
    url: Drupal.settings.basePath + "islandora-solr-gmap/callback",
    cache: false,
    //data: 'gmap=' + recs,
    //data: 'gmap=' + JSON.stringify(recs),
    data: gmap,
    success: function(data) {
      $("#gmap-overlay").html(data.items);
    },
    dataType: 'json'
  });
  
  // call function to remove the hover popup
  markerOut(0);
 
  // @TODO: make fade speed configureable through admin interface
  // then fadeIn (so the markup doesn't start rendering after the popup load.)
  $('#gmap-overlay-wrap').fadeIn(150);

}




/**
 * Show Popup on Hover
 */
function showPopupHover(lat_long, marker) {
  // get all objects in clicked coordinates
  var recsHover = lat_lons[lat_long];
  // new object
  var gmapHover = new Object();
  
  // limit sent info by one
  var arr = [];
  arr[0] = recsHover[0];
  
  // generate stringified object
  gmapHover['gmapHover'] = JSON.stringify(arr);

  // @TODO: add admin configurable option to show all, first or random object.

  $.ajax({
    type: "POST",
    url: Drupal.settings.basePath + "islandora-solr-gmap/callback-hover",
    cache: false,
    //data: 'gmap=' + recs,
    //data: 'gmap=' + JSON.stringify(recs),
    data: gmapHover,
    success: function(data) {
      $("#gmap-overlay-hover").html(data.items);
    },
    dataType: 'json'
  });
  // @TODO: make fade speed configureable through admin interface
  // then fadeIn (so the markup doesn't start rendering after the popup load.)
  // add .stop() to stop the fading process when hovering lots of markers
  
  $('#gmap-overlay-hover-wrap').stop(true, true).fadeIn(150).hover(
  function() {
    // adding this to fix a bug where when you hover an element that's underneath the popup, but popup fill fade in and out infinitely
    $(this).stop(true, true);
  },
  function() {
    markerOut(150);
  });
}


/**
 * Remove popup on mouseout
 */
function markerOut(speed) {
  
  $('#gmap-overlay-hover-wrap').fadeOut(speed, function() {
    $(this).find('#gmap-overlay-hover').html('');
  });
      
}
