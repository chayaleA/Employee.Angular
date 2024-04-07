import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EmailDialogComponentComponent } from '../email-dialog-component/email-dialog-component.component';

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

  constructor(private _employeeService: EmployeeService, private _router: Router,
    private http: HttpClient, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAllEmployees();
    this.showCards = JSON.parse(localStorage.getItem('showCards')) || this.showCards;
  }

  getAllEmployees() {
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
    })
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

  loadEmployeesFromExcel(event: any): void {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const employees = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.sendEmployeesRecursively(employees, 0);
    };
    fileReader.readAsArrayBuffer(file);
  }

  illegalValues: boolean = true;
  sendEmployeesRecursively(employees: any[], index: number): void {
    if (index < employees.length) {
      if (employees[index].firstName === null || employees[index].lastName === null ||
        employees[index].password === null || employees[index].idNumber === null ||
        employees[index].startWork === null || employees[index].birthDate === null ||
        employees[index].gender === null) {
        this.sendEmployeesRecursively(employees, index + 1);
      }
      const employee: Employee = employees[index];
      employee.jobList = [];
      employee.status = true;
      if (employees[index].email === null)
        employee.email = "";
      this.illegalValues = false
      this._employeeService.addEmployee(employee).subscribe(
        () => {
          console.log('Data sent successfully for employee:', employee);
          this.sendEmployeesRecursively(employees, index + 1);
        },
        (error) => {
          console.error('Error sending data for employee:', employee, error);
        }
      );
    } else {
      if (this.illegalValues === false) {
        this.getAllEmployees();
        console.log('All employees sent successfully.');
        let timerInterval;
        Swal.fire({
          title: "Saving employees to the list!",
          html: "Wait <b></b> milliseconds.",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      }
      else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Illigals valuse for employees. ",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  exportToExcel() {
    const data = this.employeesList.map(employee => ({
      'firstName': employee.firstName,
      'lastName': employee.lastName,
      "password": employee.password,
      'idNumber': employee.idNumber,
      'email': employee.email,
      'startWork': employee.startWork,
      "birthDate": employee.birthDate,
      "gender": employee.gender,
      "status": employee.status,
      // "Job List": employee.jobList.map(job => `${job.jobName} (Manager: ${job.isManager}, Start: ${job.startJob})`).join(', '),
    }));
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
  }

  printTable() {
    document.body.classList.add('print-mode');
    window.print();
    document.body.classList.remove('print-mode');
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

  isValidEmail(email: string): boolean {
    console.log(email)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  emailContent: string;
  emailSubject: string;

  openDialog(): void {
    const dialogRef = this.dialog.open(EmailDialogComponentComponent);

    dialogRef.componentInstance.sendEmailEvent.subscribe((emailData: { content: string, subject: string }) => {
      this.emailContent = emailData.content;
      this.emailSubject = emailData.subject;
      this.sendEmail(this.emailContent, this.emailSubject);
    });
  }

  sendEmail(emailContent, emailSubject) {
    let statusReq = true;
    this.filterEmployeesList.forEach(employee => {
      if (this.isValidEmail(employee.email)) {
        const emailData = {
          recipientEmail: employee.email,
          subject: emailSubject,
          body: emailContent
        };
        this.http.post('/api/Gmail/sendEmail', emailData).subscribe(
          res => { },
          err => {
            if (err.status != 200) {
              statusReq = false;
            }
          }
        );
      }
    }

    );
    if (statusReq === true) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sending emails successfully ",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  deleteEmployee(id: number) {
    let i = this.employeesList.findIndex(e => e.id === id);
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
