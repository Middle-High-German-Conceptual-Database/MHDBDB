package at.ac.plus.mhdbdb.backend;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.oxm.Marshaller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.xml.MarshallingView;

import javax.xml.transform.stream.StreamSource;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
public class TeiViewController {

    @GetMapping(value = "/showTei", produces = MediaType.APPLICATION_XML_VALUE)
    public String showTei(@RequestParam String id) {
        try {
            // Read the XML file from the server
            String xmlFilePath = "${app.dev.frontend.teiFolder}/${id}.tei.xml"; // Update with the actual file path
            String xmlContent = new String(Files.readAllBytes(Paths.get(xmlFilePath)));

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
