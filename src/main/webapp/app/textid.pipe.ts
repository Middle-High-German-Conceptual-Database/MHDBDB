import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'textId'})
export class TextIdPipe implements PipeTransform  {
  constructor() {}
  transform(value) {
      const t = value.split('#');
      if (t.length > 0) {
        const ta = t[0];
        const tb = ta.split('/');
        const te = tb[tb.length - 1];
        return te;
      }
      return value;
  }
}
