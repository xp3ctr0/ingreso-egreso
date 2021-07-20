import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import * as IngresosEgresoActions from '../../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs!: Subscription;
  ingresosSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        console.log(user);
        this.ingresosSubs = this.ingresoEgresoService
          .initIngresosEgresosListener(user?.uid!)
          .subscribe(ingresosEgresosFB => {
            console.log(ingresosEgresosFB);
            this.store.dispatch(
              IngresosEgresoActions.SetItems({ items: ingresosEgresosFB })
            );
          });
      });
  }
}
