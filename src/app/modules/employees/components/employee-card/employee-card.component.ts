import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent {
  
  @Input()
  employeeToShow: Employee;

  @Output()
  deleteEmployeeEvent = new EventEmitter<number>();
  
  constructor(private _router: Router) {

  }

  ngOnInit(): void {
  }

  edit() {
    this._router.navigate(['/editEmployee/' + this.employeeToShow.id]);
  }

  onDeleteEmployee(id: number) {
    this.deleteEmployeeEvent.emit(id);
  }
}
