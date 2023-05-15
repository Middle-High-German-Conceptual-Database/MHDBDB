import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'niceInstanceName'})
export class NiceInstanceNamePipe implements PipeTransform  {
  constructor() {}
  transform(value) {

    if (value.includes('handschriftencensus')) {
      return 'Handschriftencensus';
    }

    if (value.includes('d-nb.info')) {
      return 'DNB';
    }

    if (value.includes('wikidata.org')) {
      return 'Wikidata';
    }


    return value;
  }
}
