package at.ac.plus.mhdbdb.tools;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class RDFConverter {

    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: RDFConverter <inputFile.xml> <outputFile.ttl>");
            return;
        }

        String inputFile = args[0];
        String outputFile = args[1];

        Model model = ModelFactory.createDefaultModel();

        // Read the XML RDF file
        try (FileInputStream fis = new FileInputStream(inputFile)) {
            model.read(fis, null);
        } catch (IOException e) {
            System.err.println("Error reading the input file: " + e.getMessage());
            e.printStackTrace();
            return;
        }

        // Write the model in Turtle format
        try (FileOutputStream fos = new FileOutputStream(outputFile)) {
            RDFDataMgr.write(fos, model, Lang.TURTLE);
        } catch (IOException e) {
            System.err.println("Error writing to the output file: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
