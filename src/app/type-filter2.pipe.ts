import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeFilter2',
  pure: false
})
export class TypeFilter2Pipe implements PipeTransform {
  transform(value:any, types:[string[]]) {
    if (value == null) {
      return null;
    }

    var str, index;

    return value.filter(item => {
        str = JSON.stringify(item);

        index = types.indexOf(item.type);

        if (index > -1) {
          return true;
        }
        else {
          return null;
        }
    });
  }
}
