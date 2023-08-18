import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rdfInstance' })
export class RdfInstancePipe implements PipeTransform {
  transform(value: string): string {
    if (value.indexOf("#") != -1) {
      return value.split('#')[1];
    } else {
      // wir nehmen / (instanz) an
      const s = value.split('/');
      return s[s.length-1];
    }

  }
}
