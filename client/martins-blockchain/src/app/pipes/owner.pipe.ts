import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'owner'
})
export class OwnerPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const organization = value.split("/")[6].split("=")[1].split(".")[0]
    return organization.toUpperCase();
  }

}
