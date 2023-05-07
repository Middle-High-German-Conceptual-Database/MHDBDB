/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { NAMEDGRAPHS } from 'app/app.constants';
import { LanguageService } from 'app/shared/language.service';
import {
  classFilter,
  classFilterT,
  FilterClassI,
  FilterIdI,
  FilterLabelI,
  FilterSeriesI, FilterSeriesLabelI,
  MhdbdbIdLabelEntityService,
  OptionsI,
  QueryParameterI
} from "../shared/mhdbdb-graph.service";
import { Utils } from '../shared/utils';
import { GlobalSearchEntityClass } from './globalSearch.class';

export interface GlobalSearchQueryParameterI extends QueryParameterI<GlobalSearchFilterI, GlobalSearchOptionsI> { }

export interface GlobalSearchFilterI extends FilterIdI, FilterSeriesI, FilterLabelI, FilterClassI { }

export interface GlobalSearchOptionsI extends OptionsI { }

export const defaultGlobalSearchQP: GlobalSearchQueryParameterI =
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
        classFilter: classFilter.map(x => x.classFilter),
        isClassFilterActive: true,
        seriesFilter: [],
        isSeriesFilterActive: true
    },
    option: {
        useLucene: false
    }
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService extends MhdbdbIdLabelEntityService<GlobalSearchQueryParameterI, GlobalSearchFilterI, GlobalSearchOptionsI, GlobalSearchEntityClass> {
    protected _defaultQp: GlobalSearchQueryParameterI = defaultGlobalSearchQP;

    constructor(
        protected _languageService: LanguageService
    ) {
        super(_languageService)
        this._languageService.getCurrent().then(v => this._defaultQp.lang = v)
    }

    protected _sparqlQuery(
        qp: GlobalSearchQueryParameterI,
        countResults: boolean = false
    ): string {
        let selectors = []

        const selectorPlace = `
            {
                ?id a dhpluso:Place .
                ?id rdfs:label ?label .
                Bind('Place' as ?type)
                filter(langMatches( lang(?label), "${qp.lang}" ))
            }
        `

        const selectorPerson = `
            {
                ?id a dhpluso:Person .
                ?id rdfs:label ?label .
                Bind('Person' as ?type)
                filter(langMatches( lang(?label), "${qp.lang}" ))
            }
        `

        const selectorWork = `
            {
                ?id a dhpluso:Text ;
                    dhpluso:hasExpression ?text .
                ?text a dhpluso:Text .
                ?electronic dhpluso:instanceOf ?text ;
                            a dhpluso:Electronic .
                ?id rdfs:label ?label .
                Bind('Work' as ?type)
                filter(langMatches( lang(?label), "${qp.lang}" ))
            }
        `

        const selectorWord = `
            {
                ?id a dhpluso:Word .
                ?id dhpluso:canonicalForm/dhpluso:writtenRep ?label .
                Bind('Word' as ?type)
            }
        `

        const selectorConceptualSystem = `
            {
                ?id a skos:Concept .
                ?id skos:inScheme mhdbdbi:conceptualSystem .

                ?id skos:prefLabel ?label .
                Bind('conceptualSystem' as ?type)
                filter(langMatches( lang(?label), "${qp.lang}" ))
                FILTER NOT EXISTS {
                    ?id owl:deprecated ?dp .
                }
            }
        `

        const selectorNameSystem = `
            {
                ?id a skos:Concept .
                ?id skos:inScheme mhdbdbi:nameSystem .
                ?id skos:prefLabel ?label .
                Bind('nameSystem' as ?type)
                filter(langMatches( lang(?label), "${qp.lang}" ))
                FILTER NOT EXISTS {
                    ?id owl:deprecated ?dp .
                }
            }
        `

        if (
            (
                qp.filter.isClassFilterActive &&
                qp.filter.classFilter.includes('Person' as unknown as classFilterT)
            ) || !qp.filter.isClassFilterActive
        ) {
            selectors.push(selectorPerson)
        }
        if (
            (
                qp.filter.isClassFilterActive &&
                qp.filter.classFilter.includes('Place' as unknown as classFilterT)
            ) || !qp.filter.isClassFilterActive
        ) {
            selectors.push(selectorPlace)
        }
        if ((
            qp.filter.isClassFilterActive &&
            qp.filter.classFilter.includes('Word' as unknown as classFilterT)
        ) || !qp.filter.isClassFilterActive) {
            selectors.push(selectorWord)
        }
        if ((
            qp.filter.isClassFilterActive &&
            qp.filter.classFilter.includes('Work' as unknown as classFilterT)
        ) || !qp.filter.isClassFilterActive) {
            selectors.push(selectorWork)
        }
        if ((
            qp.filter.isClassFilterActive &&
            qp.filter.classFilter.includes('conceptualSystem' as unknown as classFilterT)
        ) || !qp.filter.isClassFilterActive) {
            selectors.push(selectorConceptualSystem)
        }
        if ((
            qp.filter.isClassFilterActive &&
            qp.filter.classFilter.includes('nameSystem' as unknown as classFilterT)
        ) || !qp.filter.isClassFilterActive) {
            selectors.push(selectorNameSystem)
        }


        let filters = []

        // label query
        if (qp.filter.isLabelActive) {
            // Title Filter (regexp mode)
            if (!qp.filter.id && 'label' in qp.filter && qp.filter.label != '') {
                filters.push(`filter(regex(str(?label), "${this._labelFilterGenerator(qp.filter.label)}", "i"))`)
            }
        }

        let instanceSelect = `
            ${selectors.join(' UNION ')}
            ${filters.join("\n")}
        `

        let q = ''
        if (countResults) {
            q = `
                SELECT DISTINCT (count(?id) as ?count)
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('default'))}
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('dict'))}
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('vocab'))}
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
                    (str(sample(?label)) as ?label)
                    ?type
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('default'))}
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('dict'))}
                ${this._sparqlNamedGraph(NAMEDGRAPHS.get('vocab'))}
                WHERE {
                    ${instanceSelect}
                }
                GROUP BY ?id ?type
                ${this._sparqlOrder(qp.order, qp.desc)}
                ${this._sparqlLimitOffset(qp.limit, qp.offset)}
        `
        }
      console.warn(q)
        return q
    }

    protected _jsonToObject(bindings: any): GlobalSearchEntityClass[] {
        let processedIds: String[] = [];
        let results: GlobalSearchEntityClass[] = []
        bindings.forEach(
            row => {
                try {
                    if (!(processedIds.includes(row.id.value))) {
                        let element = {} as GlobalSearchEntityClass
                        element.id = row.id.value
                        element.label = row.label.value
                        element.strippedId = Utils.removeNameSpace(element.id)
                        element.type = row.type.value as unknown as classFilterT
                        for (const key in row) {
                            if (row[key].value != null) {
                                element[key] = row[key].value
                            }
                        }
                        results.push(element)
                        processedIds.push(element.id)
                    }
                }
                catch (error) {
                    console.error('jsonToObject: Error reading BaseIndexComponentEntry entry.', error);
                    console.error(row)
                }
            }
        )
        return results
    }
}
