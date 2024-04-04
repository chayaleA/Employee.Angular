import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string;
  password: string;
  email: string;
  address: string;

  constructor(private _userService: LoginService, private _router: Router, private http: HttpClient) {

  }
  ngOnInit(): void {
  }

  addUser() {
    if (!this.username || !this.password || !this.email || !this.address) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please fill in all fields!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    else {
      this.sendEmail(this.email);
    }

  }
  sendEmail(email: string) {
    const emailData = {
      recipientEmail: email,
      subject: "Congratulation to you",
      body: "Your useName is: Admin, Password: 123456"
    }
    return this.http.post('/api/Gmail/sendEmail', emailData).subscribe(res => {
    }, err => {
      if (err.status == 200)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Username and password are sent to your email: " + email,
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(["/home"])
    })
  }
}
