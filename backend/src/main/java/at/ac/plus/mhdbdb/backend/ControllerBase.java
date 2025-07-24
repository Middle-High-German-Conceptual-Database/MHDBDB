package at.ac.plus.mhdbdb.backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;

public class ControllerBase {

    @Value("${target.host}")
    protected String targetHost;

    @Value("${target.repository}")
    protected String targetRepository;

    protected String lang = "de";

    private Map<String, String> NAMESPACES = new HashMap<String, String>() {{
        put("bf", "http://id.loc.gov/ontologies/bibframe/");
        put("bflc", "http://id.loc.gov/ontologies/bflc/");
        put("cc", "http://creativecommons.org/ns#");
        put("constants", "https://dh.plus.ac.at/constants/");
        put("crm", "http://www.cidoc-crm.org/cidoc-crm/");
        put("dc", "http://purl.org/dc/elements/1.1/");
        put("dct", "http://purl.org/dc/terms/");
        put("dcterms", "http://purl.org/dc/terms/");
        put("decomp", "http://www.w3.org/ns/lemon/decomp#");
        put("dhplusi", "https://dh.plus.ac.at/instance/");
        put("dhpluso", "https://dh.plus.ac.at/ontology#");
        put("dhplusoValidation", "https://dh.plus.ac.at/dhplusoValidation/");
        put("dhplusv", "https://dh.plus.ac.at/vocabulary/");
        put("dnb", "https://d-nb.info/");
        put("dnbt", "https://d-nb.info/standards/elementset/dnb#");
        put("ecrm", "http://erlangen-crm.org/200717/");
        put("foaf", "http://xmlns.com/foaf/0.1/");
        put("geo", "http://www.opengis.net/ont/geosparql#");
        put("gnd", "https://d-nb.info/gnd/");
        put("gndo", "https://d-nb.info/standards/elementset/gnd#");
        put("lexinfo", "http://www.lexinfo.net/ontology/3.0/lexinfo#");
        put("lime", "http://www.w3.org/ns/lemon/lime#");
        put("luc", "http://www.ontotext.com/connectors/lucene#");
        put("luc-index", "http://www.ontotext.com/connectors/lucene/instance#");
        put("mhdbdbi", "https://dh.plus.ac.at/mhdbdb/instance/");
        put("mhdbdbo", "https://dh.plus.ac.at/mhdbdb/ontology#");
        put("mhdbdbxml", "https://mhdbdbd.plus.ac.at/xml-ontology#");
        put("oa", "http://www.w3.org/ns/oa#");
        put("ogcsf", "http://www.opengis.net/ont/sf#");
        put("ontolex", "http://www.w3.org/ns/lemon/ontolex#");
        put("owl", "http://www.w3.org/2002/07/owl#");
        put("parameter", "https://dh.plus.ac.at/parameter-ontology#");
        put("parameteri", "https://dh.plus.ac.at/parameter/");
        put("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
        put("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
        put("schema", "http://schema.org/");
        put("sf", "http://www.opengis.net/ont/sf#");
        put("sh", "http://www.w3.org/ns/shacl#");
        put("skos", "http://www.w3.org/2004/02/skos/core#");
        put("szd", "https://gams.uni-graz.at/o,szd.ontology#");
        put("tei", "http://www.tei-c.org/ns/1.0#");
        put("time", "http://www.w3.org/2006/time#");
        put("tmp", "https://dh.plus.ac.at/tmp/");
        put("vann", "http://purl.org/vocab/vann/");
        put("wd", "http://www.wikidata.org/entity/");
        put("wdrs", "http://www.w3.org/2007/05/powder-s#");
        put("wds", "http://www.wikidata.org/entity/statement/");
        put("wdt", "http://www.wikidata.org/prop/direct/");
        put("wdtn", "http://www.wikidata.org/prop/direct-normalized/");
        put("xml", "http://www.w3.org/XML/1998/namespace");
        put("xsd", "http://www.w3.org/2001/XMLSchema#");
    }};

    protected String getSparqlPrefixes() {
    List<String> prefixes = new ArrayList<String>();
    this.NAMESPACES.forEach((k, v) -> prefixes.add("prefix " + k + ": <" + v + ">"));
    return String.join("\n", prefixes);
  }
}
