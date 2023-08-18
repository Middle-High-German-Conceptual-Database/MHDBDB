import { OnChanges } from '@angular/core';
/* eslint-disable no-console */
import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from '@angular/cdk/tree';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Directive, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { HistoryService } from "../../historyService";
import { skosFilterMap, skosOptionsMap, skosQueryParameterMap, SkosConceptService } from "../../skos/skos.service";
import { SkosConceptI } from "../baseindexcomponent.class";
import { FormControl } from "@angular/forms";
import { SkosConcept } from '../../skos/skos.class';

/** Flat node with expandable and level information */
export class DynamicFlatNode {
    constructor(
        public item: SkosConceptI,
        public level = 1,
        public expandable = false,
        public isLoading = false
    ) { }
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
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: 'root' })
export class DynamicDatabase<qT extends skosQueryParameterMap<f, o>, f extends skosFilterMap, o extends skosOptionsMap, c extends SkosConcept, s extends SkosConceptService<qT, f, o, c>> {
    constructor(
        public service: s
    ) {

    }

    /** Initial data from database */
    initialData(): Promise<DynamicFlatNode[]> {
        return new Promise<DynamicFlatNode[]>(resolve => {
            try {
                this.service.getTopConcepts().then(
                    topConcepts => {
                        let results: DynamicFlatNode[] = []
                        topConcepts.forEach(concept => {
                            results.push(new DynamicFlatNode(concept, 0, this.isExpandable(concept)))
                        })
                        resolve(results)
                    })
            }
            catch (e) {
                resolve([])
                console.error(e)
            }
        })
    }

    getChildren(node: DynamicFlatNode): Promise<DynamicFlatNode[]> {
        let results: DynamicFlatNode[] = []
        return new Promise<DynamicFlatNode[]>(resolve => {
            try {
                this.service.getNarrowerConcepts(node.item.id).then(
                    narrowerConcepts => {
                        narrowerConcepts.forEach(concept => {
                            results.push(new DynamicFlatNode(concept, node.level + 1, this.isExpandable(concept)))
                        })
                        resolve(results)
                    })
            }
            catch (e) {
                resolve(results)
                console.error(e)
            }
        })
    }

    isExpandable(node: SkosConceptI): boolean {
        if (node.narrowerIds && node.narrowerIds.length > 0) {
            return true
        } else {
            return false
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
export class DynamicDataSource<qT extends skosQueryParameterMap<f, o>, f extends skosFilterMap, o extends skosOptionsMap, c extends SkosConcept, s extends SkosConceptService<qT, f, o, c>> implements DataSource<DynamicFlatNode> {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }

    set data(value: DynamicFlatNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(
        private _treeControl: FlatTreeControl<DynamicFlatNode>,
        private _database: DynamicDatabase<qT, f, o, c, s>,
    ) { }

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

    /**
     * Toggle the node, remove from display list
     */
    toggleNode(node: DynamicFlatNode, expand: boolean) {
        this._database.getChildren(node).then(data => {
            const children = data.map(child => child);

            const index = this.data.indexOf(node);
            if (!children || index < 0) { // If no children, or cannot find the node, no op
                return;
            }

            node.isLoading = true;


            if (expand) {
                const nodes = children.map(child =>
                    new DynamicFlatNode(child.item, node.level + 1, child.expandable));
                this.data.splice(index + 1, 0, ...nodes);
            } else {
                let count = 0;
                for (let i = index + 1; i < this.data.length
                    && this.data[i].level > node.level; i++, count++) { }
                this.data.splice(index + 1, count);
            }

            // notify the change
            node.isLoading = false;
            this.dataChange.next(this.data);

        });


    }
}

@Directive()
export abstract class BaseIndexTreeDirective<qT extends skosQueryParameterMap<f, o>, f extends skosFilterMap, o extends skosOptionsMap, c extends SkosConcept, s extends SkosConceptService<qT, f, o, c>> implements OnInit, OnChanges {
    treeControl: FlatTreeControl<DynamicFlatNode>;    

    dataSource: DynamicDataSource<qT, f, o, c, s>;

    database: DynamicDatabase<qT, f, o, c, s>
    getLevel = (node: DynamicFlatNode) => node.level;

    isExpandable = (node: DynamicFlatNode) => node.expandable;

    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

    public concept: SkosConceptI
    
    
    // list
    allConcepts:SkosConceptI[]

    listSearch = new FormControl();
    listSearchControl = new FormControl();
    $listSearch = this.listSearch.valueChanges.pipe(
        startWith(null),
        debounceTime(200),
        switchMap((res: string) => {
            if (!res) return of(this.allConcepts);            
            return of(
                this.allConcepts.filter(x => x.label.indexOf(res) >= 0)
            );
        })
    );
    

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public locationService: Location,
        public http: HttpClient,
        public service: s,
        public historyService: HistoryService<qT, f, o, c>,
    ) {

    }

    ngOnInit(): void {
        this.ngOnChanges()
    }

    ngOnChanges(): void {
        this.database = new DynamicDatabase<qT, f, o, c, s>(this.service)
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource<qT, f, o, c, s>(this.treeControl, this.database);
        this.database.initialData().then(data => {
            this.dataSource.data = data
        })
        this.service.getAllConcepts().then(data => {
            this.allConcepts = data
        })
    }

    selectTreeNode(node: DynamicFlatNode) {        
        this.concept = node.item;
    }

    selectConcept(concept: SkosConceptI) {
        this.concept = concept
    }
}
