package at.ac.plus.mhdbdb.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.dev.frontend.teiFolder}")
    private String teiFolder;

    @GetMapping(value = "/showTei", produces = MediaType.APPLICATION_XML_VALUE)
    public String showTei(@RequestParam String id) {
        try {
            // Read the XML file from the server
            String xmlFilePath = teiFolder + "/" + id + ".tei.xml"; // Update with the actual file path
            String xmlContent = new String(Files.readAllBytes(Paths.get(xmlFilePath)));

            logger.info("Open " + xmlFilePath);

            // Split the XML content by new lines
            String[] lines = xmlContent.split("\n", 2);

            // Insert the <?xml-stylesheet?> declaration after the first line of the XML
            // content
            String modifiedXmlContent;
            if (lines.length >= 2) {
                modifiedXmlContent = lines[0] + "\n"
                        + "<?xml-stylesheet type=\"text/xsl\" href=\"/content/teibp.xsl\"?>\n" + lines[1];
            } else {
                // If there's only one line (or none), append the stylesheet declaration
                // directly
                modifiedXmlContent = xmlContent
                        + "<?xml-stylesheet type=\"text/xsl\" href=\"/content/teibp.xsl\"?>\n";
            }

            return modifiedXmlContent;
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions accordingly
            return null; // Replace with appropriate error handling
        }
    }

}
