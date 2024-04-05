import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, Gender } from '../../models/employee.model';
import Swal from 'sweetalert2';
import { Role } from '../../models/job.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent implements OnInit {

  dynamicJobs: FormGroup[] = [];

  private _employee: Employee;

  private _employeeId: number;

  roles = Role;

  MyformGroup: FormGroup = new FormGroup({
    "firstName": new FormControl("", [Validators.required, Validators.minLength(3)]),
    "lastname": new FormControl("", [Validators.required, Validators.maxLength(10)]),
    "password": new FormControl("", [Validators.required]),
    "idNumber": new FormControl("", [Validators.required]),
    "email": new FormControl(""),
    "startWork": new FormControl("", [Validators.required]),
    "birthDate": new FormControl("", [Validators.required]),
    "gender": new FormControl("", [Validators.required]),
    "jobList": this.fb.array([])
  });

  constructor(private _employeeService: EmployeeService, private _router: Router,
    private _accr: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this._accr.paramMap.subscribe(paramMap => {
      if (paramMap.has("id")) {
        this._employeeId = +paramMap.get("id");
        this._employeeService.getEmplyeeById(paramMap.get("id")).subscribe(employee => {
          this._employee = employee;
          this.MyformGroup.patchValue({
            "firstName": this._employee.firstName,
            "lastname": this._employee.lastName,
            "password": this._employee.password,
            "idNumber": this._employee.idNumber,
            "email": this._employee.email,
            "startWork": this._employee.startWork,
            "birthDate": this._employee.birthDate,
            "gender": this._employee.gender
          });
          this.dynamicJobs = [];
          const jobsList = this.MyformGroup.get("jobList") as FormArray;
          this._employee.jobList.forEach(job => {
            const jobGroup = this.fb.group({
              jobName: [job.jobName, Validators.required],
              isManager: [job.isManager || false, Validators.required],
              startJob: [job.startJob || '', Validators.required]
            });
            this.dynamicJobs.push(jobGroup);
            jobsList.push(jobGroup);
          });
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      console.log(err);
    });
  }

  showPassword: boolean = false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  keysOfRoles() {
    return Object.keys(this.roles).filter(key => !isNaN(Number(this.roles[key])));
  }

  invalidIndices(): number[] {
    const jobNames = this.dynamicJobs.map(job => job.get('jobName').value);
    const duplicatesIndices = jobNames.map((name, index) => jobNames.indexOf(name) === index ? -1 : index)
      .filter(index => index !== -1);

    if (duplicatesIndices.length > 0) {
      console.log(duplicatesIndices);
      return duplicatesIndices
    } else {
      return [-1];
    }
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

  addJob() {
    const jobGroup = this.fb.group({ // Create a new form group for each job
      jobName: ['', Validators.required],
      isManager: [false, Validators.required],
      startJob: ['', Validators.required]
    });
    this.dynamicJobs.push(jobGroup); // Push the new form group to the dynamicJobs array
    (this.MyformGroup.get('jobList') as FormArray).push(jobGroup); // Push the new form group to the form array
  }

  removeJob(index: number) {
    const jobsArr = this.MyformGroup.get('jobList') as FormArray;
    jobsArr.removeAt(index);
    this.dynamicJobs.splice(index, 1);
  }

  Save() {
    this._employee = { ...this.MyformGroup.value };
    this._employee.jobList = this.dynamicJobs.map(jobGroup => jobGroup.value);
    this._employee.status = true;
    this._employeeService.updateEmployee(this._employee, this._employeeId).subscribe(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Employee was save successfuly!",
        showConfirmButton: false,
        timer: 1500
      });
      this._router.navigate(["/employeesList"]);
    }, err => {
      console.log(err)
    })
  }
}
