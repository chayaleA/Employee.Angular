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

import { DataTablesModule } from "angular-datatables";
@NgModule({
    declarations: [EmployeeListComponent, AddEmployeeComponent, EditEmployeeComponent, EmployeeCardComponent],
    imports: [CommonModule, RouterLink, HttpClientModule, RouterLink,
        ReactiveFormsModule, FormsModule,BrowserModule, DataTablesModule],
    providers: [AuthGuardService, EmployeeService, JobService],
    exports: [EmployeeListComponent, AddEmployeeComponent, EditEmployeeComponent, EmployeeCardComponent]
})
export class EmployeesModule {

}