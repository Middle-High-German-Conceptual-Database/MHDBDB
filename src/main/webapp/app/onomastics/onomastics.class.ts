import {SkosConcept} from "app/shared/skos/skos.class";

export class NameConcept extends SkosConcept {


  constructor(
    public id: string,
    public label: string,
  ) {
    super(id, label)
  }
}
