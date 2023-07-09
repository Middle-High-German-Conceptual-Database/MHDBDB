import { Person } from '../indices/person/person.class';
import { AuthorsI, DateOfCreationI, DatePrecision, MhdbdbIdLabelEntity } from 'app/shared/baseIndexComponent/baseindexcomponent.class';

export class WorkClass extends MhdbdbIdLabelEntity {
  public authorLabel: string;

  //implements AuthorsI, DateOfCreationI {
  // public authors: Person[];
  // public dateOfCreation: DatePrecision

  constructor(public id: string, public label: string, public _authorLabel: string) // authors: Person[],
  // date: Date,
  // precision: Date,

  {
    super(id, label);
    this.authorLabel = _authorLabel;
    // this.authors = authors
    // this.dateOfCreation = new DatePrecision(date, precision)
  }
}

export class SeriesClass extends MhdbdbIdLabelEntity {
  //implements AuthorsI, DateOfCreationI {
  // public authors: Person[];
  // public dateOfCreation: DatePrecision

  constructor(public id: string, public label: string) // authors: Person[],
  // date: Date,
  // precision: Date,

  {
    super(id, label);
    // this.authors = authors
    // this.dateOfCreation = new DatePrecision(date, precision)
  }
}

export class WorkMetadataClass extends WorkClass implements AuthorsI, DateOfCreationI {
  //implements AuthorsI, DateOfCreationI {

  public authors: Person[];

  public sameAs: any[];

  public instances: any[];
  public dateOfCreation: DatePrecision;

  public authorLabel: string;
  public authorSameAs: any[];

  public genreForm: string[];
  public genreFormInstance: string[];

  public genreFormMainParent: string[];
  public genreFormMainParentInstance: string[];

  constructor(
    public id: string,
    public label: string,

    authors: Person[],

    sameAs: any[],
    authorSameAs: any[]
  ) {
    super(id, label, '');
    this.sameAs = sameAs;
    this.authors = authors;
    this.authorSameAs = authorSameAs;
  }
}
