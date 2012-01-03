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
  
  // D6 doesn't allow adding absolute urls using drupal_add_js
  
  // @TODO: Should be added in admin interface
  $google_key = 'AIzaSyCKGlAsTzJ_KfBZUeNyTflKHKRnktzxAmk';
  
  drupal_set_html_head('<script type="text/javascript" src="http://maps.google.com/maps/api/js?key=' . $google_key . '&sensor=false" ></script>');

  // include gmap js
  $path = drupal_get_path('module', 'islandora_solr_gmap');
  drupal_add_js($path . '/js/islandora_solr_gmap.js');

  // add css
  drupal_add_css($path . '/css/islandora_solr_gmap.css');

}