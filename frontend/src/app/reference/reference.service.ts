import { Injectable } from '@angular/core';
import { NAMEDGRAPHS } from 'app/shared/base.imports';
import {
  FilterConceptsI,
  FilterIdLabelI,
  FilterPosI,
  FilterWorksI,
  MhdbdbIdLabelEntityService,
  OptionsI,
  QueryParameterI
} from '../shared/mhdbdb-graph.service';
import { AnnotationClass } from './annotation.class';
import { Kwic, ElectronicText, Token } from './reference.class';
import { ContextRangeT, TokenFilterI } from 'app/reference/referencePassage.service';
import { v4 as uuidv4 } from 'uuid';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { Utils } from 'app/shared/utils';

export interface TextQueryParameterI extends QueryParameterI<TextFilterI, TextOptionsI> {}

export interface TextFilterI extends FilterIdLabelI, FilterWorksI, FilterPosI, FilterConceptsI {
  context: ContextRangeT;
  isWorkIdActive: boolean;
  directlyFollowing: boolean;
  contextUnit: string;
  workId: string;
  isElectronicIdActive: boolean;
  electronicId: string;
  tokenFilters?: TokenFilterI[];
}

export interface TextOptionI extends OptionsI {}

export interface TextOptionsI extends OptionsI {
  useLucene: boolean;
}

export const defaultTokenFilter: TokenFilterI = {
  id: uuidv4(),
  searchLabelInLemma: false,
  isNamenActive: false,
  activeTab: 0,
  label: '',
  pos: [],
  concepts: [],
  onomastics: [],
  connectorAnd: true,
  relation: 'and',
  context: 1,
  directlyFollowing: true,
  contextUnit: 'lines'
};

export const defaultTextQP: TextQueryParameterI = {
  order: 'label',
  desc: false,
  limit: 10,
  offset: 0,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('text'),
  filter: {
    isIdActive: true,
    id: undefined,
    context: 1,
    directlyFollowing: true,
    isLabelActive: true,
    label: undefined,
    isWorkIdActive: true,
    workId: undefined,
    isElectronicIdActive: true,
    electronicId: undefined,
    tokenFilters: [defaultTokenFilter],
    isPosActive: true,
    pos: [],
    works: [],
    concepts: [],
    isConceptsActive: true,
    contextUnit: 'lines'
  },
  option: {
    useLucene: false
  }
};

@Injectable({ providedIn: 'root' })
export class TextService extends MhdbdbIdLabelEntityService<TextQueryParameterI, TextFilterI, TextOptionsI, ElectronicText> {
  languageSubject = new BehaviorSubject<string>(''); // Initialize with empty string or any other initial value

  protected _sparqlQuery(qp: TextQueryParameterI, countResults: boolean): string {
    throw new Error('Method not implemented.');
  }

  _defaultQp: TextQueryParameterI = defaultTextQP;

  constructor(public store: Store) {
    super(store);

    this.store.pipe(select(selectLanguage)).subscribe(language => {
      this.languageSubject.next(language); // Update the subject's value whenever the store changes
    });
  }

  /*_sparqlQuery(
    qp: TextQueryParameterI,
    countResults: boolean = false
  ): string {


    function posFilter(i: number, pos: string[]): string {
      let posUris = pos.map(p => `<${p}>`);
      let posFilter = ''
      if (pos.length > 0) {
        posFilter = `
                ?posAnnotation${i}
                    oa:hasBody ?pos${i} ;
                    oa:hasTarget ?token${i} ;
                .
                FILTER ( ?pos${i} IN (${posUris.join()}) )
                `
      }
      return posFilter
    }

    function conceptFilter(i: number, concepts: string[]): string {
      let conceptUris = concepts.map(c => `<${c}>`);
      let conceptFilter = ''
      if (concepts.length > 0) {
        conceptFilter = `
                ?conceptAnnotation${i}
                    oa:hasBody ?word${i} ;
                    oa:hasTarget ?token${i} ;
                .
                ?concept${i} skos:narrowerTransitive?/^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?word${i}
                FILTER ( ?concept${i} IN (${conceptUris.join()}) )
                `
      }
      return conceptFilter
    }


    let token0 = ''
    if (qp.filter.tokenFilters[0].label != '') {
      if (qp.filter.tokenFilters[0].searchLabelInLemma) {
        token0 = `
                {
                    {
                        ?word a dhpluso:Word .
                        ?word dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                        filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.tokenFilters[0].label, false)}", "i"))
                    }
                    [
                        oa:hasBody ?word ;
                        oa:hasTarget ?token0 ;
                    ]
                    ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                    ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
                }
                `
      } else {
        token0 = `
                    {
                        ?search a luc-index:token ;
                            luc:query "content:${this._labelFilterGenerator(qp.filter.tokenFilters[0].label, true)}" ;
                            luc:entities ?token0 .
                        ?token0 mhdbdbxml:partOf ?text ;
                            mhdbdbxml:n ?n0 .
                        ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                        ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
                    }
                `
      }
    } else {
      token0 = `
            {
                ?token0
                    a tei:seg ;
                    mhdbdbxml:n ?n0 ;
                .
                ${posFilter(0, qp.filter.tokenFilters[0].pos)}
                ${conceptFilter(0, qp.filter.tokenFilters[0].concepts)}
            }
            `
    }

    const lines = `
            {
                ?token0 mhdbdbxml:parent ?lines .
                ?lines a tei:l .
            }
            ${qp.filter.context > 1 ? `
                UNION
                {
                    select ?lines  {
                        ?token0 mhdbdbxml:parent ?lineX .
                        ?lineX a tei:l .
                        ?lineX mhdbdbxml:nextSibling+ ?lines .
                        ?lines a tei:l .
                    }
                    Limit ${qp.filter.context - 1}
                }
                UNION
                {
                    select ?lines  {
                        ?token0 mhdbdbxml:parent ?lineX .
                        ?lineX a tei:l .
                        ?lineX mhdbdbxml:prevSibling+ ?lines .
                        ?lines a tei:l .
                    }
                    Limit ${qp.filter.context - 1}
                }
            ` : ""}
        `

    let tokenSelects: string[] = []
    let tokens: string[] = []
    qp.filter.tokenFilters.forEach((tokenFilter, i) => {
      tokenSelects.push(`?token${i}`)
      if (i > 0) {
        if (tokenFilter.searchLabelInLemma) {
          tokens.push(
            `
                        {
                            ?lines mhdbdbxml:child ?token${i} .
                            [
                                oa:hasBody ?word ;
                                oa:hasTarget ?token${i} ;
                            ]
                            {
                                ?word${i} a dhpluso:Word .
                                ?word${i} dhpluso:canonicalForm/dhpluso:writtenRep ?label${i} .
                                filter(regex(str(?label${i}), "${this._labelFilterGenerator(tokenFilter.label, false)}", "i"))
                            }
                            ?token${i} mhdbdbxml:n ?n${i} .
                            ${posFilter(i, tokenFilter.pos)}
                            ${conceptFilter(i, tokenFilter.concepts)}
                            ${qp.filter.directlyFollowing === true ? `filter (?n${i} > ?n${i - 1})` : ''}
                        }
                        `
          )
        } else {
          tokens.push(
            `
                        {
                            ?lines mhdbdbxml:child ?token${i} .
                            ?token${i} mhdbdbxml:firstChild/mhdbdbxml:content ?content${i}
                            filter (regex(str(?content${i}),"${this._labelFilterGenerator(tokenFilter.label, false)}"))
                            ?token${i} mhdbdbxml:n ?n${i} .
                            ${posFilter(i, tokenFilter.pos)}
                            ${conceptFilter(i, tokenFilter.concepts)}
                            ${qp.filter.directlyFollowing === true ? `filter (?n${i} > ?n${i - 1})` : ''}
                        }
                        `
          )
        }

      }
    })

    // Variables
    let filters = []
    let filterEntities = []

    // Lemma

    // Lemma query
    let lemmaQuery = ''
    if (qp.filter.isLabelActive) {
      if (qp.filter.id || qp.option.useLucene === false || !('label' in qp.filter && qp.filter.label != '')) {
        lemmaQuery = `
                        # ID
                        ?id a dhpluso:Word .
                        `
      } else { // Lucene query
        lemmaQuery = `
                        ?search a luc-index:word ;
                        luc:query "lemma:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                        luc:entities ?id .
                        `
      }

      // Lemma Filter (regexp mode)
      if (!qp.filter.id && qp.option.useLucene === false && 'label' in qp.filter && qp.filter.label != '') {
        filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}", "i"))`)
      }
    }


    // POS Filter
    if (!qp.filter.id && qp.filter.isPosActive == true) {
      let posBindings = []
      for (let i in qp.filter.pos) {
        posBindings.push(`?id (dhpluso:partOfSpeech/skos:narrowerTransitive|dhpluso:partOfSpeech) <${qp.filter.pos[i]}> .`)
      }
      filterEntities.push(posBindings.join("\n"))
    }

    // Concept Filter
    let conceptBindings = []
    if (!qp.filter.id && qp.filter.isConceptsActive == true) {
      for (let i in qp.filter.concepts) {
        conceptBindings.push(`?id (^dhpluso:isSenseOf/dhpluso:isLexicalizedSenseOf/skos:narrowerTransitive|^dhpluso:isSenseOf/dhpluso:isLexicalizedSenseOf) <${qp.filter.concepts[i]}> .`)
      }
      filterEntities.push(conceptBindings.join("\n"))
    }

    let instanceQuery = ''
    if (qp.filter.id) {
      instanceQuery = `
                    ${this._sparqlGenerateBinding(qp.filter.id)}
                    ${lemmaQuery}
                    ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .            `
    } else {
      instanceQuery = `
                    ${lemmaQuery}
                    # Filter Entities
                    ${filterEntities.join("\n")}
                    ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                    # Filter
                    ${filters.join("\n")}
            `
    }


    let q = ''
    if (countResults) {
      q = `
                SELECT (count(*) as ?count) where {
                    ${instanceQuery}
                }
            `
    } else {
      q = `
                SELECT DISTINCT ?rootId ?id ?label ?posId ?posLabel ?senseId ?senseIndex ?conceptId ?conceptLabel ?subTermId ?subTermLabel ?compoundId ?compoundLabel ?form ?textId ?textLabel
                WHERE {
                    {
                        SELECT DISTINCT ?id ?label ?rootId
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
            `
    }
    console.warn(q)
    return q
  }*/

  public sparqlQuery(qp: any, countResults: boolean): string {
    function posFilter(i: number, pos: string[], relation: string): string {
      let posUris = pos.map(p => `<${p}>`);
      let posFilter = '';

      if (pos.length > 0) {
        posFilter += `
                ?wordId${i} dhpluso:partOfSpeech ?pos${i} .
                FILTER ( ?pos${i} IN (${posUris.join()}) )
                `;
      }
      return posFilter;
    }

    function conceptFilter(i: number, concepts: string[], relation: string): string {
      let conceptUris = concepts.map(c => `<${c}>`);
      let conceptFilter = '';

      if (concepts.length > 0) {
        conceptFilter += `
        {
           ?concept0 dhpluso:isSenseOf ?wordId0 .
           ?concept0 dhpluso:isLexicalizedSenseOf ?sense0 .
             FILTER ( ?sense${i} IN (${conceptUris.join()}) )
         }   
                `;
      }
      return conceptFilter;
    }

    // Namen
    function onomasticsFilter(i: number, concepts: string[], relation: string): string {
      let conceptUris = concepts.map(c => `<${c}>`);
      let conceptFilter = '';

      if (concepts.length > 0) {
        conceptFilter += `
                ?onomastic${i} skos:narrowerTransitive?/^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?wordId${i} .
                FILTER ( ?onomastic${i} IN (${conceptUris.join()}) )
                `;
      }
      return conceptFilter;
    }

    function wordFilter(i: number, word: string, relation: string, exactForm: boolean): string {
      let wordFilter = '';

      if (word != '') {
        wordFilter += `

        ?typeId${i} dhpluso:writtenRep ?typeLabel${i} .
        ?typeId${i} dhpluso:isTypeOf ?wordId${i} .
        ?wordId${i} dhpluso:canonicalForm ?lemma${i} .
        ?wordId${i} dhpluso:canonicalForm/dhpluso:writtenRep ?wordLabel${i} .

        ?annotationId${i} oa:hasBody ?wordId${i} .
        ?annotationId${i} oa:hasTarget ?rootId .
        
        OPTIONAL {
          ?rootId mhdbdbxml:nextSibling ?nextTokenId .
          ?nextTokenId rdf:type tei:seg . 
          ?nextTokenId mhdbdbxml:lastChild/mhdbdbxml:content ?lastTokenContent .
          ?nextTokenId mhdbdbxml:firstChild/mhdbdbxml:content ?firstTokenContent .
        }
                `;

        if (exactForm == true) {
          wordFilter += ` ?typeId${i} dhpluso:writtenRep "${word}" .
                           ?tokenNodeId mhdbdbxml:parent ?rootId .
                          ?tokenNodeId mhdbdbxml:content "${word}" .
          `;
        } else {
          wordFilter += `filter(regex(str(?typeLabel${i}), "^${labelFilterGenerator(word, false)}$", "i")) .`;
        }
      }
      return wordFilter;
    }

    function lemmaFilter(i: number, word: string, relation: string): string {
      let wordFilter = '';

      if (word != '') {
        wordFilter += `
                ?wordId${i} a dhpluso:Word .
                ?wordId${i} dhpluso:canonicalForm/dhpluso:writtenRep ?wordLabel${i} .
                ?wordId${i} dhpluso:canonicalForm ?lemma${i} .

                ?annotationId${i} oa:hasBody ?wordId${i} .
                ?annotationId${i} oa:hasTarget ?rootId .
                ?tokenNodeID mhdbdbxml:parent ?rootId .
                
                filter(regex(str(?wordLabel${i}), "^${word}$", "i")) .
                
                `;
      }
      return wordFilter;
    }

    function positionFilter(i: number, position: string, relation: string): string {
      let positionFilter = '';

      if (position != '') {

        if (position === 'Anfang') {
          positionFilter += `
              
              FILTER(REGEX(?firstTokenContent, "[!.,?]"))

              
                `;
        } else if (position === 'Ende') {
          positionFilter += `
              
              FILTER(REGEX(?lastTokenContent, "[!.,?]"))

                `;
        }
      }
      return positionFilter;
    }


    let bindings: string[] = [];
    let filters: string[] = [];

    if (qp.isWorksActive && qp.works) {
      let tempFilters = [];
      qp.works.forEach((work, i) => {
        bindings.push(`Bind (<${work}> as ?work${i})`);
        tempFilters.push(`?workId = ?work${i}`);
      });
    }

    if (qp.isIdActive && qp.id) {
      bindings.push(`Bind (<${qp.id}> as ?id)`);
    }
    if (qp.isElectronicIdActive && qp.electronicId) {
      bindings.push(`Bind (<${qp.electronicId}> as ?electronicId)`);
    }

    let wordSelects: string[] = [];

    let words: string[] = [];
    let concepts: string[] = [];
    let onomastics: string[] = [];
    let poss: string[] = [];
    let positions: string[] = [];

    let wordsAnd: string[] = [];
    let conceptsAnd: string[] = [];
    let onomasticsAnd: string[] = [];
    let possAnd: string[] = [];
    let positionsAnd: string[] = [];

    // query with joins
    let qq: string = `
        SELECT * {                
    `;

    if (countResults) {
      qq = ` SELECT ?annotationId0 { `;
    }

    qp.filter.tokenFilters.forEach((tokenFilter, i: number) => {

      if (tokenFilter.activeTab && tokenFilter.activeTab == 1) {
        if (tokenFilter.concepts && tokenFilter.concepts.length > 0) {
          let concept = conceptFilter(i, tokenFilter.concepts, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            conceptsAnd.push(concept);
          }
        }
      } else if (tokenFilter.activeTab && tokenFilter.activeTab == 2) {
        if (tokenFilter.advancedSearch && tokenFilter.onomastics && tokenFilter.onomastics.length > 0) {
          let onomastic = onomasticsFilter(i, tokenFilter.onomastics, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            onomasticsAnd.push(onomastic);
          }
        }
      } else {

        let wordOrLemma = '';

        if (tokenFilter.searchLabelInLemma) {
          wordOrLemma = lemmaFilter(i, tokenFilter.label, tokenFilter.relation);
        } else {
          wordOrLemma = wordFilter(i, tokenFilter.label, tokenFilter.relation, tokenFilter.searchExactForm);
        }

        if (tokenFilter.relation === 'and') {
          wordsAnd.push(wordOrLemma);
        }

        if (tokenFilter.concepts && tokenFilter.concepts.length > 0) {
          let concept = conceptFilter(i, tokenFilter.concepts, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            conceptsAnd.push(concept);
          }
        }

        if (tokenFilter.pos && tokenFilter.pos.length > 0) {
          let pos = posFilter(i, tokenFilter.pos, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            possAnd.push(pos);
          }
        }

        if (tokenFilter.advancedSearch && tokenFilter.onomastics && tokenFilter.onomastics.length > 0) {
          let onomastic = onomasticsFilter(i, tokenFilter.onomastics, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            onomasticsAnd.push(onomastic);
          }
        }

        if (tokenFilter.isPositionActive && tokenFilter.anfang && tokenFilter.anfang != '') {
          let pos = positionFilter(i, tokenFilter.anfang, tokenFilter.relation);

          if (tokenFilter.relation === 'and') {
            positionsAnd.push(pos);
          }
        }
      }

    });

    qp.filter.tokenFilters.forEach((tokenFilter, i: number) => {
      words = [];
      concepts = [];
      onomastics = [];
      poss = [];
      positions = [];

      qq += ` { 
      
       SELECT DISTINCT * WHERE {
                    ?rootId mhdbdbxml:partOf ?textId .
                    ?textId dhpluso:hasElectronicInstance ?workId .
                    ?workId rdf:type dhpluso:Text .

                    {
    					        ?textId dhpluso:hasElectronicInstance ?electronicId .
                      ?electronicId rdf:type dhpluso:Text .
                      ?electronicId rdfs:label ?label .
                      BIND(?electronicId as ?id)
                    }
                    
                    {
                      ?workId dhpluso:contribution/dhpluso:agent ?authorId .
                      ?authorId rdfs:label ?authorLabel .
                    }

                    {
                      
                  
      
      `;

      wordSelects.push(`?concept${i}`);
      wordSelects.push(`?pos${i}`);
      wordSelects.push(`?wordId${i}`);
      wordSelects.push(`?wordLabel${i}`);
      wordSelects.push(`?annotationId${i}`);
      //wordSelects.push(`?rootId${i}`);

      if (tokenFilter.activeTab && tokenFilter.activeTab == 1) {
        if (tokenFilter.concepts && tokenFilter.concepts.length > 0) {
          let concept = conceptFilter(0, tokenFilter.concepts, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            concepts.push(concept);
          }
        }

        qq += `         
      
                      ${concepts.join('\r\n')}
                     
                      ${conceptsAnd.join('\r\n')}
                      
                      `;



        qq += `
                      
                      ${bindings.join('\r\n')}
                      ${filters.join('\r\n')}
                    }

                    filter(langmatches(lang(?label),'de')) 
                    filter(langmatches(lang(?authorLabel),'de')) 

                    }
                    ORDER BY ASC(?label)
                    ${this._sparqlLimitOffset(qp.limit, qp.offset)}`;
        qq += ` } `;
      } else if (tokenFilter.activeTab && tokenFilter.activeTab == 2) {

        if (tokenFilter.advancedSearch && tokenFilter.onomastics && tokenFilter.onomastics.length > 0) {
          let onomastic = onomasticsFilter(0, tokenFilter.onomastics, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            onomastics.push(onomastic);
          }
        }


        qq += `         
      
                      ${onomastics.join('\r\n')}
                      
                      ${onomasticsAnd.join('\r\n')}
                      
                      
                      `;



        qq += `
                      
                      ${bindings.join('\r\n')}
                      ${filters.join('\r\n')}
                    }

                    filter(langmatches(lang(?label),'de')) 
                    filter(langmatches(lang(?authorLabel),'de')) 

                    }
                    ORDER BY ASC(?label)
                    ${this._sparqlLimitOffset(qp.limit, qp.offset)}`;
        qq += ` } `;
      } else {
        let wordOrLemma = '';

        if (tokenFilter.searchLabelInLemma) {
          wordOrLemma = lemmaFilter(0, tokenFilter.label, tokenFilter.relation);
        } else {
          wordOrLemma = wordFilter(0, tokenFilter.label, tokenFilter.relation, tokenFilter.searchExactForm);
        }

        if (tokenFilter.relation !== 'and') {
          words.push(wordOrLemma);
        }

        if (tokenFilter.concepts && tokenFilter.concepts.length > 0) {
          let concept = conceptFilter(0, tokenFilter.concepts, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            concepts.push(concept);
          }
        }

        if (tokenFilter.pos && tokenFilter.pos.length > 0) {
          let pos = posFilter(0, tokenFilter.pos, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            poss.push(pos);
          }
        }

        if (tokenFilter.advancedSearch && tokenFilter.onomastics && tokenFilter.onomastics.length > 0) {
          let onomastic = onomasticsFilter(0, tokenFilter.onomastics, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            onomastics.push(onomastic);
          }
        }

        if (tokenFilter.isPositionActive && tokenFilter.anfang && tokenFilter.anfang != '') {
          let pos = positionFilter(i, tokenFilter.anfang, tokenFilter.relation);

          if (tokenFilter.relation !== 'and') {
            positions.push(pos);
          }
        }

        qq += `         
      
                      ${words.join('\r\n')}
                      ${concepts.join('\r\n')}
                      ${onomastics.join('\r\n')}
                      ${poss.join('\r\n')} 
                      ${positions.join('\r\n')} 
                      
                      ${wordsAnd.join('\r\n')}
                      ${conceptsAnd.join('\r\n')}
                      ${onomasticsAnd.join('\r\n')}
                      ${possAnd.join('\r\n')}
                      ${positionsAnd.join('\r\n')}
                      
                      
                      `;



        qq += `
                      
                      ${bindings.join('\r\n')}
                      ${filters.join('\r\n')}
                    }

                    filter(langmatches(lang(?label),'de')) 
                    filter(langmatches(lang(?authorLabel),'de')) 

                    }
                    ORDER BY ASC(?label)
                    ${this._sparqlLimitOffset(qp.limit, qp.offset)}`;
        qq += ` } `;
      }



      if (qp.filter.tokenFilters.length > i+1) {
        if (tokenFilter.relation == 'or') {
          qq += ` UNION `;
        }
        if (tokenFilter.relation == 'and') {
          qq += ` UNION `;
        }
      }


    });

    qq += ` } `;

    let q = '';
    if (countResults) {
      q = `
                SELECT (count(*) as ?count)
                {
                    SELECT ?annotationId0 {   
                    ${qq}
                  }
                }

            `;
    } else {
      q = `${qq}`;
    }

    return q;
  }

  public sparqlOrder(key: string, desc: boolean): string {
    if (desc) {
      return `ORDER BY DESC(?${key})`; // Todo: ORDER BY DESC(LCASE(?${key})) does not work! Lcase does not support rdfs:literal
    } else {
      return `ORDER BY ASC(?${key})`;
    }
  }

  public _jsonToObject(bindings): ElectronicText[] {
    let results: ElectronicText[] = super._jsonToObject(bindings) as ElectronicText[];

    //let instances: ElectronicText[] = [];

    bindings.forEach(item => {
      let element = results.find(element => element.id === item.id.value);

      element.authorLabel = item.authorLabel.value;
      element.textId = Utils.removeNameSpace(item.textId.value);
      element.workId = item.workId.value;

      // element.rootId = item.rootId.value;
      
      // words
      if ('rootId' in item && element && !element.rootIds) {
        let formList: string[] = [item.rootId.value];
        element.rootIds = formList;
      } else if ('rootId' in item && element && !element.rootIds.find(form => form === item.rootId.value)) {
        element.rootIds.push(item.rootId.value);
      } 

      // words
      let wordIndex = 0;
      while (`wordId${wordIndex}` in item) {
        if (element && !element.words) {
          let formList = [item[`wordId${wordIndex}`].value];
          element.words = formList;
        } else if (element && !element.words.find(form => form === item[`wordId${wordIndex}`].value)) {
          element.words.push(item[`wordId${wordIndex}`].value);
        }
        wordIndex++;
      }

      // wordLabel
      let wordLabelsIndex = 0;
      while (`wordLabel${wordLabelsIndex}` in item) {
        if (element && !element.wordLabels) {
          let formList = [item[`wordLabel${wordLabelsIndex}`].value];
          element.wordLabels = formList;
        } else if (element && !element.wordLabels.find(form => form === item[`wordLabel${wordLabelsIndex}`].value)) {
          element.wordLabels.push(item[`wordLabel${wordLabelsIndex}`].value);
        }
        wordLabelsIndex++;
      }

      /* if ('wordLabel' in item && element && !element.wordLabels) {
        let formList: string[] = [item.wordLabel.value];
        element.wordLabels = formList;
      } else if ('wordLabel' in item && element && !element.wordLabels.find(form => form === item.wordLabel.value)) {
        element.wordLabels.push(item.wordLabel.value);
      } */

      // annotations
      let wordAnnotationIdIndex = 0;
      while (`annotationId${wordAnnotationIdIndex}` in item) {
        if (element && !element.annotationIds) {
          let formList = [item[`annotationId${wordAnnotationIdIndex}`].value];
          element.annotationIds = formList;
        } else if (element && !element.annotationIds.find(form => form === item[`annotationId${wordAnnotationIdIndex}`].value)) {
          element.annotationIds.push(item[`annotationId${wordAnnotationIdIndex}`].value);
        }
        wordAnnotationIdIndex++;
      }

      /* if ('annotationId' in item && element && !element.annotationIds) {
        let formList: string[] = [item.annotationId.value];
        element.annotationIds = formList;
      } else if ('annotationId' in item && element && !element.annotationIds.find(form => form === item.annotationId.value)) {
        element.annotationIds.push(item.annotationId.value);
      } */

      // instances.push(new ElectronicText(row.id.value, row.label.value, row.rootId.value, row.electronicId.value, row.workId.value));
    });
    return results;
  }

  public getText(textId: string): Promise<ElectronicText> {
    let qp = this.defaultQp;
    qp.filter.id = textId;
    return this.getInstance(qp);
  }

  ////////
  //KWIC//
  ////////

  private sparqlKwic(centerUri: string, radius: number = 5): string {
    return `
            select distinct ?position ?seg ?n ?content
            where {
                { #self
                    Bind ('center' as ?position)
                    Bind (<${centerUri}> as ?seg)
                    ?seg mhdbdbxml:n ?n .
                    ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                }
                UNION
                {	#left
                    select ?position ?seg ?n ?content where {
                        Bind ('left' as ?position)
                        Bind (<${centerUri}> as ?centerId)
                        { #Prose Text
                            ?centerId ^mhdbdbxml:nextSibling+/^mhdbdbxml:parent* ?seg .
                            ?seg a tei:seg ;
                                mhdbdbxml:n ?n .
                            ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                        }
                        UNION
                        { #Verse Text
                            OPTIONAL {
                                ?centerId mhdbdbxml:parent+ ?centerL .
                                ?centerL a tei:l ;
                                    ^mhdbdbxml:nextSibling ?l .
                                ?l a tei:l ;
                                ^mhdbdbxml:parent* ?seg .
                                ?seg a tei:seg ;
                                    mhdbdbxml:n ?n .
                                ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                            }
                        }
                    }
                    Order by desc(?n)
                    limit ${radius}
                }
                UNION
                {	#right
                    select ?position ?seg ?n ?content where {
                        Bind ('right' as ?position)
                        Bind (<${centerUri}> as ?centerId)
                        { #Prose Text
                            ?centerId mhdbdbxml:nextSibling+/^mhdbdbxml:parent* ?seg .
                            ?seg a tei:seg;
                                mhdbdbxml:n ?n .
                            ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                        }
                        UNION
                        { #Verse Text
                            OPTIONAL {
                                ?centerId mhdbdbxml:parent+ ?centerL .
                                ?centerL a tei:l ;
                                    mhdbdbxml:nextSibling ?l .
                                ?l a tei:l ;
                                ^mhdbdbxml:parent* ?seg .
                                ?seg a tei:seg ;
                                    mhdbdbxml:n ?n .
                                ?seg mhdbdbxml:firstChild/mhdbdbxml:content ?content .
                            }
                        }
                    }
                    Order by ?n
                    limit ${radius}
                }
            }
            Order by ?n
            limit ${radius * 2 + 1}
        `;
  }

  private jsonToObjectKwic(bindings): Kwic {
    let left: Token[] = [];
    let center: Token = undefined;
    let right: Token[] = [];
    bindings.forEach(row => {
      try {
        if (row.position.value == 'center' && 'seg' in row) {
          center = new Token(row.seg.value, row.n.value, row.content.value);
        } else if (row.position.value == 'left' && 'seg' in row) {
          left.push(new Token(row.seg.value, row.n.value, row.content.value));
        } else if (row.position.value == 'right' && 'seg' in row) {
          right.push(new Token(row.seg.value, row.n.value, row.content.value));
        }
      } catch (error) {
        console.error('jsonToObjectKwic: Error ', error);
        console.error(row);
      }
    });
    if (center) {
      return new Kwic(left, center, right);
    } else {
      return undefined;
    }
  }

  public getKwic(centerUri: string, radius: number, contextUnit: string): Promise<Kwic> {
    if (contextUnit === 'lines') {
      radius = 15; // quick fix
    }
    const query = this.sparqlKwic(centerUri, radius);
    return new Promise<Kwic>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          resolve(this.jsonToObjectKwic(data['results']['bindings']));
        },
        error => {
          reject(error);
        }
      );
    });
  }

  ///////////////
  //Annotations//
  ///////////////

  private annotationsSparqlQuery(limit: number, offset: number, bodyId?: string, targetId?: string, targetClass?: string): string {
    let body = bodyId === undefined ? '?body' : `<${bodyId}>`;
    let target = targetId === undefined ? '?target' : `<${targetId}>`;
    let bodyBind = bodyId === undefined ? '' : `BIND(<${bodyId}> AS ?body)`;
    let targetBind = targetId === undefined ? '' : `BIND(<${targetId}> AS ?target)`;
    const targetClassFilter = targetClass === undefined ? '' : `?target a ${targetClass} .`;
    const query = `
            SELECT DISTINCT ?annotation ?body ?target ?count WHERE {
                {
                    SELECT DISTINCT (count(*) as ?count) WHERE {
                        ${bodyBind}
                        ${targetBind}
                        ?annotation oa:hasBody ${body} . # i.E.: mhdbdbi:VEX
                        ?annotation oa:hasTarget ${target} . # i.E.: mhdbdbtext:KU#KU_11132_7
                        ${targetClassFilter}
                    }
                }
                ${bodyBind}
                ${targetBind}
                ?annotation oa:hasBody ${body} . # i.E.: mhdbdbi:VEX
                ?annotation oa:hasTarget ${target} . # i.E.: mhdbdbtext:KU#KU_11132_7
                ${targetClassFilter}
            }
            OFFSET ${offset}
            LIMIT ${limit}
        `;
    return query;
  }

  private jsonToObjectAnnotation(bindings): AnnotationClass[] {
    let annotations: AnnotationClass[] = [];
    bindings.forEach(row => {
      try {
        annotations.push(new AnnotationClass(row.annotation.value, row.body.value, row.target.value));
      } catch (error) {
        console.error('jsonToObjectAnnotation: Error ', error);
        console.error(row);
      }
    });
    return annotations;
  }

  getAnnotations(
    limit: number,
    offset: number,
    bodyId?: string,
    targetId?: string,
    targetClass?: string
  ): Promise<[AnnotationClass[], number]> {
    const query = this.annotationsSparqlQuery(limit, offset, bodyId, targetId, targetClass);
    return new Promise<[AnnotationClass[], number]>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          let total: number = 0;
          if (data.results.bindings && data.results.bindings.length >= 1) {
            total = data.results.bindings[0].count.value;
            if (total && total <= 0) {
              resolve([[], 0]);
            } else {
              resolve([this.jsonToObjectAnnotation(data.results.bindings), total]);
            }
          } else {
            resolve([[], 0]);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
function labelFilterGenerator(label: any, arg1: boolean) {
  // labelFilter = this._regExpEscape(labelFilter)
  let newlabelfilter = String(label).trim();
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
    return label;
  }
}
