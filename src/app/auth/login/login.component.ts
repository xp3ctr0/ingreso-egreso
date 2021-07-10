import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      //nombre: ['', [Validators.required, Validators.minLength]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength]],
    });
  }

  loginUsuario() {
    if (this.loginForm.invalid) {
      return;
    }
    Swal.fire({
      title: 'Espere Por favor!',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const { correo, password } = this.loginForm.value;
    this.auth
      .loginUsuario(correo, password)
      .then((promise) => {
        console.log(promise);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          //footer: '<a href="">Why do I have this issue?</a>'
        });
      });
  }
}
