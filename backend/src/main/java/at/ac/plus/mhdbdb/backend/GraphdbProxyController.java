package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.ontotext.graphdb.repository.http.GraphDBHTTPRepository;
import com.ontotext.graphdb.repository.http.GraphDBHTTPRepositoryBuilder;
import org.eclipse.rdf4j.query.*;
// use this fully qualified, as Value collides with org.springframework.beans.factory.annotation.Value;
//import org.eclipse.rdf4j.model.Value;
import org.eclipse.rdf4j.repository.RepositoryConnection;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
public class GraphdbProxyController {

    private static final Logger logger = LoggerFactory.getLogger(GraphdbProxyController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${target.host}")
    private String targetHost;

    @Value("${target.repository}")
    private String targetRepository;

    private Map<String, String> getHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            headers.put(headerName, headerValue);
        }
        return headers;
    }

    @RequestMapping(value = "/repositories/dhPLUS/**", method = { RequestMethod.GET, RequestMethod.POST })
    public @ResponseBody String proxy(HttpServletRequest request, @RequestBody(required = false) String body) {
        String requestUrl = targetHost + request.getRequestURI();

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
        List<BindingSet> bindings = new ArrayList<BindingSet>();
        TupleQueryResult tupleQueryResult = tupleQuery.evaluate();
            while (tupleQueryResult.hasNext()) {
                // Each result is represented by a BindingSet, which corresponds to a result row
                BindingSet bindingSet = tupleQueryResult.next();
                bindings.add(bindingSet);
            }

            // Once we are done with a particular result we need to close it
            tupleQueryResult.close();        
        // Convert the response body to a JSON object
        Object responseBody;
        try {
            //responseBody = new ObjectMapper().readValue(response.getBody(), Object.class);
            responseBody = new ObjectMapper().writeValueAsString(bindings);
            /* from reo
            ObjectMapper om = new ObjectMapper();
            JSONObject model = new JSONObject();
            model.put("attachments", new JSONArray(om.writeValueAsString(attachments)));
            */
        } catch (JsonProcessingException e) {
            // logger.error("Error parsing response body to JSON", e);
            responseBody = Collections.singletonMap("error", "Failed to parse response body");
        }

        // Return the response from the target host
        //return ResponseEntity.status(response.getStatusCode()).headers(response.getHeaders()).body(responseBody);
        return responseBody.toString();
    }
    /*
    @RequestMapping(value = "/repositories/dhPLUS/**", method = { RequestMethod.GET, RequestMethod.POST })
    public ResponseEntity<Object> proxy(HttpServletRequest request, @RequestBody(required = false) String body) {
        String requestUrl = targetHost + request.getRequestURI();

        // Log the request URI and method
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("Request Method: " + request.getMethod());
        // logger.info("Request Body: " + body);

        // Get headers from the original request and add them to the outgoing request
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            headers.add(headerName, headerValue);

            // Log the headers
            logger.info("Header: " + headerName + " Value: " + headerValue);
        }

        // Forward the request to the target host
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        logger.info("Sending request with body: " + body);

        ResponseEntity<String> response = null;

        try {
            response = restTemplate.exchange(requestUrl, HttpMethod.valueOf(request.getMethod()), entity, String.class);
        } catch (HttpClientErrorException e) {
            // logger.error("HTTP Client Error: " + e.getResponseBodyAsString());
            // Handle the error and return the error response
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            // logger.error("Unexpected error: " + e.getMessage());
            // Return a generic error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }

        // Convert the response body to a JSON object
        Object responseBody;
        try {
            responseBody = new ObjectMapper().readValue(response.getBody(), Object.class);
        } catch (JsonProcessingException e) {
            // logger.error("Error parsing response body to JSON", e);
            responseBody = Collections.singletonMap("error", "Failed to parse response body");
        }

        // Return the response from the target host
        return ResponseEntity.status(response.getStatusCode()).headers(response.getHeaders()).body(responseBody);
    }
    */
}