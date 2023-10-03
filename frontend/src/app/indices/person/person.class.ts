import { BirthI, DatePrecision, DeathI, MhdbdbIdLabelEntity as MhdbdbEntityIdLabel } from '../../shared/baseIndexComponent/baseindexcomponent.class';


export class PersonClass extends MhdbdbEntityIdLabel  {
    constructor(
        public id: string,
        public label: string
    ) {
        super(id, label)
    }
}

export class Person extends MhdbdbEntityIdLabel implements BirthI, DeathI  {
    public placeOfBirthId: string;
    public placeOfBirthLabel: string;
    public dateOfBirth: DatePrecision;
    public placeOfDeathId: string;
    public placeOfDeathLabel: string;
    public dateOfDeath: DatePrecision;

    constructor(
        public id: string,
        public label: string,
        placeOfBirthId: string = undefined,
        placeOfBirthLabel: string = undefined,
        dateOfBirth: Date = undefined,
        dateOfBirthPrecision: Date = undefined,
        placeOfDeathId: string = undefined,
        placeOfDeathLabel: string = undefined,
        dateOfDeath: Date = undefined,
        dateOfDeathPrecision: Date = undefined,
    ) {
        super(id, label)
        this.placeOfBirthId = placeOfBirthId
        this.placeOfBirthLabel = placeOfBirthLabel
        this.dateOfBirth = new DatePrecision(dateOfBirth, dateOfBirthPrecision)
        this.placeOfDeathId = placeOfDeathId
        this.placeOfDeathLabel = placeOfDeathLabel
        this.dateOfDeath = new DatePrecision(dateOfDeath, dateOfDeathPrecision)
    }
}
