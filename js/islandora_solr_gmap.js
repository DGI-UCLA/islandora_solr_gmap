$(document).ready(function() {
  
  // snippet
  //alert('boogie');




  initialize_map();



});

// @TODO: all these settings should be configurable through the admin interface.

function initialize_map() {
  // Give them something to look at while the map loads:
  init_lat_lon = "34.052234,-118.243685";

  // latlong object
  var lat_lons = Drupal.settings.islandora_solr_gmap;

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
  
//  var marker = new google.maps.Marker({
//    position: new google.maps.LatLng(34.052234, -118.243685),
//    map: map,
//    title: 'Click Me'
//  });
  
  
  var total = 0;
  var init_marker = null;
  for (var lat_long in lat_lons) {
    //alert(lat_lons[lat_long]);
    
    var ll = lat_lons[lat_long].latlong.split(" "); // set this in admin settings how this is done.
    //var recs = lat_lons[ll];
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(ll[0]), parseFloat(ll[1])),
      map: map,
      flat: true,
      visible: true,
      //icon: marker_icons[recs.length > 100 ? 100 : recs.length],
      title: lat_lons[lat_long].PID
    });
//    markers.push(marker);
//    google.maps.event.addListener(marker, 'click', makeCallback(ll, marker));
    // google.maps.event.addListener(marker, 'mouseover', makePreloadCallback(ll));

//    total += recs.length;

//    if (lat_lon == init_lat_lon) init_marker = marker;
  }
  
  
  
  
}