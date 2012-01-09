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
  <div id="gmap-overlay-wrap">
    <a href="#" id="gmap-overlay-close"><?php print t('X'); ?></a>
    <div id="gmap-overlay"></div>
  </div>
</div>
<?php

$str1 = '[
    {
        "PID": "ucla:3395",
        "mods_title_s": [
            " Dodger fans at Dodger Stadium box office, Calif., 1977"
        ],
        "mods_topic_s": [
            "Baseball fans--California--Los Angeles County",
            "Men--Clothing & dress--California--Los Angeles--1970-1980"
        ],
        "mods_genre_s": [
            "news photographs"
        ]
    }
]';
$str2 = '[
    {
        "PID": "ucla:3868",
        "mods_title_s": [
            " Archbishop John J. Cantwell with children at dedication for Chinese Catholic Social Center, 1942"
        ],
        "mods_topic_s": [
            "Asian American Catholics--California--Los Angeles",
            "Dedications--California--Los Angeles County",
            "Chinese American children--California--Los Angeles County"
        ],
        "mods_genre_s": [
            "news photographs"
        ]
    }
]';

var_dump(json_decode($str1));
var_dump(json_decode($str2));
//dsm(json_decode($str1));
dsm(array(json_decode($str2), json_decode($str2)));

