import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'seeAlso' })
export class SeealsoPipe implements PipeTransform {
  transform(value: string): string {
    if (value.includes("Lexer")) {
      return "Lexer";
    }

    if (value.includes("medieval-plants.org")) {
      return "MPS";
    }

    return value;
  }
}
