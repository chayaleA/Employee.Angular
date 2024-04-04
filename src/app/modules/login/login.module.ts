import { NgModule } from "@angular/core";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginRoutingModule } from "./login-routing.module";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { LoginService } from "./services/login.service";

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
    imports: [CommonModule, RouterLink, HttpClientModule, RouterLink,
        ReactiveFormsModule, FormsModule, LoginRoutingModule],
    providers: [LoginService],
    exports: [LoginComponent, RegisterComponent]
})
export class loginModule{

}