package at.ac.plus.mhdbdb.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.ProcessingInstruction;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}" })
public class TeiViewController {

    private static final Logger logger = LoggerFactory.getLogger(TeiViewController.class);

    @Value("${app.dev.frontend.teiFolder}")
    private String teiFolder;

    @Value("${app.dev.frontend.additionalXmlPath}")
    private String additionalXmlPath;

    @GetMapping(value = "/showTei", produces = MediaType.APPLICATION_XML_VALUE)
    public String showTei(@RequestParam String id) {
        try {
              // Read and parse the main XML file
        String xmlFilePath = teiFolder + "/" + id + ".tei.xml";
        Document mainDoc = loadXmlDocument(xmlFilePath);

        // Add the XML processing instruction
        ProcessingInstruction pi = mainDoc.createProcessingInstruction("xml-stylesheet", "type=\"text/xsl\" href=\"/content/teibp.xsl\"");
        mainDoc.insertBefore(pi, mainDoc.getDocumentElement());

        // Read and parse the additional XML file
        Document additionalDoc = loadXmlDocument(additionalXmlPath);

        // Append the content of the additional XML to the teiHeader of the main XML
        Node teiHeader = mainDoc.getElementsByTagName("tei:teiHeader").item(0);
        Node importedNode = mainDoc.importNode(additionalDoc.getDocumentElement(), true);
        teiHeader.appendChild(importedNode);

        // Serialize the modified XML back to string
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        StringWriter writer = new StringWriter();
        transformer.transform(new DOMSource(mainDoc), new StreamResult(writer));

        return writer.getBuffer().toString();
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions accordingly
            return null; // Replace with appropriate error handling
        }
    }

    @GetMapping(value = "/showTeiAsHtml", produces = MediaType.TEXT_HTML_VALUE)
    public String showTeiAsHtml(@RequestParam String id) {
        try {
              // Read and parse the main XML file
        String xmlFilePath = teiFolder + "/" + id + ".tei.xml.html";
    
        
        // open file from xmlFilePath into string variable
        String content = new String(Files.readAllBytes(Paths.get(xmlFilePath)));

        return content;
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions accordingly
            return null; // Replace with appropriate error handling
        }
    }

     private Document loadXmlDocument(String filePath) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new File(filePath));
    }

}
