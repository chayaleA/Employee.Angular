import { Job } from "./job.model";

export class Employee {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    idNumber: string;
    email: string;
    startWork: Date;
    birthDate: Date;
    gender: Gender;
    status: Boolean;
    jobList: Job[];

    constructor(firstName: string = "", lastName: string = "", password: string = "", idNumber: string = "", email:string = "",
        startWork: Date = null, birthDate: Date = null, gender: Gender = 1, status: Boolean = true, jobList: Job[] = []) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.idNumber = idNumber;
        this.email = email
        this.startWork = startWork;
        this.birthDate = birthDate;
        this.gender = gender;
        this.status = status;
        this.jobList = jobList;
    }
}
export enum Gender {
    male = 1, female = 2
}