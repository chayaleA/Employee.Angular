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
      subject: "Username && Password",
      body: `Hello,
      To get a username and password you must send an email from a registered user to this address!
      Have A Good Day!
      Business.Employees/>`
    }
    return this.http.post('/api/Gmail/sendEmail', emailData).subscribe(res => {
    }, err => {
      if (err.status == 200)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "A message is being sent to your email right now!",
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(["/home"])
    })
  }
  
}
