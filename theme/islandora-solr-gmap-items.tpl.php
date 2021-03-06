<?php

/**
 * @file islandora-solr-gmap-items.tpl.php
 * Islandora solr search marker items template
 *
 * Variables available:
 * - $variables: all array elements of $variables can be used as a variable. e.g. $base_url equals $variables['base_url']
 * - $base_url: The base url of the current website. eg: http://example.com .
 * - $user: The user object.
 *
 */
?>
<?php if($marker_items): ?>
<ul id="islandora-solr-gmap-items">
  <?php $zebra = 'odd'; ?>
  <?php foreach($marker_items as $item): ?>
     <li class="islandora-solr-gmap-item <?php print $zebra; ?>">
     <?php $zebra = ($zebra == 'odd'? 'even' : 'odd' ); ?>
  
     <?php foreach($item as $key => $value): ?>
       <div class="solr-field">
         <div class="solr-field-title">
           <label><?php print $key; ?></label>
       </div>
         <div class="solr-field-value"><?php print (is_array($value)? implode(', ', $value) : $value); ?></div>
       </div>
    <?php endforeach; ?>
 
   </li>
  <?php endforeach; ?>
</ul>
<?php else: ?>
  <?php print t('No data found'); ?>
<?php endif; ?>