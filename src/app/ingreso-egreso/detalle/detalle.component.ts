import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosSubs!: Subscription;
  ingresosEgresos: IngresoEgreso[] = [];

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosSubs = this.store
      .select('ingresosEgreso')
      .subscribe(({ items }) => (this.ingresosEgresos = items));
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }

  borrar(item: any) {
    //console.log('==> ' + item.uid);
    this.ingresoEgresoService
      .borrarIngresoEgreso(item.uid)
      .then(()=>Swal.fire('Borrado','Item Borrador','success'))
      .catch((err) => Swal.fire('Error',err.message,'error'));
  }
}
