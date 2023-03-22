import { MhdbdbIdLabelEntity, IdLabelI, SkosConceptI } from '../baseIndexComponent/baseindexcomponent.class'

export class SkosConcept extends MhdbdbIdLabelEntity implements IdLabelI, SkosConceptI {
    public broaderIds?: string[];
    public narrowerIds?: string[];

    constructor(
        public id: string,
        public label: string,
    ) {
        super(id, label)
    }
}
