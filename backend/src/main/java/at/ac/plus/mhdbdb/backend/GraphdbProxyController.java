package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins =  {"${app.dev.frontend.local}"})
public class GraphdbProxyController {

    private static final Logger logger = LoggerFactory.getLogger(GraphdbProxyController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${target.host}")
    private String targetHost;

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

    @RequestMapping(value = "/repositories/dhPLUS/**", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<String> proxy(HttpServletRequest request, @RequestBody(required = false) String body) {
        String requestUrl = targetHost + request.getRequestURI();

        // Log the request URI and method
        logger.info("Request URI: " + request.getRequestURI());
        logger.info("Request Method: " + request.getMethod());
        logger.info("Request Body: " + body);

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
        ResponseEntity<String> response = restTemplate.exchange(requestUrl, HttpMethod.valueOf(request.getMethod()), entity, String.class);

        // Return the response from the target host
        return ResponseEntity.status(response.getStatusCode()).headers(response.getHeaders()).body(response.getBody());
    }

}