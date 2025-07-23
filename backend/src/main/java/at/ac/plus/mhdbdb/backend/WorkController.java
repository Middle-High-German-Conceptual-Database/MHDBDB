package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;

import com.ontotext.graphdb.repository.http.GraphDBHTTPRepository;
import com.ontotext.graphdb.repository.http.GraphDBHTTPRepositoryBuilder;
import org.eclipse.rdf4j.query.*;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.json.JSONException;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
@RequestMapping("/api/v1/works")
public class WorkController extends ControllerBase {
    // TODO: This Controller shall list works ('search') and return details ('detail') for works

    private static final Logger logger = LoggerFactory.getLogger(WorkController.class);

    @RequestMapping(value = "/search", method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json")
    public @ResponseBody void search(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = false) String body) 
    throws JSONException, IOException {
        logger.info("WorkController.proxy start!");

        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append("select distinct ?id ?label ?sameAs ?instance ?authorLabel where {")
            .append("?id rdfs:label ?label .")
            .append("?id owl:sameAs ?sameAs .")
            .append("?id dhpluso:contribution/dhpluso:agent/rdfs:label ?authorLabel .")
            .append("?id dhpluso:hasExpression/dhpluso:hasInstance ?instance .")
            .append("filter(langMatches( lang(?label), \"de\" ))")
            .append("filter(langMatches( lang(?authorLabel), \"de\" ))")
            .append("}")
            .append("ORDER BY ASC(?label)")
            .toString();

        GraphDBHTTPRepository repository = new GraphDBHTTPRepositoryBuilder()
            .withServerUrl(targetHost)
            .withRepositoryId(targetRepository)
            .build();
        RepositoryConnection connection = repository.getConnection();

        TupleQuery tupleQuery = connection.prepareTupleQuery(QueryLanguage.SPARQL, query);
        try {
            OutputStream result = response.getOutputStream();
            tupleQuery.evaluate(new SPARQLResultsJSONWriter(result));
            result.flush();
        } catch (Exception ex) {
            logger.error("Error in query", ex);
            logger.error(body);
        }
    }
}