import { AnnotationClass } from './annotation.class';
import {
  MhdbdbEntity,
  MhdbdbIdEntity,
  MhdbdbIdLabelEntity
} from "app/shared/baseIndexComponent/baseindexcomponent.class";

export class ElectronicText extends MhdbdbIdLabelEntity {
    constructor(
        public id: string,
        public label: string,
        public rootId: string,
        public electronicId: string,
        public workId: string,
    ) {
        super(id, label)
    }
}

export class XmlElement {
    constructor(
        public id: string,
        public n: number,
    ) {

    }
}

export class Div extends XmlElement {
    public type: string;
    public children: XmlElement[];
    public parent?: Div;
    public label?: string;
    constructor(
        public id: string,
        public n: number,

    ) {
        super(id, n)
    }
}

export class Line extends XmlElement {
    public parent?: Div;
    public isVerse?: boolean;
    public text?: ElectronicText;
    constructor(
        public id: string,
        public n: number,
        public tokens: Token[]

    ) {
        super(id, n)
    }
}

export class TokenType {
    public tokens?: Token[];
    constructor(
        public content: string
    ) {
    }
}

export class TextPassage extends MhdbdbEntity {
    public highlightedTokenIds?: string[]
    constructor(
        public lines:Line[],
        public text: ElectronicText
    ) {
        super()
    }
}

export class Token extends MhdbdbIdEntity {
    public type?: TokenType;
    public annotations?: AnnotationClass[];
    public parent?: Line;
    public cssClasses?: string[]
    public quote?: Quote
    constructor(
        public id: string,
        public n: number,
        public content: string
    ) {
        super(id)
    }
}

export class Quote {
    constructor(
        public text: ElectronicText,
        public line: Line
    ) {}
}

export class Kwic {
    constructor(
        public left: Token[],
        public center: Token,
        public right: Token[]
    ) {

    }
}
