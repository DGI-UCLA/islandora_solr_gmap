TODO: update README.txt





Notes:

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