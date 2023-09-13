package at.ac.plus.mhdbdb.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}" })
public class TeiViewController {

    private static final Logger logger = LoggerFactory.getLogger(TeiViewController.class);

    @GetMapping(value = "/showTei", produces = MediaType.APPLICATION_XML_VALUE)
    public String showTei(@RequestParam String id) {
        try {
            // Read the XML file from the server
            String xmlFilePath = "${app.dev.frontend.teiFolder}/${id}.tei.xml"; // Update with the actual file path
            String xmlContent = new String(Files.readAllBytes(Paths.get(xmlFilePath)));

            logger.info("Open " + xmlFilePath);

            // Add the <?xml-stylesheet?> declaration to the XML content
            String modifiedXmlContent = "<?xml-stylesheet type=\"text/xsl\" href=\"/teibp/teibp.xsl\"?>\n" + xmlContent;

            return modifiedXmlContent;
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions accordingly
            return null; // Replace with appropriate error handling
        }
    }

}
