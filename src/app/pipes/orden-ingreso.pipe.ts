import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso',
})
export class OrdenIngresoPipe implements PipeTransform {
  transform(item: IngresoEgreso[]): IngresoEgreso[] {
    return item.slice().sort((a, b) => {
      if (a.tipo === 'Ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
