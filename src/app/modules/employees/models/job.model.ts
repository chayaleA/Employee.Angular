export class Job{
    id: number;
    jobName: string;
    isManager: boolean;
    startJob: string;
    
    constructor(jobName: string = "", isManager: boolean = false, startJob: string = null,){
        this.jobName = jobName;
        this.isManager = isManager;
        this.startJob = startJob;
    }
    
}

export enum Role {
    Manager, teacher, supervisor, secretary
}