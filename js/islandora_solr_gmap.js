$(document).ready(function() {
  
  // snippet
  //alert('boogie');




  initialize_map();



});

// @TODO: all these settings should be configurable through the admin interface.

function initialize_map() {
  // Give them something to look at while the map loads:
  init_lat_lon = "34.052234,-118.243685";

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
}