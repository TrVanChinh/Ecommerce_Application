import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noEncodeUri'
})
export class NoEncodeUriPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/%20/g, '-'); 
  }

}
