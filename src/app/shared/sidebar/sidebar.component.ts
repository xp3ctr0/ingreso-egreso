import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit,OnDestroy {

  nombreUsuario:string = "";
  userSubs!:Subscription;

  constructor(private auth: AuthService, private router: Router,private store:Store<AppState>) {}


  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth').subscribe(({user})=>{
      //console.log("===> "+user?.nombre);
      this.nombreUsuario = user?.nombre!;
    })
  }

  logout() {
    Swal.fire({
      title: 'Cerrando Sesion!',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.auth
      .logout()
      .then(() => {
        Swal.close();
        this.router.navigate(['/login']);
      })
      .catch((err) => console.error(err));
  }

}

