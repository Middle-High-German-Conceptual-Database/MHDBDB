# Get RDF data from MHDBDB

These are instructions and scripts to get RDF data from the MHDBDB to import into a local GraphDB instance.

We can explot the fact that the typeScript frontend of MHDBDB sends `Sparql` querioes directly to the backend to get all RDF triples by simply querying that endpoint using `cURL`.

## Query
```sparql
select * where {?s ?p ?o .} 
```

This is, enhanced by the used namespaces of the project, presisted in `get_all.sparql`

## cURL
curl "https://mhdbdb.sbg.ac.at/repositories/dhPLUS" -X POST --output "nodes.csv" -H "Content-Type: application/sparql-query" -H "Authorization: Basic bWhkYmRiOjJmZmdNRWRUbyNIRA==" --data @get_all.sparql 

This will result in a `CSV` of about 1GB in size.

### Authorization
The `Authorization` header takes its contents from the http basic credentials `mhdbdb:2ffgMEdTo#HD` that are actually hardcoded in **several files** (**TODO:** This is terrible, fix it.)

## CSV2RDF
The python script `csv2rdf.py` (using `pandas` and `rdflib` with `python3`) converts such a CSV to a `turtle` file. It is called with the path of the CSV and the output TTL as parameters:

```bash
python csv2rdf.py /path/to/nodes.csv /path/to/output.ttl
```

It will require about 10GB of runtime memory for the 1GB input file and take quite some time.

## Import to GraphBD
