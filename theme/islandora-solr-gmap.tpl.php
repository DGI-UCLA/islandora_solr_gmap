<?php

/**
 * @file islandora-solr-gmap.tpl.php
 * Islandora solr search results template
 *
 * Variables available:
 * - $variables: all array elements of $variables can be used as a variable. e.g. $base_url equals $variables['base_url']
 * - $base_url: The base url of the current website. eg: http://example.com .
 * - $user: The user object.
 *
 */
?>
<div id="islandora-solr-gmap-wrap">
  <div id="islandora-solr-gmap"></div>
  <div id="gmap-overlay-hover-wrap">
    <div id="gmap-overlay-hover"></div>
  </div>
  <div id="gmap-overlay-wrap">
    <a href="#" id="gmap-overlay-close"><?php print t('X'); ?></a>
    <div id="gmap-overlay"></div>
  </div>
</div>