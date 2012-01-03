<?php

/**
 * @file
 * contains methods to search solr and display results.  depends on Apache_Solr_Php client.
 */

module_load_include('inc', 'islandora_solr_search', 'IslandoraSolrResults');

/**
 * Extention of IslandoraSolrResults for templating purposes.
 * This overrides the displayResults function to provide an alternate display type.
 */

class IslandoraSolrResultsGmap extends IslandoraSolrResults {

  
  
  
  static $facetSeparator = '~';//used to separate facets in url
  static $slashReplacement = '~slsh~';// a pattern used to replace / in url's the slash breaks drupal clean url's
  public static $SEARCH_CLASS_ADVANCED_SEARCH_NUMBER_FIELDS = 5;
  function IslandoraSolrResultsGmap() {
    parent::__construct();
    //module_load_include('php', 'islandora_solr_search', 'Solr/Service');
  }

  /**
   * Outputs results in unified tabular format.
   *
   * This function collects all field names from all results in the 
   * resultset and constructs a single table with said field names in 
   * a unified header row, rather than outputting each result as a 
   * miniature horizontal table.
   *
   * @param $results
   *   A solr resultset object.
   *
   * @return
   *   html output for the resultset. Note: we currently create this 
   *   output manually, should refactor to use drupal forms api.
   */
  function printResults($results) {
    dsm($results);
    if ( variable_get('islandora_solr_search_debug_mode', 0) ) {
      // debug dump
      $results_r .= "<pre>Results: " . print_r($results, TRUE) . "</pre>";
      $fieldset_r = array(
        '#title' => t("Raw Results"),                                                                                                                                             
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#value' => $results_r,
        );
      $output .= theme('fieldset', $fieldset_r);
    }

    $results_raw = $results;
    $output = theme('islandora_solr_gmap', $results_raw);
    
    return $output;
  }

  
  
  /**
* Function: displayFacets
*
* Description: Displays basic facets based on an apache solr query response,
* as contained with the IslandoraSolrQueryProcessor.
*
* @global string $base_url
* @param IslandoraSolrQueryProcessor $solrQueryProcessor
* @return string
*/
  function displayFacets($solrQueryProcessor) {
    dsm($solrQueryProcessor);
    
    
  }
  
  
  
}


