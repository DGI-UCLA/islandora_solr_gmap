@TODO: add cluster markers
@TODO: when clicking a marker, bring it to front
@TODO: show a little preview box on hover.
@TODO: add shortcut links to quickly switch positioning and zoom level within
the google map. For example: one link can show an overview of the US, while
another link can zoom into the LA city hall area.
@TODO: When switching to gmap display after paged display, the gmap results will
not render (there is no page 2 in Gmap). Check if we can prevent this. Normally
there will be a link to switch that doesn't include a page parameter in the url.
TODO: notes on performance and the preprocess function
@TODO: update README.txt


Credits:
========
Credits and thanks go out to @danvdk and @ravejk who created http://www.oldsf.org. Old Sf was an source of inspiration for this module.

Short description:
==================

The islandora_solr_gmap module enables the ability to display solr results on
a google map for those that contain coordinates.

Notes:
======

The minimal need to populate a map are coordinates in an array. When we want to
use the data related to these coordinates the minimum requirement is to add a
unique ID to it. The PID in the case of Islandora. Currently we're adding all
additional data to this large array as siblings of the unique ID. It works well
for now, but I'm still not 100% sure if it will scale. Another approach could be
to pull in the additional data using ajax.

I'm placing some suggestions here:

Based on the ID (PID) we can do a single solr call to retrieve the table row.
example: http://localhost:8080/solr/select?q=PID:"namespace:1000"
And then grab the preferred values
http://www.w3schools.com/xml/tryit.asp?filename=tryxml_dom_getelement
similar:
http://labs.adobe.com/technologies/spry/samples/data_region/FilterXPath_with_params.html
http://labs.adobe.com/technologies/spry/data/employees-01.xml

We can also call the Islandora API, but there is currently no dependency on Islandora
and I would like to keep it that way as much as possible.



