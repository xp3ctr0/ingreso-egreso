import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loginForm!: FormGroup;
  uiSubscripcion!: Subscription;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    this.uiSubscripcion.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      //nombre: ['', [Validators.required, Validators.minLength]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength]],
    });

    this.uiSubscripcion = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
      console.log('cargando subs');
    });
  }

  loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    // Swal.fire({
    //   title: 'Espere Por favor!',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { correo, password } = this.loginForm.value;
    this.auth
      .loginUsuario(correo, password)
      .then((promise) => {
        console.log(promise);
        // Swal.close();
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          //footer: '<a href="">Why do I have this issue?</a>'
        });
      });
  }
}
