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
  // base url
  global $base_url;
  $variables['base_url'] = $base_url;
  
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
  //$variables['results'] = $response_array['response']['docs'];
 
  //dsm($response_array['response']['docs']);
  
  // about 1ms for an array of 1000
  // about 2ms to create both new arrays.
  // foreach ($response_array['response']['docs'] as $key => $value) {
       //$variables['results'][$value['PID']] = $value;
  //   foreach($solr_fields_array as $val) {
  //     $data[$value['PID']][$val] = $value[$val];
  //   }
  // }
  // this setup ends somewhere between 10 and 12ms.
  
  
  // This is a test to prep the solr coordinate strings into two arrays as floats to check performance.
  // The result for an array with 1000 values is significant: The rendering time for the foreach loop
  // went down from about 10-14ms to 2ms. Also the rounding of the decimals was done upfront.
  // foreach($variables['results'] as $value) {
  //   $coordinates_trim = trim($value['mods_coordinates_s'][0]);
  //   list($first, $second) = explode(' ', $coordinates_trim);
  //   $test_array[] = array(round((float)$first, 6), round((float)$second, 6), 'PID' => 'UCLA-example');
  // }


  // array of solr fields we want to include as data.
  // @TODO: should be configurable in the admin UI.
  $solr_fields_array = array('PID', 'mods_title_s', 'mods_topic_s', 'mods_genre_s');
  
  // start time
   $time = microtime(true);
  
  // from the results only select the PID and latlong coordinates ...and more? -> performance concern here.
  
  // set whatever other data we want to add to the array before the loop
  // @TODO: make this configurable through the admin interface.
//  $data = array('PID' => 'PID', 'title' => 'mods_title_s');
  $latlong = array();
  foreach($response_array['response']['docs'] as $value) {
    // TODO: mods_coordinates_s should be a variable set in the admin settings + the way it is marked up. With or without a comma for example
    
    // If we would skip trim (trim on ingest) we could save another 1ms per array of 1000, but I'll leave it for now.
    $coordinates_trim = trim($value['mods_coordinates_s'][0]);
    
    // $coordinates_array = explode(' ', $coordinates_trim);
    // foreach($coordinates_array as $key => $val) {
    //   $coordinates_array[$key] = round($val, 6);
    // }
    
    // TODO: set the explode value as an admin setting? If so, define the variable BEFORE the loop. Setting to 4 seems pretty doable but 6 might be best.
    // TODO: set refinement value as an admin setting? If so, define the variable BEFORE the loop
    list($first, $second) = explode(' ', $coordinates_trim);
    $coordinates_trim = round((float)$first, 6) . ' ' . round((float)$second, 6);
    //$coordinates_trim = $value[0] . ' ' . $value[1];  // Don't use unless solr values come in two arrays as trimmed and rounded floats.
    
    // not sure if this extra check is a performance hit?
    // note: it is: on an array of 1000 I noticed a difference of about 0.5ms in the end results, so I'm not using it for now.
    // if(!isset($latlong[$coordinates_trim])) {
    //   $latlong[$coordinates_trim] = array();
    // }
       
    //$latlong[$coordinates_trim][] = array('PID' => $value['PID']);
    
    foreach($solr_fields_array as $val) {
      $slr_arr[$val] = $value[$val];
    }  
    
    $latlong[$coordinates_trim][] = $slr_arr;
  }
  // end time
   $endtime = (microtime(true) - $time) * 1000;
  // this setup ends somewhere between 10 and 12ms.
  dsm($endtime);
  //dsm($latlong);
  
  //marker urls
  // @TODO: set custom markers through the admin UI
  // @TODO: create markers with canvas element? -> ability to change colors easily.
  $marker1 = $base_url . '/' . $path . '/images/sprite.png';
  $marker2 = $base_url . '/' . $path . '/images/sprite-selected.png';
  $markers = array($marker1, $marker2);
  
  // fire the php array with coordinates back to javascript as objects.
  drupal_add_js(array('islandora_solr_gmap' => array('latlong' =>$latlong, 'markers' => $markers) ), 'setting');

  //dsm($variables);
}