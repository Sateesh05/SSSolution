import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class departmentService {
    constructor(public http: HttpClient) { }

    public getAllDepartmentRecords(): Observable<any> {
        return this.http.get("http://127.0.0.1:8080/department");
    };
    public getByIdDepartmentRecord(id): Observable<any> {
    
        return this.http.get("http://127.0.0.1:8080/department/" + id);
    }
    public createDepartmentRecord(data: any): Observable<any> {

        return this.http.post("http://127.0.0.1:8080/department", data);
    }
    public updateDepartmentRecord(id:number,data: any): Observable<any> {

        return this.http.put("http://127.0.0.1:8080/department/" + id, data);
    };
    public deleteDepartmentRecord(data: any): Observable<any> {
        // let options= {
        //     headers: new HttpHeaders({
        //         "Content-Type":"application/json"
        //     }),            
        // };        
        return this.http.delete("http://127.0.0.1:8080/department/" + data.id);
    };
};