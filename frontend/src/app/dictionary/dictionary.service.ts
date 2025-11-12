import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LanguageService, NAMEDGRAPHS } from 'app/shared/base.imports';
import { BehaviorSubject } from 'rxjs';
import { Concept } from '../concept/concept.class';
import {
  FilterIdLabelI,
  MhdbdbIdLabelEntityService,
  FilterConceptsI,
  FilterPosI,
  OptionsI,
  QueryParameterI
} from '../shared/mhdbdb-graph.service';
import { ConceptService } from './../concept/concept.service';
import { WordClass, SenseClass } from './dictionary.class';
import { PoS } from 'app/shared/pos/pos.class';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';

export interface DictionaryQueryParameterI extends QueryParameterI<DictionaryFilterI, DictionaryOptionsI> {}

export interface DictionaryFilterI extends FilterIdLabelI, FilterPosI, FilterConceptsI {
  hasSubterms?: boolean;
  workId?: string;
}

export interface DictionaryOptionsI extends OptionsI {}

export const defaultDictionaryQP: DictionaryQueryParameterI = {
  order: 'label',
  limit: 10,
  offset: 0,
  desc: false,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('default'),
  filter: {
    label: '',
    isLabelActive: true,
    pos: [],
    isPosActive: true,
    concepts: [],
    isConceptsActive: true,
    hasSubterms: true,
    workId: ''
  },
  option: {
    useLucene: false
  }
};

export interface graphicalForm {
  form: string;
  occurrences: number;
}

@Injectable({ providedIn: 'root' })
export class DictionaryService extends MhdbdbIdLabelEntityService<
  DictionaryQueryParameterI,
  DictionaryFilterI,
  DictionaryOptionsI,
  WordClass
> {
  protected _defaultQp: DictionaryQueryParameterI = defaultDictionaryQP;

  constructor(public store: Store, protected conceptService: ConceptService) {
    super(store);
    this.store.select(selectLanguage).subscribe(v => (this._defaultQp.lang = v));
  }

  async getWordFormations(word: WordClass, limit?: number, offset?: number): Promise<[WordClass[], number]> {
    const lang = this._defaultQp.lang;
    let limitString = '';
    if (limit) {
      limitString = `limit: ${limit}`;
    }
    let offsetString = '';
    if (offset) {
      offsetString = `offset: ${limit}`;
    }
    const query = ` ?id ?count ?label ?posId ?posLabel where {
                {
                    select (count(*) as ?count)
                    where {
                        <${word.id}> ^dhpluso:subterm ?id .
                    }
                    ${limitString}
                    ${offsetString}
                }
                {
                    select ?id ?label
                    where {
                        <${word.id}> ^dhpluso:subterm ?id .
                        ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .

                    }
                    ${limitString}
                    ${offsetString}
                    order by ?label
                }
                OPTIONAL {
                    ?id dhpluso:partOfSpeech ?posId .
                    ?posId skos:prefLabel ?posLabel .
                    filter(langMatches( lang(?posLabel), "${lang}" ))
                    FILTER NOT EXISTS {
                        ?posId owl:deprecated ?dp .
                    }
                }
            }
            order by ?label`;
    console.warn(query);
    return new Promise<[WordClass[], number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          total = data.results.bindings[0].count.value;
          if (total <= 0) {
            resolve([[], 0]);
          } else {
            resolve([this._jsonToObject(data.results.bindings), total]);
          }
        } else {
          resolve([[], 0]);
        }
      });
    });
  }

  getSenses(word: WordClass): Promise<SenseClass[]> {
    let processedSenses = new BehaviorSubject(0);
    const sensesQuery = ` DISTINCT ?id (count(?mid) as ?index) WHERE {
                <${word.id}> dhpluso:sense/rdf:rest* ?mid .
                ?mid rdf:rest* ?node .
                ?node rdf:first ?id .
            }
            GROUP BY ?node ?id
            Order by ?index
        `;
    let results: SenseClass[] = [];
    return new Promise<SenseClass[]>(resolve => {
      this._sq.query(sensesQuery).then(async data => {
        for (const row of data.results.bindings) {
          //data.results.bindings.forEach((row, index, array) => {
          this.conceptService.getConceptsOfSense(row.id.value).then(data => {
            let sense = new SenseClass(row.id.value);
            sense.index = row.index.value;
            sense.concepts = data;
            results.push(sense);
            processedSenses.next(processedSenses.value + 1);
          });
        }
        processedSenses.subscribe(value => {
          if (value == data.results.bindings.length) {
            resolve(results.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0)));
          }
        });
      });
    });
  }

  getGraphicalVariance(word: WordClass): Promise<graphicalForm[]> {
    const query = ` ?form (count(?target) as ?count) where {
                ?annotation oa:hasBody <${word.id}> .
                ?annotation oa:hasTarget ?target .
                ?target mhdbdbxml:firstChild/mhdbdbxml:content ?form .
            }
            GROUP BY ?form
            ORDER BY DESC(?count)
        `;
    let list: graphicalForm[] = [];
    return new Promise<graphicalForm[]>(resolve => {
      this._sq.query(query).then(data => {
        if (data.results.bindings && data.results.bindings.length > 0) {
          data.results.bindings.forEach(item =>
            list.push({
              form: item.form.value as string,
              occurrences: item.count.value as number
            })
          );
        }
        resolve(list);
      });
    });
  }

  getWordsByConcepts(
    concept: Concept,
    includeNarrowerConcepts: boolean = false,
    limit?: number,
    offset?: number
  ): Promise<[(WordClass[]), number]> {
    let limitString: string = '';
    if (limit) {
      limitString = `limit ${limit}`;
    }
    let offsetString: string = '';
    if (offset) {
      offsetString = `offset ${offset}`;
    }
    let narrowerTransitiveString: string = '';
    if (includeNarrowerConcepts) {
      narrowerTransitiveString = 'skos:narrowerTransitive?/';
    }

    const query = ` ?id ?label ?posId ?posLabel ?count
            where {
                {
                    select ?id ?label where {
                        <${concept.id}> ${narrowerTransitiveString}^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?id.
                        ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                    }
                    order by ?label
                    ${limitString}
                    ${offsetString}
                }
                {
                    select (count(*) as ?count) where {
                        <${concept.id}> ${narrowerTransitiveString}^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?id.
                    }
                }
                OPTIONAL {
                    ?id dhpluso:partOfSpeech ?posId .
                    ?posId skos:prefLabel ?posLabel .
                    FILTER (lang(?posLabel) = '${this._defaultQp.lang}')
                    FILTER NOT EXISTS {
                        ?posId owl:deprecated ?dp .
                    }
                }
            }

        `;
    return new Promise<[(WordClass[]), number]>(resolve => {
      this._sq.query(query).then(data => {
        let total: number = 0;
        if (data.results.bindings && data.results.bindings.length >= 1) {
          total = data.results.bindings[0].count.value;
          if (total > 0) {
            resolve([this._jsonToObject(data.results.bindings), total]);
          } else {
            resolve([[], 0]);
          }
        } else {
          resolve([[], 0]);
        }
      });
    });
  }

  _sparqlQuery(qp: DictionaryQueryParameterI, countResults: boolean = false): string {
    // Variables
    let filters = [];
    let filterEntities = [];

    // Lemma

    // Lemma query
    let lemmaQuery = '';
    if (qp.filter.isLabelActive) {
      if (qp.filter.id || qp.option.useLucene === false || !('label' in qp.filter && qp.filter.label != '')) {
        lemmaQuery = `
                        # ID
                        ?id a dhpluso:Word .
                        `;
      } else {
        // Lucene query
        lemmaQuery = `
                        ?search a luc-index:word ;
                        luc:query "lemma:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                        luc:entities ?id .
                        `;
      }

      // Lemma Filter (regexp mode)
      if (!qp.filter.id && qp.option.useLucene === false && 'label' in qp.filter && qp.filter.label != '') {
        filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}", "i"))`);
      }
    }

    // POS Filter
    if (!qp.filter.id && qp.filter.isPosActive == true) {
      let posBindings = [];
      for (let i in qp.filter.pos) {
        posBindings.push(`?id (dhpluso:partOfSpeech/skos:narrowerTransitive|dhpluso:partOfSpeech) <${qp.filter.pos[i]}> .`);
      }
      filterEntities.push(posBindings.join('\n'));
    }

    // Concept Filter
    let conceptBindings = [];
    if (!qp.filter.id && qp.filter.isConceptsActive == true) {
      for (let i in qp.filter.concepts) {
        conceptBindings.push(
          `?id (^dhpluso:isSenseOf/dhpluso:isLexicalizedSenseOf/skos:narrowerTransitive|^dhpluso:isSenseOf/dhpluso:isLexicalizedSenseOf) <${qp.filter.concepts[i]}> .`
        );
      }
      filterEntities.push(conceptBindings.join('\n'));
    }

    let instanceQuery = '';
    if (qp.filter.id) {
      instanceQuery = `
                    ${this._sparqlGenerateBinding(qp.filter.id)}
                    ${lemmaQuery}
                    ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .
            `;
    } else {
      instanceQuery = `
                    ${lemmaQuery}
                    # Filter Entities
                    ${filterEntities.join('\n')}
                    ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                    # Filter
                    ${filters.join('\n')}
            `;
    }

    let q = '';
    if (countResults) {
      q = ` (count(*) as ?count) where {
                    ${instanceQuery}
                }
            `;
    } else {
      q = ` DISTINCT ?id ?label ?posId ?posLabel ?senseId ?senseIndex ?conceptId ?conceptLabel ?subTermId ?subTermLabel ?compoundId ?compoundLabel ?form ?textId ?textLabel
                WHERE {
                    {
                        SELECT DISTINCT ?id ?label
                        WHERE {
                            ${instanceQuery}
                        }
                        ${this._sparqlOrder(qp.order, qp.desc)}
                        ${this._sparqlLimitOffset(qp.limit, qp.offset)}
                    }

                    # ?POS
                    OPTIONAL {
                        ?id dhpluso:partOfSpeech ?posId .
                        ?posId skos:prefLabel ?posLabel .
                        filter(langMatches( lang(?posLabel), "${qp.lang}" ))
                        FILTER NOT EXISTS {
                            ?posId owl:deprecated ?dp .
                        }
                    }

                    # ?subterm
                    OPTIONAL {
                        ?id dhpluso:subterm ?subTermId .
                        ?subTermId dhpluso:canonicalForm/dhpluso:writtenRep ?subTermLabel .
                    }

                    OPTIONAL {
        ?annotation oa:hasBody ?id .
        ?annotation oa:hasTarget/mhdbdbxml:partOf/dhpluso:hasElectronicInstance/dhpluso:instanceOf/dhpluso:expressionOf ?textId .
        ?textId rdfs:label ?textLabel .
        filter(langMatches( lang(?textLabel), "de" ))
    }
                }
            `;
    }
    console.warn(q);
    return q;
  }

  _jsonToObject(bindings: any): WordClass[] {
    let results: WordClass[] = super._jsonToObject(bindings) as WordClass[];

    bindings.forEach(item => {
      let element = results.find(element => element.id === item.id.value);

      // POS
      if ('posId' in item && element && !element.pos) {
        const posElem = new PoS(item.posId.value, item.posLabel.value);
        let posList: PoS[] = [];
        posList.push(posElem);
        element.pos = posList;
      } else if ('posId' in item && element && !element.pos.find(posElem => posElem.id === item.posId.value)) {
        const posElem = new PoS(item.posId.value, item.posLabel.value);
        element.pos.push(posElem);
      }

      // Text IDs
      if ('textId' in item && element && !element.texts) {
        const posElem = new PoS(item.textId.value, item.textLabel.value);
        let posList: PoS[] = [];
        posList.push(posElem);
        element.texts = posList;
      } else if ('textId' in item && element && !element.texts.find(posElem => posElem.id === item.textId.value)) {
        const posElem = new PoS(item.textId.value, item.textLabel.value);
        element.texts.push(posElem);
      }

      // Subterms
      if ('subTermId' in item && element && !element.subTerms) {
        const subTermElem = new WordClass(item.subTermId.value, item.subTermLabel.value);
        let subTermList: WordClass[] = [];
        subTermList.push(subTermElem);
        element.subTerms = subTermList;
      } else if ('subTermId' in item && element && !element.subTerms.find(subTermElem => subTermElem.id === item.subTermId.value)) {
        const subTermElem = new WordClass(item.subTermId.value, item.subTermLabel.value);
        element.subTerms.push(subTermElem);
      }

      // Compounds
      if ('compoundId' in item && element && !element.compounds) {
        const compoundElem = new WordClass(item.compoundId.value, item.compoundLabel.value);
        let compoundList: WordClass[] = [];
        compoundList.push(compoundElem);
        element.compounds = compoundList;
      } else if ('compoundId' in item && element && !element.compounds.find(compoundElem => compoundElem.id === item.compoundId.value)) {
        const compoundElem = new WordClass(item.compoundId.value, item.compoundLabel.value);
        element.compounds.push(compoundElem);
      }

      // Forms
      if ('form' in item && element && !element.forms) {
        let formList: string[] = [item.form.value];
        element.forms = formList;
      } else if ('form' in item && element && !element.forms.find(form => form === item.form.value)) {
        element.forms.push(item.form.value);
      }

      //Senses
      if ('senseId' in item && element && (!element.senses || !element.senses.find(sense => sense.id === item.senseId.value))) {
        let sense: SenseClass = new SenseClass(item.senseId.value);
        sense.index = item.senseIndex.value;
        sense.concepts = [];
        let concept: Concept = new Concept(item.conceptId.value, item.conceptLabel.value);
        sense.concepts.push(concept);
        if (!element.senses) {
          element.senses = [];
        }
        element.senses.push(sense);
      } else if (
        'conceptId' in item &&
        element &&
        !element.senses.find(sense => sense.id === item.senseId.value).concepts.find(concept => concept.id === item.conceptId.value)
      ) {
        let concept: Concept = new Concept(item.conceptId.value, item.conceptLabel.value);
        element.senses.find(sense => sense.id === item.senseId.value).concepts.push(concept);
      }
    });
    results.forEach(element => {
      if (element.compounds) {
        element.compounds.sort((a, b) => (a.label < b.label ? -1 : 1));
      }
      if (element.forms) {
        element.forms.sort((a, b) => (a < b ? -1 : 1));
      }
      if (element.senses) {
        element.senses.sort((a, b) => (a.index < b.index ? -1 : 1));
      }
    });
    return results;
  }
}
