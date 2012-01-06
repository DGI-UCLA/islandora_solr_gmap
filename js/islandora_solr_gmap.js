$(document).ready(function() {
  
  // snippet
  //alert('boogie');




  initialize_map();



});

// @TODO: all these settings should be configurable through the admin interface.

function initialize_map() {
  // Give them something to look at while the map loads:
  init_lat_lon = "34.052234,-118.243685";

  // set and/or populate variables
  // latlong object
  var lat_lons = Drupal.settings.islandora_solr_gmap.latlong;
  var markerUrl = Drupal.settings.islandora_solr_gmap.markers;

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
      markerTitle += ' ' + Drupal.t('(+@variable more)', { '@variable': (recsLength -1) });
    }

    marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(ll[0]), parseFloat(ll[1])),
      map: map,
      flat: true,
      visible: true,
      icon: marker_icons[recsLength > 100 ? 100 : recsLength],
      title: markerTitle
    });
    
//    markers.push(marker);
//    google.maps.event.addListener(marker, 'click', makeCallback(ll, marker));
    // google.maps.event.addListener(marker, 'mouseover', makePreloadCallback(ll));

//    total += recs.length;

//    if (lat_lon == init_lat_lon) init_marker = marker;
  }
  
  
  
  
}