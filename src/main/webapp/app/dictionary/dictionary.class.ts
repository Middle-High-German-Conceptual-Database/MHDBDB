import { Concept  } from '../concept/concept.class'
import {
  CompoundsI, FormsI, MhdbdbIdEntity,
  MhdbdbIdLabelEntity,
  PosI,
  SensesI,
  SubTermsI
} from "app/shared/baseIndexComponent/baseindexcomponent.class";
import {PoS} from "app/shared/pos/pos.class";

export class WordClass extends MhdbdbIdLabelEntity implements PosI, SensesI, SubTermsI, CompoundsI, FormsI {
    public lemma: string
    public pos: PoS[]
    public senses: SenseClass[]
    public subTerms: WordClass[]
    public compounds: WordClass[]
    public forms: string[]

    public texts: PoS[]

    constructor(
        id: string,
        lemma: string,
        pos : PoS[] = [],
        senses : SenseClass[] = [],
        subTerms: WordClass[] = [],
        compounds: WordClass[] = [],
        forms: string[] = [],
        texts: PoS[] = []
    ) {
        super(id, lemma)
        this.lemma= lemma
        this.pos= pos
        this.senses= senses
        this.subTerms= subTerms
        this.compounds = compounds
        this.forms= forms
        this.texts=texts
    }
}

export class SenseClass extends MhdbdbIdEntity {
    public id: string
    public index: number
    public concepts: Concept[]
}
