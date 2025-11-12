/* eslint-disable object-shorthand */
import { Store, select } from '@ngrx/store';
import { SERVER_API_SPARQL_URL } from 'app/app.constants';
import { MhdbdbEntity, MhdbdbIdLabelEntity } from './baseIndexComponent/baseindexcomponent.class';
import { Utils } from './utils';
import { setProgress, resetProgress } from '../store/ui.actions'; // Make sure to update the path appropriately
import { HttpClient, HttpHandler } from '@angular/common/http';

////////////////////
// Interfaces
////////////////////

export interface QueryParameterI<f extends FilterI, o extends OptionsI> {
  lang: string | undefined;
  namedGraphs?: string; // --> List
  order: string;
  desc: boolean;
  limit: number | undefined;
  offset: number | undefined;
  filter: f;
  option: o;
}

export interface FilterI { }

export interface FilterIdI extends FilterI {
  id?: string;
  isIdActive?: boolean;
}

export interface FilterLabelI extends FilterI {
  label?: string;
  isLabelActive?: boolean;
}

export interface FilterSeriesLabelI extends FilterI {
  label?: string;
  isSeriesActive?: boolean;
}

export interface FilterPosI extends FilterI {
  pos?: string[];
  isPosActive?: boolean;
}

export interface FilterConceptsI extends FilterI {
  concepts?: string[];
  isConceptsActive?: boolean;
}

export interface FilterSeriesI extends FilterI {
  series?: string[];
  isSeriesActive?: boolean;
}

export interface FilterWorksI extends FilterI {
  works?: string[];
  isWorksActive?: boolean;
}

export interface FilterAuthorI extends FilterI {
  authors?: string[];
  isAuthorsActive?: boolean;
}

export interface FilterCorpusI extends FilterI {
  corpus?: string[];
  isCorpusActive?: boolean;
}

export interface FilterPlaceI extends FilterI {
  places?: string[];
  isPlacesActive?: boolean;
}

export interface FilterSkosI extends FilterI {
  broader?: string;
  scheme?: string;
  topConcepts?: boolean;
}

export type classFilterT = ['Person' | 'Place' | 'Work' | 'Word' | 'Text' | 'conceptualSystem' | 'nameSystem'];

export interface LabeledClassfilterI {
  classFilter: classFilterT;
  de: string;
  en: string;
}

export interface LabeledSeriesfilterI {
  de: string;
  en: string;
}

export const classFilter: LabeledClassfilterI[] = [
  {
    classFilter: ('Person' as unknown) as classFilterT,
    de: 'Person',
    en: 'Person'
  },
  {
    classFilter: ('Place' as unknown) as classFilterT,
    de: 'Ort',
    en: 'Place'
  },
  {
    classFilter: ('Work' as unknown) as classFilterT,
    de: 'Werk',
    en: 'Work'
  },
  {
    classFilter: ('Text' as unknown) as classFilterT,
    de: 'Werk',
    en: 'Work'
  },
  {
    classFilter: ('Word' as unknown) as classFilterT,
    de: 'Lemmata',
    en: 'Dictionary Entry'
  },
  {
    classFilter: ('conceptualSystem' as unknown) as classFilterT,
    de: 'Begriff',
    en: 'Concept'
  },
  {
    classFilter: ('nameSystem' as unknown) as classFilterT,
    de: 'Namenskategorie',
    en: 'name category'
  }
];

export interface FilterClassExtendedI extends FilterClassI, FilterSeriesI, FilterWorksI, FilterLabelI, FilterConceptsI, FilterAuthorI { }

export interface FilterClassI extends FilterI {
  classFilter?: classFilterT[];
  isClassFilterActive: boolean;
}

export interface FilterSeriesI extends FilterI {
  seriesFilter?: any[];
  isSeriesFilterActive: boolean;
}

export interface FilterIdLabelI extends FilterIdI, FilterLabelI { }

export interface OptionsI {
  useLucene?: boolean;
  endpointUrl?: string;
}

interface SparqlQueryResultI {
  head: {
    link: string;
    vars: string[];
  };
  results: {
    bindings: SparqlBindingI[];
  };
}

export interface SparqlBindingI {
  [key: string]: {
    type: string;
    value: any;
    datatype?: string;
    'xml:lang'?: string;
  };
}

/**
 * Wrapper to query mhdbdb sparql endpoint
 *
 * @export
 * @class SparqlQuery
 */
export class SparqlQuery {

  constructor(private store: Store) {}

  postWithProgress(url: string, data: string, headers: {[key: string]: string}): Promise<SparqlQueryResultI> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      // Set headers
      for (let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      // Tracking download progress
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          console.log(`Downloaded: ${percentComplete}%`);

          // Dispatch action to update progress in the Redux store
          this.store.dispatch(setProgress({ progress: percentComplete }));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          this.store.dispatch(resetProgress());
          if (xhr.status === 503) {
            reject(new Error('Service Unavailable: The server is currently unable to handle the request.'));
          } else {
            reject(new Error(xhr.statusText));
          }
        }
      };

      xhr.onerror = () => {
        // Reset the progress in case of a network error
        this.store.dispatch(resetProgress());
        reject(new Error("Network error"));
      };

      xhr.send(data);
    });
  }


  /**
   * Query MHDBDB API
   *
   * @param {string} queryString
   * @return {*}  {Promise<SparqlQueryResultI>}
   * @memberof SparqlQuery
   */
  query(queryString: string, endpointUrl: string = SERVER_API_SPARQL_URL): Promise<SparqlQueryResultI> {
    console.warn("simpleQuery", queryString);

    let headersa = {
      'Accept': 'application/json',
      'Content-Type': 'application/sparql-query',
      'Authorization': 'Basic ' + btoa('mhdbdb:2ffgMEdTo#HD')
    };

    // Use Promise.race to race the fetch against the timeout
    return Promise.race([
      this.postWithProgress(endpointUrl, queryString, headersa)
    ])
      .catch(function (error) {
        return Promise.reject(error); // Reject with the error
      });
  }


  // TODO: Maybe later
  /**
   * Query MHDBDB API Endpoint
   *
   * @param {HttpClient} http // this is shitty
   * @param {QueryParameterI<FilterI, OptionsI>} qp
   * @return {*}  {Promise<SparqlQueryResultI>}
   * @memberof SparqlQuery
   */
  apiQuery(http: HttpClient, qp: QueryParameterI<FilterI, OptionsI>, endpointUrl: string): Promise<SparqlQueryResultI> {
    const body = JSON.stringify(qp)
    
    return Promise.race([
       http.post<SparqlQueryResultI>(endpointUrl, qp).toPromise<SparqlQueryResultI>()
    ])      
      .catch(function (error) {
        return Promise.reject(error); // Reject with the error
      });

  }
}



/**
 * Interface for MHDBDB Graph Services
 *
 * @export
 * @interface MhdbdbGraphServiceI
 * @template P
 * @template F
 * @template O
 * @template E
 */
export interface MhdbdbGraphServiceI<P extends QueryParameterI<F, O>, F extends FilterI, O extends OptionsI, E extends MhdbdbEntity> {
  readonly defaultFilter: F;
  readonly defaultOption: O;
  readonly defaultQp: P;
  defaultQpLang: string;
  countInstances(qp: P): Promise<number>;
  getInstances(qp: P): Promise<E[]>;
  getInstance(qp: P): Promise<E>;
}

/**
 * Abstract service to query MHDBDB Entities. Actual sparql query and conversion to object needs to be implemented by individual services.
 *
 * @export
 * @abstract
 * @class MhdbdbGraphService
 * @implements {MhdbdbGraphServiceI<P, F, O, E>}
 * @template P
 * @template F
 * @template O
 * @template E
 */
export abstract class MhdbdbGraphService<P extends QueryParameterI<F, O>, F extends FilterI, O extends OptionsI, E extends MhdbdbEntity>
  implements MhdbdbGraphServiceI<P, F, O, E> {
  ////////////////////
  // Variables, Getter
  ////////////////////
  protected _sq = new SparqlQuery(this.store);

  protected abstract _defaultQp: P;

  public get defaultFilter(): F {
    return this._defaultQp.filter;
  }

  public get defaultOption(): O {
    return this._defaultQp.option;
  }

  public get defaultQp(): P {
    return this._defaultQp;
  }

  public get defaultQpLang(): string {
    return this._defaultQp.lang;
  }

  public set defaultQpLang(lang: string) {
    this._defaultQp.lang = lang;
  }

  ////////////////////
  // Constructor
  ////////////////////

  constructor(public store: Store) { }

  ////////////////////
  // Sparql Help Functions
  ////////////////////
  /**
   * Method to generate regex or lucene query strings
   *
   * @protected
   * @param {string} labelFilter
   * @param {boolean} [useLucene=false]
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _labelFilterGenerator(labelFilter: string, useLucene: boolean = false): string {
    if (useLucene === true) {
      return this._labelFilterLucene(labelFilter);
    } else {
      return this._labelFilterRegEx(labelFilter);
    }
  }

  /**
   * Generates a regexp query string
   *
   * @protected
   * @param {string} labelFilter
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _labelFilterRegEx(labelFilter: string): string {
    // labelFilter = this._regExpEscape(labelFilter)
    let newlabelfilter = String(labelFilter).trim();
    const replacements = {
      '\\*': '.*',
      '\\+': '.+',
      '\\?': '.{1}',
      '\\^': '^',
      '\\$': '$',
      // Add all replacements like â -> a here
      ae: '(?:ae|[æä])',
      oe: '(?:oe|[œö])',
      ue: '(?:ue|[ü])',
      a: '[aáàäâ]',
      e: '[eëêèé]',
      i: '[iïîìí]',
      o: '[oóôöò]',
      u: '[uùüúû]',
      y: '[yýŷÿ]',
      s: '[sſ]'
    };

    Object.entries(replacements).forEach(([orig, replacement]) => {
      newlabelfilter = newlabelfilter.replace(orig, replacement);
    });

    newlabelfilter = newlabelfilter.replace(/\\~(\d+)/, '.{$1}');

    try {
      new RegExp(newlabelfilter);
      console.warn('regex: ', newlabelfilter);
      return newlabelfilter;
    } catch (error) {
      console.error('Invalid regex: ', newlabelfilter);
      return labelFilter;
    }
  }

  /**
   * Generates a lucene query string
   *
   * @protected
   * @param {string} labelFilter
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _labelFilterLucene(labelFilter: string): string {
    labelFilter = this._luceneEscape(labelFilter);
    let newlabelfilter = String(labelFilter).trim();

    if (newlabelfilter.match(/\$$/)) {
      newlabelfilter = newlabelfilter.replace(/\$$/, '');
    } else {
      newlabelfilter = `${newlabelfilter}*`;
    }

    if (newlabelfilter.match(/^\^/)) {
      newlabelfilter = newlabelfilter.replace(/^\^/, '');
    } else {
      newlabelfilter = `*${newlabelfilter}`;
    }
    return newlabelfilter;
  }

  /**
   *  Escapes all functional characters from regexp string
   *
   * @protected
   * @param {string} literal_string
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _regExpEscape(literal_string: string): string {
    return literal_string.replace(/[^A-Za-z0-9_]/g, '\\$&');
  }

  /**
   * Escapes all functional characters from lucene string
   *
   * @protected
   * @param {string} literal_string
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _luceneEscape(literal_string: string): string {
    return literal_string.replace(/[+\-&|!(){}~[\]":\\]/g, ''); // allowed: *?^
  }

  /**
   * Generates a sparql binding string
   *
   * @protected
   * @param {string} id
   * @param {string} [varName='id']
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _sparqlGenerateBinding(id: string, varName: string = 'id'): string {
    let bindId: string = '';
    if (id) {
      bindId = `Bind(<${id}> AS ?${varName})`;
    }
    return bindId;
  }

  /**
   * Generates a sparql 'FROM <graph>' string
   *
   * @protected
   * @param {(string|string[])} namedGraphUris
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _sparqlNamedGraph(namedGraphUris: string | string[]): string {
    if ((namedGraphUris && typeof namedGraphUris === 'string') || namedGraphUris instanceof String) {
      return `FROM <${namedGraphUris}>`;
    } else if (Array.isArray(namedGraphUris) && namedGraphUris.length > 0) {
      return namedGraphUris.map(x => `FROM <${x}>`).join('\r\n');
    } else {
      return '';
    }
  }

  /**
   * Generates Sparql Order Statement
   *
   * @protected
   * @param {string} key
   * @param {boolean} desc
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _sparqlOrder(key: string, desc: boolean): string {
    if (desc) {
      return `ORDER BY DESC(?${key})`; // Todo: ORDER BY DESC(LCASE(?${key})) does not work! Lcase does not support rdfs:literal
    } else {
      return `ORDER BY ASC(?${key})`;
    }
  }

  /**
   * Generates Sparql Limit Offset Statement
   *
   * @protected
   * @param {number} limit
   * @param {number} offset
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected _sparqlLimitOffset(limit: number, offset: number): string {
    if (limit && limit >= 0 && offset) {
      return `limit ${limit.toString()} offset ${offset.toString()}`;
    } else if (limit && limit >= 0) {
      return `limit ${limit.toString()} offset 0`;
    } else {
      return '';
    }
  }

  /**
   * Count results from query
   *
   * @param {P} qp
   * @return {*}  {Promise<number>}
   * @memberof MhdbdbGraphService
   */
  public countInstances(qp: P): Promise<number> {
    const query = this._sparqlQuery(qp, true);
    return new Promise<number>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          if (data && data.results && data.results.bindings && data.results.bindings.length >= 1) {
            resolve(data.results.bindings[0].count.value as number);
          } else {
            resolve(0);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  /**
   * get instances by query
   *
   * @param {P} qp
   * @return {*}  {Promise<E[]>}
   * @memberof MhdbdbGraphService
   */
  public getInstances(qp: P): Promise<E[]> {
    const query = this._sparqlQuery(qp, false);

    return new Promise<E[]>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          if (data && data['results'] && data['results']['bindings']) {
            resolve(this._jsonToObject(data['results']['bindings']));
          }
          reject('No results found');
        },
        error => {
          reject(error);
        }
      );
    });
  }

  /**
   * get single instance by query
   *
   * @param {P} qp
   * @return {*}  {Promise<E[]>}
   * @memberof MhdbdbGraphService
   */
  public getInstance(qp: P): Promise<E> {
    qp.limit = 1;
    qp.offset = undefined;
    return new Promise<E>((resolve, reject) => {
      this.getInstances(qp).then(
        data => {
          if (data && data[0]) {
            resolve(data[0]);
          }
          reject('No results found');
        },
        error => {
          reject(error);
        }
      );
    });
  }

  ////////////////////
  // public abstract functions
  ////////////////////

  /**
   * Generate a sparql query from query parameters
   *
   * @protected
   * @abstract
   * @param {P} qp
   * @param {boolean} countResults
   * @return {*}  {string}
   * @memberof MhdbdbGraphService
   */
  protected abstract _sparqlQuery(qp: P, countResults: boolean): string;

  /**
   * Convert a sparql query result into a mhdbdb entity
   *
   * @protected
   * @abstract
   * @param {*} bindings
   * @param {string[]} [excludeKeys]
   * @return {*}  {E[]}
   * @memberof MhdbdbGraphService
   */
  protected abstract _jsonToObject(bindings: any, excludeKeys?: string[]): E[];
}

/**
 * Abstract MHDBDB Service for Entities with label and id. Provides a basic sparql result to object conversion method
 *
 * @export
 * @abstract
 * @class MhdbdbIdLabelEntityService
 * @extends {MhdbdbGraphService<P, F, O, E>}
 * @template P
 * @template F
 * @template O
 * @template E
 */
export abstract class MhdbdbIdLabelEntityService<
  P extends QueryParameterI<F, O>,
  F extends FilterIdLabelI,
  O extends OptionsI,
  E extends MhdbdbIdLabelEntity
> extends MhdbdbGraphService<P, F, O, E> {
  constructor(public store: Store) {
    super(store);
  }

  protected abstract _sparqlQuery(qp: P, countResults: boolean): string;

  protected _jsonToObject(bindings: SparqlBindingI[]): E[] {
    let processedIds: string[] = [];
    let results: E[] = [];
    bindings.forEach(row => {
      try {
        if (!processedIds.includes(row.id.value)) {
          let element = {} as E;
          element.id = row.id.value;
          element.strippedId = Utils.removeNameSpace(row.id.value);
          element.label = row.label.value;
          results.push(element);
          processedIds.push(row.id.value);
        }
      } catch (error) {
        console.error('jsonToObject: Error reading BaseIndexComponentEntry entry.', error);
        console.error(row);
      }
    });
    return results;
  }
}
