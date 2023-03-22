import { SkosConcept } from '../skos/skos.class'

export class PoS extends SkosConcept {
    constructor(
        public id: string,
        public label: string,
    ) {
        super(id, label)
    }
}
