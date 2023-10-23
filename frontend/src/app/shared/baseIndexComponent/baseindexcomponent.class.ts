import { SenseClass as Sense, WordClass as Word } from '../../dictionary/dictionary.class';
import { Person } from '../../indices/person/person.class';
import { classFilterT as ClassTypeFilterT } from '../mhdbdb-graph.service';
import { PoS } from '../pos/pos.class';
import { Utils } from '../utils';

// Interfaces

export interface IdI {
    id: string;
    strippedId: string;
}

export interface LabelI {
    label: string;
}

export interface AltLabelI {
    altLabels?: string[];
}

export interface IdLabelI extends IdI, LabelI, AltLabelI { }

export interface PosI {
    pos: PoS[]
}

export interface SensesI {
    senses: Sense[]
}

export interface SubTermsI {
    subTerms: Word[]
}

export interface CompoundsI {
    compounds: Word[]
}

export interface FormsI {
    forms: string[]
}

export interface ClassTypeI {
    type: ClassTypeFilterT
}

export interface BirthI {
    placeOfBirthId: string;
    placeOfBirthLabel: string;
    dateOfBirth: DatePrecision;
}

export interface DeathI {
    placeOfDeathId: string;
    placeOfDeathLabel: string;
    dateOfDeath: DatePrecision;
}

export interface AuthorsI {
    authors: Person[]
}

export interface DateOfCreationI {
    dateOfCreation: DatePrecision
}

interface DatePrecisionI {
    date: Date,
    precision: Date
}

export interface SkosConceptI extends IdLabelI {
    broaderIds?: string[];
    narrowerIds?: string[];
}

// Classes
export class MhdbdbEntity {

}

export class MhdbdbIdEntity extends MhdbdbEntity implements IdI {
    public strippedId: string;

    constructor(
        public id: string,
    ) {
        super()
        this.strippedId = Utils.removeNameSpace(id);
    }
}

export class MhdbdbIdLabelEntity extends MhdbdbIdEntity implements IdLabelI {
    constructor(
        public id: string,
        public label: string,
    ) {
        super(id)
    }
}

export class DatePrecision implements DatePrecisionI {
    public date: Date
    public precision: Date
    constructor(
        date: Date,
        precision: Date
    ) {
        this.date = date
        this.precision = precision
    }
}