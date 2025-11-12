/* eslint-disable no-console */
import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    Component, ElementRef, Injectable, OnInit, ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SparqlQuery } from "../../shared/mhdbdb-graph.service";
import { Concept } from "../concept.class";
import { ConceptService } from '../concept.service';
import { Store } from "@ngrx/store";

/** Flat node with expandable and level information */
export class DynamicFlatNode {
    constructor(public item: string, public level = 1, public expandable = false,
        public isLoading = false) { }
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: 'root' })
export class DynamicDatabase {

    /*
    :concept_11000000 a skos:Concept , mhdbdbodict:LexicalConcept ;
      skos:broader :concept_10000000 ;
      skos:inScheme :conceptualSystem ;
      skos:prefLabel "Himmel/Atmosphäre/Himmelskörper"@de , "Sky/Atmosphere/Celestial Bodies"@en .

    SELECT  ?concept ?prefLabel
      WHERE {
          ?concept skos:broader mhdbdbi:concept_10000000 .
          ?concept a skos:Concept .
          ?concept a mhdbdbodict:LexicalConcept .
          ?concept skos:prefLabel ?prefLabel .
      }

     */

    /*
      :conceptualSystem dct:title "Begriffssystem"@de , "Conceptual System"@en ;
        a skos:ConceptScheme , mhdbdbodict:ConceptSet ;
        skos:hasTopConcept :concept_10000000 , :concept_20000000 , :concept_30000000 , :concept_90000000 .

        SELECT  ?concept ?prefLabel
      WHERE {
          mhdbdbi:conceptualSystem a skos:ConceptScheme .
          mhdbdbi:conceptualSystem a mhdbdbodict:ConceptSet .
          mhdbdbi:conceptualSystem skos:hasTopConcept ?concept .
          ?concept skos:prefLabel ?prefLabel .
      }
     */

    constructor() {

    }
}

export class CustomTreeControl<T> extends FlatTreeControl<T> {
    /**
     * Recursively expand all parents of the passed node.
     */


    expandParents(node: T) {
        const parent = this.getParent(node);
        this.expand(parent);

        if (parent && this.getLevel(parent) > 0) {
            this.expandParents(parent);
        }
    }

    /**
     * Iterate over each node in reverse order and return the first node that has a lower level than the passed node.
     */
    getParent(node: T) {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
    }

}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<DynamicFlatNode> {

    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }
    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private _treeControl: CustomTreeControl<DynamicFlatNode>,
        private _database: DynamicDatabase,
        private conceptService: ConceptService) { }

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void { }

    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
        }
    }

    getResultAsObject(data: any): Concept[] {
        // head, results
        const results = data['results']['bindings'];
        const result: Concept[] = [];

        results.forEach(function (entry) {
            const e = new Concept(entry.subject.value, entry.writtenRep.value);
            result.push(e);
        });

        return result;
    }

    getResult(data: any) {
        // head, results
        const results = data['results']['bindings'];
        const result = [];

        results.forEach(function (entry) {
            result.push(entry);
        });

        return result;
    }

    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: DynamicFlatNode, expand: boolean) {

        // @ts-ignore
        this.conceptService.getChilds(node.item.concept.value, "de").then(datat => {
            const data = this.getResult(datat);
            const children = data.map(child => child);

            const index = this.data.indexOf(node);
            if (!children || index < 0) { // If no children, or cannot find the node, no op
                return;
            }

            node.isLoading = true;

            setTimeout(() => {
                if (expand) {
                    const nodes = children.map(name =>
                        new DynamicFlatNode(name, node.level + 1, name.hasChild.value === "true" ? true : false));
                    this.data.splice(index + 1, 0, ...nodes);
                } else {
                    let count = 0;
                    for (let i = index + 1; i < this.data.length
                        && this.data[i].level > node.level; i++, count++) { }
                    this.data.splice(index + 1, count);
                }

                // notify the change
                this.dataChange.next(this.data);
                node.isLoading = false;
            }, 1000);
        });


    }
}

@Component({
    selector: 'dhpp-concept-list',
    templateUrl: './list.component.html',
    styleUrls: ['list.component.scss']
})
export class ConceptListComponent implements OnInit {
    eventsSubject: Subject<any> = new Subject<any>();
    protected sq = new SparqlQuery(this.store)
    @ViewChild('conceptsearch') conceptsearch: ElementRef;

    form: FormGroup;

    rdfData: any;

    concept: any;

    dictionary = [];
    head: string[];
    results: any[];

    value: string;

    conceptsList: string[];

    partOfSpeechList = [
        "http://mhdbdb.sbg.ac.at/ontology#NAM",
        "http://mhdbdb.sbg.ac.at/ontology#NOM",
        "http://mhdbdb.sbg.ac.at/ontology#PRP",
        "http://mhdbdb.sbg.ac.at/ontology#VRB",
        "http://mhdbdb.sbg.ac.at/ontology#ADJ",
        "http://mhdbdb.sbg.ac.at/ontology#ADV",
        "http://mhdbdb.sbg.ac.at/ontology#PRO",
    ];

    treeControl: CustomTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    getLevel = (node: DynamicFlatNode) => node.level;

    isExpandable = (node: DynamicFlatNode) => node.expandable;

    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private locationService: Location,
        private http: HttpClient,
        private conceptService: ConceptService,
        private fb: FormBuilder,
        private database: DynamicDatabase,
        public store: Store
    ) {

        // this.treeControl = new CustomTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        // this.dataSource = new DynamicDataSource(this.treeControl, database, this.conceptService);

        // conceptService.getRoot("de").then(data => {
        //   this.dataSource.data = this.getResult(data).map(concept => concept).map(name => new DynamicFlatNode(name, 0, true));
        // });

        // this.dataSource.data = database.initialData();
    }

    ngOnInit() {
        this.form = this.fb.group({
            filterSwitchLemma: false,
            filterSwitchPartOfSpeech: false,
            filterLemma: '',
            posList: this.buildPosList()
        });

        this.filter();
    }

    onConceptSearchChangeEvent(event: any) {
        // this.conceptService.findConceptsByLabel(event.target.value.toLowerCase(), "de").then(data => {
        //     this.conceptsList = this.getResult(data).map(concept => concept);
        // });
    }

    buildPosList() {
        const arr = this.partOfSpeechList.map(pos => {
            return this.fb.control(pos);
        });
        return this.fb.array(arr);
    }

    get posList(): FormArray {
        return this.form.get('posList') as FormArray;
    };

    filterChanged(event: any) {
        // wait a tick before calling filter
        setTimeout(() => {
            this.filter();
        })
    }

    buildFilterQuery() {
        let query = ` DISTINCT ?subject ?writtenRep ?pos
    WHERE {`;

        query += `?subject a mhdbdbodict:Word ;
    mhdbdbodict:sense ?sense ;
    mhdbdbodict:canonicalForm ?form .
    OPTIONAL { ?subject mhdbdbodict:partOfSpeech ?pos . }
    ?form mhdbdbodict:writtenRep ?writtenRep .`;

        if (this.form.get('filterSwitchPartOfSpeech').value === true) {

            const value = this.form.get('posList').value;

            const selectedPos = Object.assign({}, value, {
                pos: value.map((s, i) => {
                    return {
                        id: this.partOfSpeechList[i],
                        selected: s
                    }
                })
            });

            const posL = selectedPos.pos.filter(p => p.selected === true).map(p => "<" + p.id + ">").join(', ');

            query += ` FILTER (?pos IN (${posL})) `;

        }

        if (this.form.get('filterSwitchLemma').value === true) {
            const writtenRep = this.form.get('filterLemma').value;
            query += `FILTER(regex(str(?writtenRep), "${writtenRep}"))`;
        }

        query += `}`;

        return query;
    }

    filter() {
        this.sq.query(this.buildFilterQuery()).then(data => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;

            self.dictionary = this.getResult(data);

        });
    }

    previousPage() {
        this.locationService.back();
    }

    emitEventToChild(data: any) {
        this.eventsSubject.next(data);
    }

    selectTreeNode(node: any) {
        this.concept = node.item;
    }

    getResultAsObject(data: any): Concept[] {
        // head, results
        const results = data['results']['bindings'];
        const result: Concept[] = [];

        results.forEach(function (entry) {
            const e = new Concept(entry.subject.value, entry.writtenRep.value);
            result.push(e);
        });

        return result;
    }

    getResult(data: any) {
        // head, results
        const results = data['results']['bindings'];
        const result = [];

        results.forEach(function (entry) {
            result.push(entry);
        });

        return result;
    }

}
