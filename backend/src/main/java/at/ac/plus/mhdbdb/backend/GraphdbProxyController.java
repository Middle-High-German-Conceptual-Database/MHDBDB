package at.ac.plus.mhdbdb.backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import org.json.JSONException;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
public class GraphdbProxyController extends ControllerBase {

    private static final Logger logger = LoggerFactory.getLogger(GraphdbProxyController.class);

    @RequestMapping(value = "/repositories/dhPLUS/**", method = { RequestMethod.GET, RequestMethod.POST }, produces = "application/json")
    public @ResponseBody void proxy(HttpServletResponse response, HttpServletRequest request, @RequestBody(required = true) String body) 
    throws JSONException, IOException {
        // we add the prefixes and the SELECT here, ensuring that at least simple DELETEs and UPDATEs will fail 
        String query = new StringBuilder()
            .append(this.getSparqlPrefixes())
            .append(System.lineSeparator() + " SELECT ").append(body)
            .toString();
        runQuery(response, query);
    }
}