import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/components/home/home.component';
import { EmployeeListComponent } from './modules/employees/components/employee-list/employee-list.component';
import { AddEmployeeComponent } from './modules/employees/components/add-employee/add-employee.component';
import { EditEmployeeComponent } from './modules/employees/components/edit-employee/edit-employee.component';
import { PageNotFoundComponent } from './modules/home/components/page-not-found/page-not-found.component';
import { AuthGuardService } from './modules/employees/services/auth-gurd.service';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full"},
  { path: "home", component: HomeComponent},
  { path: "employeesList", component: EmployeeListComponent, canActivate: [AuthGuardService]},
  { path: "addEmployee", component: AddEmployeeComponent, canActivate: [AuthGuardService]},
  { path: "editEmployee/:id", component: EditEmployeeComponent, canActivate: [AuthGuardService]},
  { path: "connection", loadChildren: () => import("./modules/login/login.module").then(m => m.loginModule)},
  { path: "logout", redirectTo: "home", pathMatch: "full"},
  { path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
  
}
