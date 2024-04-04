import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Role } from '../../models/job.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})

export class AddEmployeeComponent implements OnInit {
  dynamicJobs: FormGroup[] = [];
  roles = Role;

  MyformGroup: FormGroup = new FormGroup({
    "firstName": new FormControl("", [Validators.required, Validators.minLength(3)]),
    "lastName": new FormControl("", [Validators.required, Validators.maxLength(10)]),
    "password": new FormControl("", [Validators.required]),
    "idNumber": new FormControl("", [Validators.required]),
    "startWork": new FormControl("", [Validators.required]),
    "birthDate": new FormControl("", [Validators.required]),
    "gender": new FormControl(1, [Validators.required]),
    "jobList": this.fb.array([])
  });

  constructor(private _employeeService: EmployeeService, private _router: Router,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  selectedRoles: string[] = [];
  keysOfRoles() {
    return Object.keys(this.roles).filter(key => !isNaN(Number(this.roles[key])));
  }

  showPassword: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  addJob() {
    const jobGroup = this.fb.group({
      jobName: ['', Validators.required],
      isManager: [false, Validators.required],
      startJob: ['', Validators.required]
    });
    this.dynamicJobs.push(jobGroup);
    (this.MyformGroup.get('jobList') as FormArray).push(jobGroup);
  }

  removeJob(index: number) {
    const jobsArr = this.MyformGroup.get('jobList') as FormArray;
    jobsArr.removeAt(index);
    this.dynamicJobs.splice(index, 1);
  }

  invalidIndices(): number[] {
    const jobNames = this.dynamicJobs.map(job => job.get('jobName').value);
    const duplicatesIndices = jobNames.map((name, index) => jobNames.indexOf(name) === index ? -1 : index)
      .filter(index => index !== -1);
    return duplicatesIndices.length > 0 ? duplicatesIndices : [-1];
  }

  inValidDate = false;

  invalidDate(startJob): boolean {
    console.log(startJob)
    let s = this.MyformGroup.get("startWork").value;
    const startWorkDate = new Date(s)
    const startJobDate = new Date(startJob);
    const flag: boolean = startJobDate.getFullYear() < startWorkDate.getFullYear() ||
      (startJobDate.getFullYear() === startWorkDate.getFullYear() && startJobDate.getMonth() < startWorkDate.getMonth()) ||
      (startJobDate.getFullYear() === startWorkDate.getFullYear() && startJobDate.getMonth() === startWorkDate.getMonth() && startJobDate.getDate() < startWorkDate.getDate())
    flag == true ? this.inValidDate = true : this.inValidDate = false;
    return flag
  }

  isSaveDisabled(): boolean {
    return !this.MyformGroup.valid || this.invalidIndices()[0] !== -1 || this.inValidDate;
  }

  AddEmployee() {
    let employee: Employee = this.MyformGroup.value;
    employee.status = true;
    employee.jobList = this.dynamicJobs.map(job => job.value);
    this._employeeService.addEmployee(employee).subscribe(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Employee was added successfuly!",
        showConfirmButton: false,
        timer: 1500
      });
      this.MyformGroup.reset();
      this.dynamicJobs = [];
      this._router.navigate(["/employeesList"])
    }, err => {
      console.log(err)
    })
  }
}
