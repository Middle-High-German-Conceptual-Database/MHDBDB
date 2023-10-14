package at.ac.plus.mhdbdb.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;

import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.ProcessingInstruction;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

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
            ProcessingInstruction pi = mainDoc.createProcessingInstruction("xml-stylesheet",
                    "type=\"text/xsl\" href=\"/content/teibp.xsl\"");
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

    @PostMapping(value = "/showTeiAsHtml", produces = MediaType.TEXT_HTML_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String showTeiAsHtml(@RequestBody HashMap<String, String> inputMap) {
        try {

            String id = inputMap.get("id");

            // Read and parse the main XML file
            String xmlFilePath = teiFolder + "/" + id + ".tei.xml";

            logger.info(xmlFilePath);

            Document mainDoc = loadXmlDocument(xmlFilePath);

            // Add the XML processing instruction
            // <link xmlns="http://www.w3.org/1999/xhtml" id="maincss" rel="stylesheet"
            // type="text/css" href="../css/teibp.css" />
            // <link xmlns="http://www.w3.org/1999/xhtml" id="customcss" rel="stylesheet"
            // type="text/css" href="../css/custom.css" />
            ProcessingInstruction pi = mainDoc.createProcessingInstruction("xml-stylesheet",
                    "type=\"text/xsl\" href=\"/content/teibp.xsl\"");
            mainDoc.insertBefore(pi, mainDoc.getDocumentElement());

            // Read and parse the additional XML file
            Document additionalDoc = loadXmlDocument(additionalXmlPath);

            // Append the content of the additional XML to the teiHeader of the main XML
            Node teiHeader = mainDoc.getElementsByTagName("tei:teiHeader").item(0);
            Node importedNode = mainDoc.importNode(additionalDoc.getDocumentElement(), true);
            teiHeader.appendChild(importedNode);

            XPathFactory xPathFactory = XPathFactory.newInstance();
            XPath xPath = xPathFactory.newXPath();

            // Update the content of titleStmt
            Node titleStmtP = (Node) xPath.evaluate(
                    "/TEI/teiHeader/fileDesc/titleStmt/title", mainDoc, XPathConstants.NODE);
            if (titleStmtP != null) {
                titleStmtP.setTextContent(inputMap.get("titleContent"));
            } else {
                logger.info("titleStmtP is null");
            }

            // Update the content of publicationStmt
            Node publicationStmtP = (Node) xPath.evaluate(
                    "/TEI/teiHeader/fileDesc/publicationStmt/p", mainDoc, XPathConstants.NODE);
            if (publicationStmtP != null) {
                publicationStmtP.setTextContent(inputMap.get("publicationContent"));
            }

            // Update the content of sourceDesc
            Node sourceDescP = (Node) xPath.evaluate("/TEI/teiHeader/fileDesc/sourceDesc/p",
                    mainDoc, XPathConstants.NODE);
            if (sourceDescP != null) {
                sourceDescP.setTextContent(inputMap.get("sourceDescContent"));
            }

            // Serialize the modified XML back to string
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            StringWriter writer = new StringWriter();
            transformer.transform(new DOMSource(mainDoc), new StreamResult(writer));

            String temporaryTeiFile = writer.getBuffer().toString();

            // save temporaryTeiFile to temporary file with uuid as name with .xml ending
            String idX = java.util.UUID.randomUUID().toString();
            String temporaryTeiFilePath = teiFolder + "/" + idX + ".tei.temp.xml";
            Files.write(Paths.get(temporaryTeiFilePath), temporaryTeiFile.getBytes());

            // execute program tei2html with temporaryTeiFilePath as argument
            String command = "teitohtml " + temporaryTeiFilePath;
            // String command = "/Users/danielschlager/GitHub/tei-stylesheets/bin/teitohtml " + temporaryTeiFilePath;
            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();

            logger.info(temporaryTeiFilePath);

            Document doc = loadXmlDocument(temporaryTeiFilePath + ".html");

            // Step 2: Modify the Document
            // Get the head element
            Node head = doc.getElementsByTagName("head").item(0);

            if (head == null) {
                throw new IllegalArgumentException("No head element found in the XHTML document");
            }

            // Create and append the first link element
            Element link1 = doc.createElement("link");
            link1.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            link1.setAttribute("id", "maincss");
            link1.setAttribute("rel", "stylesheet");
            link1.setAttribute("type", "text/css");
            link1.setAttribute("href", "/css/teibp.css");
            head.appendChild(link1);

            // Create and append the second link element
            Element link2 = doc.createElement("link");
            link2.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            link2.setAttribute("id", "customcss");
            link2.setAttribute("rel", "stylesheet");
            link2.setAttribute("type", "text/css");
            link2.setAttribute("href", "/css/custom.css");
            head.appendChild(link2);

            // Step 3: Serialize the Modified Document
            TransformerFactory tfa = TransformerFactory.newInstance();
            Transformer transformera = tfa.newTransformer();
            StringWriter writera = new StringWriter();
            transformera.transform(new DOMSource(doc), new StreamResult(writera));

            // Get the modified XHTML as a String
            String modifiedXhtml = writera.getBuffer().toString();

            // delete temporary file
            File file = new File(temporaryTeiFilePath + ".html");
            // file.delete();

            return modifiedXhtml;
        } catch (Exception e) {
            e.printStackTrace();
            // Handle exceptions accordingly
            return null; // Replace with appropriate error handling
        }
    }

    @GetMapping("/loading")
    public ResponseEntity<String> loading() {
        // Construct the HTML response
        String responseHtml = "<html><body><p>Der Text wird gerade vorbereitet...</p></body></html>";

        return ResponseEntity.ok(responseHtml);
    }

    private Document loadXmlDocument(String filePath) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new File(filePath));
    }

}
