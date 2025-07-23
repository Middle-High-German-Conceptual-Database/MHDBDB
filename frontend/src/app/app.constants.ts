// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const SERVER_API_SPARQL_URL = `${SERVER_API_URL}repositories/dhPLUS`;
// export const SERVER_API_SPARQL_URL = `${SERVER_API_URL}services/rdf/api/query/sparql`;

export const SERVER_API_URL_PREFIX = "api/v1"
export const SERVER_API_URL_WORKS = `${SERVER_API_URL}${SERVER_API_URL_PREFIX}/works`;

export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;

export const NAMESPACES = new Map<string, string>([
  ['bf', 'http://id.loc.gov/ontologies/bibframe/'],
  ['bflc', 'http://id.loc.gov/ontologies/bflc/'],
  ['cc', 'http://creativecommons.org/ns#'],
  ['constants', 'https://dh.plus.ac.at/constants/'],
  ['crm', 'http://www.cidoc-crm.org/cidoc-crm/'],
  ['dc', 'http://purl.org/dc/elements/1.1/'],
  ['dct', 'http://purl.org/dc/terms/'],
  ['dcterms', 'http://purl.org/dc/terms/'],
  ['decomp', 'http://www.w3.org/ns/lemon/decomp#'],
  ['dhplusi', 'https://dh.plus.ac.at/instance/'],
  ['dhpluso', 'https://dh.plus.ac.at/ontology#'],
  ['dhplusoValidation', 'https://dh.plus.ac.at/dhplusoValidation/'],
  ['dhplusv', 'https://dh.plus.ac.at/vocabulary/'],
  ['dnb', 'https://d-nb.info/'],
  ['dnbt', 'https://d-nb.info/standards/elementset/dnb#'],
  ['ecrm', 'http://erlangen-crm.org/200717/'],
  ['foaf', 'http://xmlns.com/foaf/0.1/'],
  ['geo', 'http://www.opengis.net/ont/geosparql#'],
  ['gnd', 'https://d-nb.info/gnd/'],
  ['gndo', 'https://d-nb.info/standards/elementset/gnd#'],
  ['lexinfo', 'http://www.lexinfo.net/ontology/3.0/lexinfo#'],
  ['lime', 'http://www.w3.org/ns/lemon/lime#'],
  ['luc', 'http://www.ontotext.com/connectors/lucene#'],
  ['luc-index', 'http://www.ontotext.com/connectors/lucene/instance#'],
  ['mhdbdbi', 'https://dh.plus.ac.at/mhdbdb/instance/'],
  ['mhdbdbo', 'https://dh.plus.ac.at/mhdbdb/ontology#'],
  ['mhdbdbxml', 'https://mhdbdbd.plus.ac.at/xml-ontology#'],
  ['oa', 'http://www.w3.org/ns/oa#'],
  ['ogcsf', 'http://www.opengis.net/ont/sf#'],
  ['ontolex', 'http://www.w3.org/ns/lemon/ontolex#'],
  ['owl', 'http://www.w3.org/2002/07/owl#'],
  ['parameter', 'https://dh.plus.ac.at/parameter-ontology#'],
  ['parameteri', 'https://dh.plus.ac.at/parameter/'],
  ['rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'],
  ['rdfs', 'http://www.w3.org/2000/01/rdf-schema#'],
  ['schema', 'http://schema.org/'],
  ['sf', 'http://www.opengis.net/ont/sf#'],
  ['sh', 'http://www.w3.org/ns/shacl#'],
  ['skos', 'http://www.w3.org/2004/02/skos/core#'],
  ['szd', 'https://gams.uni-graz.at/o,szd.ontology#'],
  ['tei', 'http://www.tei-c.org/ns/1.0#'],
  ['time', 'http://www.w3.org/2006/time#'],
  ['tmp', 'https://dh.plus.ac.at/tmp/'],
  ['vann', 'http://purl.org/vocab/vann/'],
  ['wd', 'http://www.wikidata.org/entity/'],
  ['wdrs', 'http://www.w3.org/2007/05/powder-s#'],
  ['wds', 'http://www.wikidata.org/entity/statement/'],
  ['wdt', 'http://www.wikidata.org/prop/direct/'],
  ['wdtn', 'http://www.wikidata.org/prop/direct-normalized/'],
  ['xml', 'http://www.w3.org/XML/1998/namespace'],
  ['xsd', 'http://www.w3.org/2001/XMLSchema#']
]);

export const NAMEDGRAPHS = new Map<string, string>([
  ['default', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbMeta'],
  ['dict', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbDict'],
  ['dnb', 'https://dh.plus.ac.at/mhdbdb/namedGraph/dnb'],
  ['gnd', 'https://dh.plus.ac.at/mhdbdb/namedGraph/gnd'],
  ['text', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbText'],
  ['vocab', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbVocab'],
  ['wd', 'https://dh.plus.ac.at/mhdbdb/namedGraph/wd']
]);
