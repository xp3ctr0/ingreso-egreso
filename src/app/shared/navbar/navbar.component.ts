import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit, OnDestroy {

  nombreUsuario : string = "";
  userSubs!: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.userSubs = this.store.select('auth').subscribe(({ user }) => {this.nombreUsuario = user?.nombre!});
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }
}
