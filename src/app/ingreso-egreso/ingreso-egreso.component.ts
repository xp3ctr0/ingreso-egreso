import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import * as uiActions from '../shared/ui.actions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit,OnDestroy {
  ingresoForm!: FormGroup;
  tipo: string = 'Ingreso';
  loading: boolean = false;
  uiSubscripcion!: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoServ: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    this.uiSubscripcion.unsubscribe();
  }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
    this.uiSubscripcion = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  guardar() {
    // console.log(this.ingresoForm.value);
    // console.log(this.tipo);
    //console.log(this.loading);
    if (this.ingresoForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoServ
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        //console.log('exito!');
        this.ingresoForm.reset();
        Swal.fire('Registro Creado!', descripcion, 'success');
      })
      .catch((err) => {
        //console.warn(err);
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });

    setTimeout(() => {
      // cancelar Loading
      this.store.dispatch(uiActions.stopLoading());

    }, 1000);
  }
}
