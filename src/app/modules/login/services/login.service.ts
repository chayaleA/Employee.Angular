import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class LoginService {
    constructor(private _http: HttpClient) {
    }

    Login(userName: string, password: string): Observable<any> {
        const body = { UserName: userName, Password: password };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post<any>("/api/Auth", body, { headers, observe: 'response' });
    }
}