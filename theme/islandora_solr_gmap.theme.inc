<?php

/**
 * @file
 * This file holds all of islandora_solr_gmap's theme functions
 */
 

/**
  * Theme function for theming the solr search results
  *
  * @param $results
  * The raw search results
  *
  * @return variables to be used in the template file.
  */
  
function islandora_solr_gmap_preprocess_islandora_solr_gmap(&$variables) {
  
  // Connect to google maps API
  // D6 doesn't allow adding absolute urls using drupal_add_js
  // @TODO: Should be added in admin interface + Figure out why I would need a key if it works without it.
  //$google_key = 'AIzaSyCKGlAsTzJ_KfBZUeNyTflKHKRnktzxAmk';
  //drupal_set_html_head('<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=' . $google_key . '&sensor=false" ></script>');
  drupal_set_html_head('<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false" ></script>');

  // include gmap js
  $path = drupal_get_path('module', 'islandora_solr_gmap');
  drupal_add_js($path . '/js/islandora_solr_gmap.js');

  // add css
  drupal_add_css($path . '/css/islandora_solr_gmap.css');

  // get the raw solr response
  $raw_response = $variables['results_raw']->getRawResponse();
  // turn raw response's json into a php array
  $response_array = json_decode($raw_response, true);
  // select the actual results only and make them available in the template file.
  $variables['results'] = $response_array['response']['docs'];
 
  // from the results only select the PID and latlong coordinates
  $latlong = array();
  foreach($variables['results'] as $value) {
    // TODO: mods_coordinates_s should be a variable set in the admin settings + the way it is marked up. With or without a comma for example
    $latlong[] = array('latlong' => trim($value['mods_coordinates_s'][0]), 'PID' => $value['PID']);
  }

  // fire the php array with coordinates back to javascript as objects.
  drupal_add_js(array('islandora_solr_gmap' => $latlong ), 'setting');
  
  
  
  
  //dsm($variables);
  
}