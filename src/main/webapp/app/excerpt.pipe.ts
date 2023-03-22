import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'excerpt'})
export class ExcerptPipe implements PipeTransform  {
  constructor() {}
  transform(value) {
    if (value.length > 70) {
      return value.substr(0,70) + "...";
    }
    return value;
  }
}
