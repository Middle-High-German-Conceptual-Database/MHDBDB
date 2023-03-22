import { Person } from '../indices/person/person.class';
import {
  AuthorsI,
  DateOfCreationI,
  DatePrecision,
  MhdbdbIdLabelEntity
} from "app/shared/baseIndexComponent/baseindexcomponent.class";

export class WorkClass extends MhdbdbIdLabelEntity implements AuthorsI, DateOfCreationI {
    public authors: Person[];
    public dateOfCreation: DatePrecision

    constructor(
        public id: string,
        public label: string,
        authors: Person[],
        date: Date,
        precision: Date,

    ) {
        super(id, label)
        this.authors = authors
        this.dateOfCreation = new DatePrecision(date, precision)
    }
}
