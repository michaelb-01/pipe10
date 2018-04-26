import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(value: any[], query: string): any[] {
    if (!value) return [];

    return value.filter(item => {
        var str = JSON.stringify(item);

        if (str.toLowerCase().indexOf(query.toString().toLowerCase()) !== -1) {
          return true;
        }
    });

  }
}