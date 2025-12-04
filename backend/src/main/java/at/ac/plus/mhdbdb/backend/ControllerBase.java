package at.ac.plus.mhdbdb.backend;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.eclipse.rdf4j.query.QueryLanguage;
import org.eclipse.rdf4j.query.TupleQuery;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.ontotext.graphdb.repository.http.GraphDBHTTPRepository;
import com.ontotext.graphdb.repository.http.GraphDBHTTPRepositoryBuilder;
import org.apache.http.impl.client.HttpClientBuilder;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Base Class for Controllers.
 * Contains methods necessary to run queries
 * @author Clemens Hafner
 */
public class ControllerBase {

    @Value("${target.host}")
    protected String targetHost;

    @Value("${target.repository}")
    protected String targetRepository;

    @Autowired 
    Consumer<HttpClientBuilder> httpClientBuilderConsumer;

    protected String lang = "de";

    private static final Logger logger = LoggerFactory.getLogger(ControllerBase.class);

    /**
     * Returns the predefinde <code>SPARQL</code> namespaces prefixes as string
     * @return The namespace prefixes as <code>String</code>
     */
    protected String getSparqlPrefixes() {
        List<String> prefixes = new ArrayList<String>();
        this.NAMESPACES.forEach((k, v) -> prefixes.add("prefix " + k + ": <" + v + ">"));
        return String.join("\n", prefixes);
    }

    /**
     * Run the query and flush the resutls directly to the requests response
     * @param response the <code>HttpServletResponse</code> used to return the query results (to the browser / requester)
     * @param query The complete query
     * @throws JSONException
     * @throws IOException
     */
    protected void runQuery(HttpServletResponse response, String query) 
    throws JSONException, IOException {
        logger.info("ControllerBase.runQuery query:\n {}", query);
        GraphDBHTTPRepository repository = new GraphDBHTTPRepositoryBuilder()
            .withServerUrl(targetHost)
            .withRepositoryId(targetRepository)
            .withHttpClientSetup(httpClientBuilderConsumer)
            .build();
        RepositoryConnection connection = repository.getConnection();

        TupleQuery tupleQuery = connection.prepareTupleQuery(QueryLanguage.SPARQL, query);
        try {
            OutputStream result = response.getOutputStream();
            tupleQuery.evaluate(new SPARQLResultsJSONWriter(result));
            result.flush();
        } catch (Exception ex) {
            logger.error("Error in query", ex);
            logger.error("query", query);
        }
    }
    /**
     * These are the default namespaces that should be included with every query
     */
    private final Map<String, String> NAMESPACES = new HashMap<String, String>() {{
        put("bf", "http://id.loc.gov/ontologies/bibframe/");
        put("bflc", "http://id.loc.gov/ontologies/bflc/");
        put("cc", "http://creativecommons.org/ns#");
        put("constants", "https://dh.plus.ac.at/constants/");
        put("crm", "http://www.cidoc-crm.org/cidoc-crm/");
        put("dc", "http://purl.org/dc/elements/1.1/");
        put("dct", "http://purl.org/dc/terms/");
        put("dcterms", "http://purl.org/dc/terms/");
        put("decomp", "http://www.w3.org/ns/lemon/decomp#");
        put("dhplusi", "https://dh.plus.ac.at/instance/");
        put("dhpluso", "https://dh.plus.ac.at/ontology#");
        put("dhplusoValidation", "https://dh.plus.ac.at/dhplusoValidation/");
        put("dhplusv", "https://dh.plus.ac.at/vocabulary/");
        put("dnb", "https://d-nb.info/");
        put("dnbt", "https://d-nb.info/standards/elementset/dnb#");
        put("ecrm", "http://erlangen-crm.org/200717/");
        put("foaf", "http://xmlns.com/foaf/0.1/");
        put("geo", "http://www.opengis.net/ont/geosparql#");
        put("gnd", "https://d-nb.info/gnd/");
        put("gndo", "https://d-nb.info/standards/elementset/gnd#");
        put("lexinfo", "http://www.lexinfo.net/ontology/3.0/lexinfo#");
        put("lime", "http://www.w3.org/ns/lemon/lime#");
        put("luc", "http://www.ontotext.com/connectors/lucene#");
        put("luc-index", "http://www.ontotext.com/connectors/lucene/instance#");
        put("mhdbdbi", "https://dh.plus.ac.at/mhdbdb/instance/");
        put("mhdbdbo", "https://dh.plus.ac.at/mhdbdb/ontology#");
        put("mhdbdbxml", "https://mhdbdbd.plus.ac.at/xml-ontology#");
        put("oa", "http://www.w3.org/ns/oa#");
        put("ogcsf", "http://www.opengis.net/ont/sf#");
        put("ontolex", "http://www.w3.org/ns/lemon/ontolex#");
        put("owl", "http://www.w3.org/2002/07/owl#");
        put("parameter", "https://dh.plus.ac.at/parameter-ontology#");
        put("parameteri", "https://dh.plus.ac.at/parameter/");
        put("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        put("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
        put("schema", "http://schema.org/");
        put("sf", "http://www.opengis.net/ont/sf#");
        put("sh", "http://www.w3.org/ns/shacl#");
        put("skos", "http://www.w3.org/2004/02/skos/core#");
        put("szd", "https://gams.uni-graz.at/o,szd.ontology#");
        put("tei", "http://www.tei-c.org/ns/1.0#");
        put("time", "http://www.w3.org/2006/time#");
        put("tmp", "https://dh.plus.ac.at/tmp/");
        put("vann", "http://purl.org/vocab/vann/");
        put("wd", "http://www.wikidata.org/entity/");
        put("wdrs", "http://www.w3.org/2007/05/powder-s#");
        put("wds", "http://www.wikidata.org/entity/statement/");
        put("wdt", "http://www.wikidata.org/prop/direct/");
        put("wdtn", "http://www.wikidata.org/prop/direct-normalized/");
        put("xml", "http://www.w3.org/XML/1998/namespace");
        put("xsd", "http://www.w3.org/2001/XMLSchema#");
    }};
}
