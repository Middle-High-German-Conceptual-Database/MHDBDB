package at.ac.plus.mhdbdb.backend;

import org.apache.commons.io.IOUtils;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.ProcessingInstruction;

import jakarta.servlet.http.HttpServletResponse;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
public class TeiViewController {

    private static final Logger logger = LoggerFactory.getLogger(TeiViewController.class);

    @Value("${app.dev.frontend.teiFolder}")
    private String teiFolder;

    @Value("${app.dev.frontend.teiRenderedFolder}")
    private String teiRenderedFolder;

    @Value("${app.dev.frontend.additionalXmlPath}")
    private String additionalXmlPath;

    @Value("${app.dev.frontend.teiPdfolder}")
    private String teiPdfFolder;

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
            // Handle exceptions accordingly
            logger.error("Error transforming TEI", e);
            return null;
        }
    }

    @GetMapping(value = "/downloadTeiPdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public @ResponseBody void downloadTeiPdf(@RequestParam String id, HttpServletResponse response) throws IOException {
        String pdfFilePath = teiPdfFolder;
        if(!pdfFilePath.endsWith("/")) {
            pdfFilePath += "/";
        }
        pdfFilePath += id + ".pdf";

        File file = new File(pdfFilePath);
        if(!file.exists()) {
            throw new FileNotFoundException("'" + pdfFilePath + "' not found.");
        }

        InputStream inputStream = new FileInputStream(file); //load the file
        try {
            response.setContentType(MediaType.APPLICATION_PDF_VALUE);
            response.setHeader("Content-Disposition", "attachment; filename=\"" + id + ".pdf\"");
            response.setContentLength((int)file.length());
            OutputStream outputStream = response.getOutputStream();
            IOUtils.copy(inputStream, outputStream);
        } catch(Exception ex) {
            throw new IOException("Error sending PDF", ex);
        } finally {
            inputStream.close();            
        }
    }

    @GetMapping(value = "/downloadTeiXml", produces = MediaType.APPLICATION_XML_VALUE)
    public @ResponseBody void downloadTeiXml(@RequestParam String id, HttpServletResponse response) throws IOException {

        String xmlFilePath = teiFolder;
        if(!xmlFilePath.endsWith("/")) {
            xmlFilePath += "/";
        }
        xmlFilePath += id + ".tei.xml";
        File file = new File(xmlFilePath);
        if(!file.exists()) {
            throw new FileNotFoundException("'" + xmlFilePath + "' not found.");
        }

        InputStream inputStream = new FileInputStream(file); //load the file
        try {
            response.setContentType(MediaType.APPLICATION_XML_VALUE);
            response.setHeader("Content-Disposition", "attachment; filename=\"" + id + ".xml\"");
            response.setContentLength((int)file.length());
            OutputStream outputStream = response.getOutputStream();
            IOUtils.copy(inputStream, outputStream);
        } catch(Exception ex) {
            throw new IOException("Error sending TEI XML", ex);
        } finally {
            inputStream.close();            
        }
    }

    @PostMapping(value = "/showTeiAsHtml", produces = MediaType.TEXT_HTML_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String showTeiAsHtml(@RequestBody HashMap<String, String> inputMap) {
        try {

            String id = inputMap.get("id");

            if (!Files.isDirectory(Paths.get(teiRenderedFolder)))
            {
                Files.createDirectory(Paths.get(teiRenderedFolder));
            }
            String htmlRenderedFilePath = teiRenderedFolder + "/" + id + ".tei.html";
            if (new File(htmlRenderedFilePath).isFile()) 
            {
                return new String(Files.readAllBytes(Paths.get(htmlRenderedFilePath)), StandardCharsets.UTF_8);
            }
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
            // mainDoc.insertBefore(pi, mainDoc.getDocumentElement());

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

            // logger.info(temporaryTeiFile);

            // save temporaryTeiFile to temporary file with uuid as name with .xml ending
            // TODO: We could just take the tei content if that doesn't change
            // and create only, if the temp files don't already exist.
            String idX = java.util.UUID.randomUUID().toString();
            String temporaryTeiFilePath = teiFolder + "/" + idX + ".tei.temp.xml";
            String teiConverter = teiFolder + "/tei2html.xsl";
            Files.write(Paths.get(temporaryTeiFilePath), temporaryTeiFile.getBytes());

            // render HTML file using xsltproc
            logger.info("Render HTML file {}", htmlRenderedFilePath);

            ProcessBuilder pb = new ProcessBuilder("xsltproc", teiConverter, temporaryTeiFilePath);
            pb.redirectOutput(new File(htmlRenderedFilePath));
            Process process = pb.start();
            process.waitFor();
            
            String htmlContent = new String(Files.readAllBytes(Paths.get(htmlRenderedFilePath)), StandardCharsets.UTF_8);
            try {
                File fileXml = new File(temporaryTeiFilePath);
                fileXml.delete();
            } catch (Exception e) {
                logger.warn("Could not delete temp file {}. You'll need to clean up", temporaryTeiFilePath);
            }
            return htmlContent;
        } catch (Exception e) {
            logger.error("Error transforming TEI", e);
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
