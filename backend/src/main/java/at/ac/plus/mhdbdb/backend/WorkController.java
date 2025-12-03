package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import com.ontotext.graphdb.repository.http.GraphDBHTTPRepository;
import com.ontotext.graphdb.repository.http.GraphDBHTTPRepositoryBuilder;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.rdf4j.model.Value;
import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.QueryLanguage;
import org.eclipse.rdf4j.query.TupleQuery;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.json.JSONException;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
@RequestMapping("/api/v1/works")
public class WorkController extends ControllerBase {

    private static final Logger logger = LoggerFactory.getLogger(WorkController.class);

    @RequestMapping(value = "/query", method = {RequestMethod.POST}, produces = "application/json")
    public @ResponseBody void query(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = false) String body) 
    throws JSONException, IOException {

        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + " SELECT ").append(body)
            .toString();
        
        runQuery(response, query);
    }

    @RequestMapping(value = "/list", method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json")
    public @ResponseBody void search(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = false) String body) 
    throws JSONException, IOException {

        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + "select distinct ?id ?label ?sameAs ?instance ?authorLabel where {")
            .append(System.lineSeparator() + "  ?id rdfs:label ?label .")
            .append(System.lineSeparator() + "  ?id owl:sameAs ?sameAs .")
            .append(System.lineSeparator() + "  ?id dhpluso:contribution/dhpluso:agent/rdfs:label ?authorLabel .")
            .append(System.lineSeparator() + "  ?id dhpluso:hasExpression/dhpluso:hasInstance ?instance .")
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?label), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?authorLabel), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + "}")
            .append(System.lineSeparator() + "ORDER BY ASC(?label)")
            .toString();

        runQuery(response, query);
    }

    @RequestMapping(value = "/seriesParents", method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json")
    public @ResponseBody void getSeriesParentList(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = false) String body) 
    throws JSONException, IOException {

        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + "select distinct ?id ?label where {")
            .append(System.lineSeparator() + "  ?id skos:topConceptOf <https://dhplus.sbg.ac.at/mhdbdb/instance/textreihentypologie> .")
            .append(System.lineSeparator() + "  ?id rdf:type skos:Concept .")
            .append(System.lineSeparator() + "  ?id skos:prefLabel ?label .")
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?label), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + "}")
            .toString();

        runQuery(response, query);
    }

    @RequestMapping(value = "/series", method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json")
    public @ResponseBody void getSeriesList(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = true) String parent) 
    throws JSONException, IOException {

        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + "select distinct ?id ?label where {")
            .append(System.lineSeparator() + String.format("  ?id skos:broader <%s> .", parent))
            .append(System.lineSeparator() + "  ?id rdf:type skos:Concept .")
            .append(System.lineSeparator() + "  ?id skos:prefLabel ?label .")
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?label), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + "}")
            .toString();

        runQuery(response, query);
    }

    
    @RequestMapping(value = "/metadata", method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json")
    public @ResponseBody void getWorkMetadata(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = true) String workId) 
    throws JSONException, IOException {

        // TODO: Wait for a *nice* String Template functionality in Java
        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + "select distinct ?id ?label ?sameAs ?dateOfCreation ?authorId ?authorSameAs ?authorLabel ?authorRole ?instance ?instanceLabel ?expression ?expressionLabel ?genreForm ?genreFormMainParent ?bibTitle ?bibPlace ?bibAgent ?bibDate where {")
            .append(System.lineSeparator() + String.format("Bind(mhdbdbi:%s AS ?id) .", workId))
            .append(System.lineSeparator() + "?id rdfs:label ?label .")
            .append(System.lineSeparator() + "?id owl:sameAs ?sameAs .")
            .append(System.lineSeparator() + "?id dcterms:created ?dateOfCreation .")
            .append(System.lineSeparator() + "?id dhpluso:contribution/dhpluso:agent ?authorId .")
            .append(System.lineSeparator() + "?id dhpluso:contribution/dhpluso:role <http://id.loc.gov/vocabulary/relators/aut> .")
            .append(System.lineSeparator() + "?id dhpluso:contribution/dhpluso:agent/rdfs:label ?authorLabel .")
            .append(System.lineSeparator() + "?id dhpluso:contribution/dhpluso:agent/owl:sameAs ?authorSameAs .")
            .append(System.lineSeparator() + "?id dhpluso:hasExpression/dhpluso:hasInstance ?instance .")
            .append(System.lineSeparator() + "?instance rdf:type dhpluso:Electronic .")
            .append(System.lineSeparator() + "?instance rdfs:label ?instanceLabel .")
            .append(System.lineSeparator() + "OPTIONAL {")
            .append(System.lineSeparator() + "  ?id dhpluso:hasExpression ?expression .")
            .append(System.lineSeparator() + "  ?expression rdfs:label ?expressionLabel .")
            .append(System.lineSeparator() + "}")
            .append(System.lineSeparator() + "OPTIONAL { ?id dhpluso:genreForm/skos:prefLabel ?genreForm . }")
            .append(System.lineSeparator() + "OPTIONAL { ?id dhpluso:genreFormMainparent/skos:prefLabel ?genreFormMainParent . }")
            .append(System.lineSeparator() + "OPTIONAL {")
            .append(System.lineSeparator() + "  ?bibId bf:instanceOf ?id .")
            .append(System.lineSeparator() + "  ?bibId bf:title/bf:mainTitle ?bibTitle .")
            .append(System.lineSeparator() + "  ?bibId bf:provisionActivity ?bibProvisionActivity .")
            .append(System.lineSeparator() + "  ?bibProvisionActivity bf:place/rdfs:label ?bibPlace .")
            .append(System.lineSeparator() + "  ?bibProvisionActivity bf:agent/rdfs:label ?bibAgent .")
            .append(System.lineSeparator() + "  ?bibProvisionActivity bf:date ?bibDate .")
            .append(System.lineSeparator() + "}")
            // filter
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?genreForm), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?genreFormMainParent), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?label), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?expressionLabel), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?instanceLabel), \"%s\" ))", this.lang))
            .append(System.lineSeparator() + String.format("  filter(langMatches( lang(?authorLabel), \"%s\" ))", this.lang))

            .append(System.lineSeparator() + "}")
            .toString();

        runQuery(response, query);
    }

    protected TupleQuery loadQuery(String query)
    throws JSONException, IOException {
        logger.info("WorkController.loadQuery query:\n {}", query);
        GraphDBHTTPRepository repository = new GraphDBHTTPRepositoryBuilder()
            .withServerUrl(targetHost)
            .withRepositoryId(targetRepository)
            .build();
        RepositoryConnection connection = repository.getConnection();

        return connection.prepareTupleQuery(QueryLanguage.SPARQL, query);
    }
}