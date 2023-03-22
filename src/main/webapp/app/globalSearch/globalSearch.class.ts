import { classFilterT } from '../shared/mhdbdb-graph.service'
import {ClassTypeI, MhdbdbIdLabelEntity} from "app/shared/baseIndexComponent/baseindexcomponent.class";

export class GlobalSearchEntityClass extends MhdbdbIdLabelEntity implements ClassTypeI {
    constructor(
        public id: string,
        public label: string,
        public type: classFilterT
    ) {
      super(id, label)
    }
}
