import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;
  passwordVisible = false;

  username: string;
  password: string;

  constructor(private _loginService: LoginService, private _router: Router) {

  }
  showPassword: boolean = false;
  
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleShowPassword() {
      this.showPassword = !this.showPassword;
  }

  checkUser(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill in all fields!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    this._loginService.Login(this.username, this.password).subscribe(
      (res) => {
        console.log("Response:", res);
        if (res.body && res.body.token) {
          const data = res.body;
          console.log("token", data.token);
          localStorage.setItem("accessToken", data.token);

          const parts = data.token.split('.');
          const payload = JSON.parse(atob(parts[1]));
          const exp = payload['exp'];
          localStorage.setItem("exp", exp);

          this._router.navigate(["home"])
        } else {
          console.error("Response body is empty or does not contain 'token'");
        }
      },
      (error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "User name or paswword are not correct, Try again!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
}

