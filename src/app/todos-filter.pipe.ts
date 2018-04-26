import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'todosFilter'
})
export class TodosFilterPipe implements PipeTransform {

  transform(todos:any[], args?: any): any {
    return args ? todos : todos.filter(todo => !todo.done);
  }

}
