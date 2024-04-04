import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  employeesList: Employee[];

  filterEmployeesList: Employee[];

  private searchSubject = new Subject<string>();

  searchSubject$: Observable<Employee[]>;

  searchText: string = "";

  showCards: boolean = JSON.parse(localStorage.getItem('showCards')) || false;

  constructor(private _employeeService: EmployeeService, private _router: Router) {

  }

  ngOnInit(): void {
    this._employeeService.getAllEmployees().subscribe(res => {
      this.filterEmployeesList = res.sort((a, b) => {
        const firstNameA = a.firstName.toLowerCase();
        const firstNameB = b.firstName.toLowerCase();
        if (firstNameA < firstNameB) {
          return -1;
        }
        if (firstNameA > firstNameB) {
          return 1;
        }
        return 0;
      });
      this.employeesList = this.filterEmployeesList;
      this.setupSearchObservable();
    }, err => {
      console.log(err);
      if (err.status == 401) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "The identification has expired!",
          showConfirmButton: false,
          timer: 1500
        });
        this._router.navigate(['/connection/login'])
      }
    })
    this.showCards = JSON.parse(localStorage.getItem('showCards')) || this.showCards;
  }

  ngOnDestroy(): void {
    this.showCards = false
    localStorage.removeItem('showCards');
  }

  showEmployeeCard() {
    this.showCards = !this.showCards;
    localStorage.setItem('showCards', JSON.stringify(this.showCards));
  }

  showEmployeeList() {
    this.showCards = !this.showCards;
    localStorage.setItem('showCards', JSON.stringify(this.showCards));
  }

  noCourses() {
    return !this.filterEmployeesList || this.filterEmployeesList.length === 0;
  }

  exportToExcel() {
    //to dhow also not active employees!?
    const data = this.employeesList.map(employee => ({
      'First Name': employee.firstName,
      'Last Name': employee.lastName,
      'ID': employee.idNumber,
      'Start Work': employee.startWork,
      "password": employee.password,
      "idNumber": employee.idNumber,
      "birthDate": employee.birthDate,
      "gender": employee.gender,
      "Job List": employee.jobList.map(job => `${job.jobName} (Manager: ${job.isManager}, Start: ${job.startJob})`).join(', '),
      "status": employee.status
    }));
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
  }
  searchEmployees(term: string): Observable<Employee[]> {
    return new Observable((observer) => {
      if (term.trim() === "")
        observer.next(this.employeesList);
      else {
        const filterList = this.filterEmployeesList.filter(employee =>
          employee?.firstName.toLowerCase().includes(term.toLowerCase()) ||
          employee?.lastName.toLowerCase().includes(term.toLowerCase()) ||
          employee?.idNumber.toLowerCase().includes(term.toLowerCase()) ||
          employee?.startWork.toString().includes(term)
        );
        observer.next(filterList)
      }
    })
  }
  printTable() {
    document.body.classList.add('print-mode');
    window.print();
    document.body.classList.remove('print-mode');
}

  onSearchInputChange(): void {
    this.searchSubject.next(this.searchText)
  }


  private setupSearchObservable(): void {
    this.searchSubject$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchEmployees(term))
    );
    this.searchSubject$.subscribe((result: Employee[]) => {
      this.filterEmployeesList = result;
    })
  }

  deleteEmployee(id: number) {
    let i = this.employeesList.findIndex(e => e.id == id);
    this._employeeService.deleteEmployee(id).subscribe(() => {
      this.employeesList.splice(i, 1);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Employee was deleted successfuly!",
        showConfirmButton: false,
        timer: 1500
      });
    }, err => {
      console.log(err)
    })
  }

  addNewEmployee() {
    this._router.navigate(["/addEmployee/"]);
  }

  editEmployee(id: number) {
    this._router.navigate(["/editEmployee/" + id]);
  }
}
