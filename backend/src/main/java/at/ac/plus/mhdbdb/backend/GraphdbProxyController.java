package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.io.OutputStream;



import com.ontotext.graphdb.repository.http.GraphDBHTTPRepository;
import com.ontotext.graphdb.repository.http.GraphDBHTTPRepositoryBuilder;
import org.eclipse.rdf4j.query.*;
import org.eclipse.rdf4j.query.resultio.sparqljson.SPARQLResultsJSONWriter;
import org.eclipse.rdf4j.repository.RepositoryConnection;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
public class GraphdbProxyController {

    private static final Logger logger = LoggerFactory.getLogger(GraphdbProxyController.class);

    @Value("${target.host}")
    private String targetHost;

    @Value("${target.repository}")
    private String targetRepository;

    @RequestMapping(value = "/repositories/dhPLUS/**", method = { RequestMethod.GET, RequestMethod.POST }, produces = "application/json")
    public @ResponseBody void proxy(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = false) String body) {
        // Log the request URI and method
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("Request Method: " + request.getMethod());
        // taken from https://graphdb.ontotext.com/documentation/11.0/helloworld.html

        GraphDBHTTPRepository repository = new GraphDBHTTPRepositoryBuilder()
            .withServerUrl(targetHost)
            .withRepositoryId(targetRepository)
            .build();
        RepositoryConnection connection = repository.getConnection();

        TupleQuery tupleQuery = connection.prepareTupleQuery(QueryLanguage.SPARQL, body);
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