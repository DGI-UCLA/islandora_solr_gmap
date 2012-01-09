$(document).ready(function() {
  
  // set and/or populate variables globally
  // latlong object
  lat_lons = Drupal.settings.islandora_solr_gmap.latlong;
  markerUrl = Drupal.settings.islandora_solr_gmap.markers;

  // set map
  initialize_map();
  
  // popup settings
  $('#gmap-overlay, #gmap-overlay-close').click(function() {
    // fadeOut and empty markup
    $('#gmap-overlay-wrap').fadeOut(200, function() {
      
      $(this).find('#gmap-overlay').html('');
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
  for (var lat_long in lat_lons) {
        
    var ll = lat_long.split(" "); // set this in admin settings how this is done.
    //alert(ll);
    var recs = lat_lons[lat_long];
    var recsLength = recs.length;

    markerTitle = lat_lons[lat_long][0].mods_title_s[0];

    if (recsLength > 1) {
      markerTitle += ' ' + Drupal.t('(+@variable more)', {'@variable': (recsLength -1)});
    }

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(ll[0]), parseFloat(ll[1])),
      map: map,
      flat: true,
      visible: true,
      icon: marker_icons[recsLength > 100 ? 100 : recsLength],
      title: markerTitle
    });
    
    markers.push(marker);
    
    (function(lat_long, marker) {
    google.maps.event.addListener(marker, 'click', function() {
      showPopup(lat_long, marker);
    });
    
    })(lat_long, marker);
    // google.maps.event.addListener(marker, 'mouseover', makePreloadCallback(ll));
    
//    total += recs.length;

//    if (lat_lon == init_lat_lon) init_marker = marker;
  }
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
    url: "/islandora-solr-gmap/callback",
    cache: false,
    //data: 'gmap=' + recs,
    //data: 'gmap=' + JSON.stringify(recs),
    data: gmap,
    success: function(data) {
      //alert(data);
      $("#gmap-overlay").html(data.items);
    },
    dataType: 'json'
  });
  
//   $.post("islandora-solr-gmap/callback", recs,
//   function(data){
//     alert(data);
//   }, "html");
  
  
  // then fadeIn (so the markup doesn't start rendering after the popup load.)
  $('#gmap-overlay-wrap').fadeIn(200);
  
  //infowindow.open(lat_lon, marker);
  
  
  
}


function htmlEncode(value){
  //return $('<div/>').text(value).html();
return String(value).replace('&', '&amp;');
}
