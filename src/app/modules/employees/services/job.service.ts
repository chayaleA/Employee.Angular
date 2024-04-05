import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Job } from "../models/job.model";

@Injectable()
export class JobService{
    
    constructor(private _http: HttpClient) {

    }

    getAllJobs(): Observable<Job[]> {
        return this._http.get<Job[]>("/api/Job");
    }

    getJobById(jobId: string): Observable<Job> {
        return this._http.get<Job>(`/api/Job/${jobId}`);
    }

    addJob(job: Job): Observable<boolean> {
        return this._http.post<boolean>("/api/Job/", job);
    }

    updateJob(updateJob: Job, id: string): Observable<boolean> {
        return this._http.put<boolean>("/api/Job/" + id, updateJob);
    }

    deleteJob(id: number) : Observable<boolean>{
        return this._http.delete<boolean>("/api/Job/" + id);
    }
}