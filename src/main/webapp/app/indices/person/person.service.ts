/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { LanguageService, NAMEDGRAPHS } from 'app/shared/base.imports';
import { FilterIdLabelI, MhdbdbIdLabelEntityService, OptionsI, QueryParameterI } from '../../shared/mhdbdb-graph.service';
import { Person } from "./person.class";




export interface PersonQueryParameterI extends QueryParameterI<PersonFilterI, PersonOptionsI> {}

export interface PersonFilterI extends FilterIdLabelI {}

export interface PersonOptionsI extends OptionsI {}

export const defaultPersonQP: PersonQueryParameterI =
{
    order: 'label',
    desc: false,
    limit: 10,
    offset: 0,
    lang: undefined,
    namedGraphs: NAMEDGRAPHS.get('default'),
    filter: {
        label: '',
        isLabelActive: true,
    },
    option: {
        useLucene: false
    }
}

@Injectable({ providedIn: 'root' })
export class PersonService extends MhdbdbIdLabelEntityService<PersonQueryParameterI, PersonFilterI, PersonOptionsI, Person> {    
    protected _defaultQp: PersonQueryParameterI = defaultPersonQP;
    
    constructor(
        protected _languageService: LanguageService
    ) {
        super(_languageService)
        this._languageService.getCurrent().then(v => this._defaultQp.lang = v)
    }

    _jsonToObject(bindings: any): Person[] {
        let results: Person[] = super._jsonToObject(bindings) as Person[]
        return results
    }

    _sparqlQuery(
        qp: PersonQueryParameterI,
        countResults: boolean = false
    ): string {
        console.warn(NAMEDGRAPHS.get('default'))
        // filters
        let filters = []

        let instanceSelector = `?id a dhpluso:Person .                                                                 
                                ?id rdfs:label ?label .

                                filter(langMatches( lang(?label), "${qp.lang}" ))`

        // label query
        let labelQuery = ''
        if (qp.filter.isLabelActive) {
            if (qp.filter.id || qp.option.useLucene === false || !('label' in qp.filter && qp.filter.label != '')) {
                labelQuery = instanceSelector
            } else { // Lucene query
                labelQuery = `
                        ?search a luc-index:work ;
                        luc:query "title:${this._labelFilterGenerator(qp.filter.label, qp.option.useLucene)}" ;
                        luc:entities ?id .                            
                        `
            }
            // Title Filter (regexp mode)
            if (!qp.filter.id && qp.option.useLucene === false && 'label' in qp.filter && qp.filter.label != '') {
                filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label)}", "i"))`)
            }
        }

        let instanceSelect = ''
        if (qp.filter.id) {
            instanceSelect = `    
                SELECT DISTINCT ?id ?label
                WHERE {             
                    ${this._sparqlGenerateBinding(qp.filter.id)}
                    ${labelQuery}  
                }                
            `
        } else {
            instanceSelect = `                       
                SELECT DISTINCT ?id ?label
                WHERE {                            
                    ${labelQuery}                                
                    ${filters.join("\n")}
                } 
            `
        }


        let q = ""
        if (countResults) {
            q = `
                SELECT (count(*) as ?count) 
                ${this._sparqlNamedGraph(qp.namedGraphs)}
                where {
                    {
                        ${instanceSelect}
                    }
                }
                
            `
        } else {
            q = `
                SELECT DISTINCT
                    ?id
                    ?label
                    ?placeOfBirthId
                    ?placeOfBirthLabel
                    ?dateOfBirth
                    ?dateOfBirthPrecision
                    ?placeOfDeathId
                    ?placeOfDeathLabel
                    ?dateOfDeath
                    ?dateOfDeathPrecision
                ${this._sparqlNamedGraph(qp.namedGraphs)}
                WHERE {
                    # Bindings
                    ${this._sparqlGenerateBinding(qp.filter.id)}
                    {
                        ${instanceSelect}
                        ${this._sparqlOrder(qp.order, qp.desc)}
                        ${this._sparqlLimitOffset(qp.limit, qp.offset)}
                    }

                    # Birth
                    OPTIONAL {
                        ?id dhpluso:wasBorn ?birth .
                        # Place of Birth
                        OPTIONAL {
                            ?birth dhpluso:tookPlaceAt ?placeOfBirthId .
                            ?placeOfBirthId rdfs:label ?placeOfBirthLabel .
                            filter(langMatches( lang(?placeOfBirthLabel), "${qp.lang}" ))                        
                        }
                        # Date of Birth
                        OPTIONAL {
                            ?birth dhpluso:hasTimeSpan ?birthTimeSpan .
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:inXSDDate ?birthPointDate .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:inXSDgYear ?birthPointYear .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:timePrecision ?birthPointPrecision .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasBeginning/dhpluso:inXSDDate ?birthFromDate .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasBeginning/dhpluso:inXSDgYear ?birthFromYear .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasBeginning/dhpluso:timePrecision ?birthFromPrecision .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasEnd/dhpluso:inXSDDate ?birthToDate .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasEnd/dhpluso:inXSDgYear ?birthToYear .
                            }
                            OPTIONAL {
                                ?birthTimeSpan dhpluso:hasEnd/dhpluso:timePrecision ?birthToPrecision .
                            }
                            BIND(
                                IF(
                                    BOUND(?birthPointDate),
                                    CONCAT(
                                        STR(DAY(?birthPointDate)), ".",
                                        STR(MONTH(?birthPointDate)), ".",
                                        STR(YEAR(?birthPointDate))
                                    ),
                                    IF(
                                        BOUND(?birthPointYear),
                                        STR(?birthPointYear),
                                        IF(
                                            BOUND(?birthFromDate) && BOUND(?birthToDate),
                                            CONCAT(
                                                STR(DAY(?birthFromDate)), ".",
                                                STR(MONTH(?birthFromDate)), ".",
                                                STR(YEAR(?birthFromDate)), "–",
                                                STR(DAY(?birthToDate)), ".",
                                                STR(MONTH(?birthToDate)), ".",
                                                STR(YEAR(?birthToDate))
                                            ),
                                            IF(
                                                BOUND(?birthFromYear) && BOUND(?birthToYear),
                                                CONCAT(
                                                    STR(?birthFromYear), "–",
                                                    STR(?birthToYear)
                                                ),
                                                ?nothing
                                            )
                                        )
                                    )
                                )
                                AS ?dateOfBirth
                            )
                            BIND(
                                IF(
                                    BOUND(?birthPointPrecision),
                                    ?birthPointPrecision,
                                    IF(
                                        BOUND(?birthFromPrecision),
                                        ?birthFromPrecision,
                                        ?nothing
                                    )
                                )
                                AS ?dateOfBirthPrecision
                            )
                        }
                    }

                    # Death
                    OPTIONAL {
                        ?id dhpluso:wasBorn ?death .
                        # Place of Death
                        OPTIONAL {
                            ?death dhpluso:tookPlaceAt ?placeOfDeathId .
                            ?placeOfDeathId rdfs:label ?placeOfDeathLabel .
                            filter(langMatches( lang(?placeOfDeathLabel), "${qp.lang}" ))
                        }
                        # Date of Death
                        OPTIONAL {
                            ?death dhpluso:hasTimeSpan ?deathTimeSpan .
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:inXSDDate ?deathPointDate .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:inXSDgYear ?deathPointYear .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:timePrecision ?deathPointPrecision .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasBeginning/dhpluso:inXSDDate ?deathFromDate .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasBeginning/dhpluso:inXSDgYear ?deathFromYear .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasBeginning/dhpluso:timePrecision ?deathFromPrecision .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasEnd/dhpluso:inXSDDate ?deathToDate .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasEnd/dhpluso:inXSDgYear ?deathToYear .
                            }
                            OPTIONAL {
                                ?deathTimeSpan dhpluso:hasEnd/dhpluso:timePrecision ?deathToPrecision .
                            }
                            BIND(
                                IF(
                                    BOUND(?deathPointDate),
                                    CONCAT(
                                        STR(DAY(?deathPointDate)), ".",
                                        STR(MONTH(?deathPointDate)), ".",
                                        STR(YEAR(?deathPointDate))
                                    ),
                                    IF(
                                        BOUND(?deathPointYear),
                                        STR(?deathPointYear),
                                        IF(
                                            BOUND(?deathFromDate) && BOUND(?deathToDate),
                                            CONCAT(
                                                STR(DAY(?deathFromDate)), ".",
                                                STR(MONTH(?deathFromDate)), ".",
                                                STR(YEAR(?deathFromDate)), "–",
                                                STR(DAY(?deathToDate)), ".",
                                                STR(MONTH(?deathToDate)), ".",
                                                STR(YEAR(?deathToDate))
                                            ),
                                            IF(
                                                BOUND(?deathFromYear) && BOUND(?deathToYear),
                                                CONCAT(
                                                    STR(?deathFromYear), "–",
                                                    STR(?deathToYear)
                                                ),
                                                ?nothing
                                            )
                                        )
                                    )
                                )
                                AS ?dateOfDeath
                            )
                            BIND(
                                IF(
                                    BOUND(?deathPointPrecision),
                                    ?deathPointPrecision,
                                    IF(
                                        BOUND(?deathFromPrecision),
                                        ?deathFromPrecision,
                                        ?nothing
                                    )
                                )
                                AS ?dateOfDeathPrecision
                            )
                        }
                    }
                    ${filters.join("\n")}
                }`;
        }        
        return q
    }
}
