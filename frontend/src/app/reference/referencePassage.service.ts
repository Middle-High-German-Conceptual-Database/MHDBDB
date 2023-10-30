import { Injectable } from '@angular/core';
import { NAMEDGRAPHS } from 'app/app.constants';
import { FilterAuthorI, FilterCorpusI, FilterI, MhdbdbGraphService, OptionsI, QueryParameterI } from '../shared/mhdbdb-graph.service';
import { Line, TextPassage, Token } from './reference.class';
import { TextService } from './reference.service';
import { v4 as uuidv4 } from 'uuid';
import { selectLanguage } from 'app/store/language.reducer';
import { Store, select } from '@ngrx/store';

interface ValueTranslationI {
  value: string;
  de: string;
  en: string;
}
export type ContextUnitsT = 'lines' | 'words';
export const contextUnits: ValueTranslationI[] = [
  {
    value: 'lines',
    de: 'Zeilen/Verse',
    en: 'lines/verses'
  },
  {
    value: 'words',
    de: 'Wörter',
    en: 'words'
  }
];
export type ContextRangeT = 1 | 2 | 3 | 4 | 5;
export const contextRange: number[] = [1, 2, 3, 4, 5];

export interface TokenFilterI {
  id: string;
  isNamenActive: boolean;
  searchLabelInLemma: boolean;
  label?: string;
  pos?: string[];
  concepts?: string[];
  onomastics?: string[];
  searchExactForm?: boolean;
  positionInLine?: number;
  connectorAnd: boolean;
  relation: string;
  context: number;
  directlyFollowing: boolean;
  contextUnit: string;
  advancedSearch?: boolean;
}

export interface TextPassageFilterI extends FilterI, FilterAuthorI, FilterCorpusI {
  context: ContextRangeT;
  contextUnit: ContextUnitsT;
  directlyFollowing: boolean;
  tokenFilters?: TokenFilterI[];
  startTokenId?: string;
  endTokenId?: string;
}

export interface TextPassageOptionsI extends OptionsI {}

export interface TextPassageQueryParameterI extends QueryParameterI<TextPassageFilterI, TextPassageOptionsI> {
  filter: TextPassageFilterI;
  option: TextPassageOptionsI;
}

export const defaultTokenFilter: TokenFilterI = {
  id: uuidv4(),
  searchLabelInLemma: false,
  isNamenActive: false,
  searchExactForm: false,
  label: '',
  pos: [],
  concepts: [],
  advancedSearch: false,
  onomastics: [],
  connectorAnd: true,
  relation: 'and',
  context: 1,
  directlyFollowing: true,
  contextUnit: 'lines'
};

export const defaultTextPassageQP: TextPassageQueryParameterI = {
  order: 'label',
  desc: false,
  limit: 10,
  offset: 0,
  lang: undefined,
  namedGraphs: NAMEDGRAPHS.get('text'),
  filter: {
    context: 1,
    contextUnit: 'lines',
    directlyFollowing: true,
    tokenFilters: [defaultTokenFilter],
    corpus: [],
    authors: []
  },
  option: {
    useLucene: false
  }
};

@Injectable({ providedIn: 'root' })
export class TextPassageService extends MhdbdbGraphService<
  TextPassageQueryParameterI,
  TextPassageFilterI,
  TextPassageOptionsI,
  TextPassage
> {
  protected _defaultQp: TextPassageQueryParameterI = defaultTextPassageQP;

  constructor(public store: Store, protected textService: TextService) {
    super(store);
    this.store.select(selectLanguage).subscribe(v => (this._defaultQp.lang = v));
  }

  protected _sparqlQuery(qp: TextPassageQueryParameterI, countResults: boolean = false): string {
    function posFilter(i: number, pos: string[]): string {
      let posUris = pos.map(p => `<${p}>`);
      let posFilter = '';
      if (pos.length > 0) {
        posFilter = `
                ?posAnnotation${i}
                    oa:hasBody ?pos${i} ;
                    oa:hasTarget ?token${i} ;
                .
                FILTER ( ?pos${i} IN (${posUris.join()}) )
                `;
      }
      return posFilter;
    }

    function conceptFilter(i: number, concepts: string[]): string {
      let conceptUris = concepts.map(c => `<${c}>`);
      let conceptFilter = '';
      if (concepts.length > 0) {
        conceptFilter = `
                ?conceptAnnotation${i}
                    oa:hasBody ?word${i} ;
                    oa:hasTarget ?token${i} ;
                .
                ?concept${i} skos:narrowerTransitive?/^dhpluso:isLexicalizedSenseOf/dhpluso:isSenseOf ?word${i}
                FILTER ( ?concept${i} IN (${conceptUris.join()}) )
                `;
      }
      return conceptFilter;
    }

    let token0 = '';
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
                `;
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
                `;
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
            `;
    }

    const lines = `
            {
                ?token0 mhdbdbxml:parent ?lines .
                ?lines a tei:l .
            }
            ${
              qp.filter.context > 1
                ? `
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
            `
                : ''
            }
        `;

    let tokenSelects: string[] = [];
    let tokens: string[] = [];
    qp.filter.tokenFilters.forEach((tokenFilter, i) => {
      tokenSelects.push(`?token${i}`);
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
          );
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
          );
        }
      }
    });

    let q = '';
    if (countResults) {
      q = `
                SELECT (count(*) as ?count) where {
                    ${token0}
                    ${lines}
                    ${tokens.join('\r\n')}
                }
            `;
    } else {
      q = `
            select distinct ${tokenSelects.join(' ')}
            where {
                ${token0}
                ${lines}
                ${tokens.join('\r\n')}
            }
            # order by ?text
            offset ${qp.offset}
            limit ${qp.limit}
            `;
    }

    return q;
  }

  protected _jsonToObject(bindings: any): TextPassage[] {
    interface typeValue {
      type: string;
      value: string;
    }
    let instances: TextPassage[] = [];

    bindings.forEach(element => {
      let tokenIds: string[] = [];
      const values: typeValue[] = Object.values(element) as typeValue[];
      values.forEach(val => {
        tokenIds.push(val.value);
      });
      this.getTextpassage(tokenIds[0], tokenIds[-1]).then(v => instances.push(v));
    });
    return instances;
  }

  private _sparqlTextPassage(startTokenId: string, endTokenId?: string): string {
    let q: string = '';
    if (endTokenId) {
      q = `
                select distinct ?text ?line ?lineN ?token ?n ?index ?content
                where {
                    {
                        select ?text ?token ?n
                        where {
                            <${startTokenId}>
                                mhdbdbxml:partOf ?text ;
                                mhdbdbxml:n ?nF .

                            <${endTokenId}>
                                mhdbdbxml:partOf ?text ;
                                mhdbdbxml:n ?nL .

                            ?token
                                mhdbdbxml:partOf ?text ;
                                mhdbdbxml:n ?n;
                            .
                            filter (?n>=?nF && ?n<=?nL)
                        }
                    }
                    ?token
                        mhdbdbxml:parent ?line ;
                        mhdbdbxml:firstChild/mhdbdbxml:content ?content ;
                    .
                    ?line
                        a tei:l ;
                        mhdbdbxml:n ?lineN;
                    .
                }
                order by ?n
            `;
    } else {
      q = `
                select distinct ?text ?line ?lineN ?token ?n ?index ?content
                where {
                    <${startTokenId}>
                        mhdbdbxml:parent ?line ;
                    .

                    ?line
                        a tei:l ;
                        mhdbdbxml:n ?lineN;
                    .

                    ?token
                        mhdbdbxml:parent ?line ;
                        mhdbdbxml:partOf ?text ;
                        mhdbdbxml:n ?n ;
                        mhdbdbxml:firstChild/mhdbdbxml:content ?content ;
                    .
                }
                order by ?n
            `;
    }

    return q;
  }

  private _jsonToObjectTextPassage(bindings): Promise<TextPassage> {
    return new Promise<TextPassage>((resolve, reject) => {
      if (bindings) {
        this.textService.getText(bindings[0].text.value).then(
          text => {
            const lineIds: string[] = [...Array.from(new Set(bindings.map(row => row.line.value as string)))] as string[];
            let lines: Line[] = [];
            lineIds.forEach(lineId => {
              let rows = bindings.filter(element => element.line.value === lineId);
              let tokens: Token[] = [];
              rows.forEach(row => {
                const token = new Token(row.token.value, row.n.value, row.content.value);
                tokens.push(token);
              });
              let line = new Line(lineId, bindings.find(element => element.line.value === lineId).lineN.value, tokens);
              lines.push(line);
            });
            const textPassage = new TextPassage(lines, text);
            resolve(textPassage);
          },
          error => {
            reject(error);
          }
        );
      } else {
        resolve(undefined);
      }
    });
  }

  public getTextpassage(startTokenId: string, endTokenId?: string): Promise<TextPassage> {
    const query = this._sparqlTextPassage(startTokenId, endTokenId);
    return new Promise<TextPassage>((resolve, reject) => {
      this._sq.query(query).then(
        data => {
          const r = this._jsonToObjectTextPassage(data['results']['bindings']).then(res => resolve(res));
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
