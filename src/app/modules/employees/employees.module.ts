import { NgModule } from "@angular/core";
import { EmployeeListComponent } from "./components/employee-list/employee-list.component";
import { AddEmployeeComponent } from "./components/add-employee/add-employee.component";
import { EditEmployeeComponent } from "./components/edit-employee/edit-employee.component";
import { AuthGuardService } from "./services/auth-gurd.service";
import { EmployeeService } from "./services/employee.service";
import { JobService } from "./services/job.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { EmployeeCardComponent } from "./components/employee-card/employee-card.component";
import { MatDialogModule } from '@angular/material/dialog'
import { DataTablesModule } from "angular-datatables";
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { EmailDialogComponentComponent } from "./components/email-dialog-component/email-dialog-component.component";

@NgModule({
    declarations: [EmployeeListComponent, AddEmployeeComponent, EditEmployeeComponent, EmployeeCardComponent, EmailDialogComponentComponent],
    imports: [CommonModule, RouterLink, HttpClientModule, RouterLink,
        ReactiveFormsModule, FormsModule, BrowserModule, DataTablesModule, MatButtonModule,MatInputModule, MatDialogModule, MatFormFieldModule],
    providers: [AuthGuardService, EmployeeService, JobService],
    exports: [EmployeeListComponent, AddEmployeeComponent, EditEmployeeComponent, EmployeeCardComponent, EmailDialogComponentComponent]
})

export class EmployeesModule {

}