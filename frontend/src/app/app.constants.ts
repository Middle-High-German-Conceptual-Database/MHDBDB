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

export const NAMEDGRAPHS = new Map<string, string>([
  ['default', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbMeta'],
  ['dict', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbDict'],
  ['dnb', 'https://dh.plus.ac.at/mhdbdb/namedGraph/dnb'],
  ['gnd', 'https://dh.plus.ac.at/mhdbdb/namedGraph/gnd'],
  ['text', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbText'],
  ['vocab', 'https://dh.plus.ac.at/mhdbdb/namedGraph/mhdbdbVocab'],
  ['wd', 'https://dh.plus.ac.at/mhdbdb/namedGraph/wd']
]);

export const NAMESPACE_MHDBDBI = "https://dh.plus.ac.at/mhdbdb/instance/"
