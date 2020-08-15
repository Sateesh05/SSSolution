import{ Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn:'root'
})
export class employeeService{
    constructor(public http:HttpClient){}
        public GetEmployeeList(deptId):Observable<any>{

          //  console.log('http://127.0.0.1:8080/allemployees?dept='+ deptId)
            return this.http.get('http://127.0.0.1:8080/allemployees?dept='+ deptId);
        };
        public GetEmployeeByDepartmentId(id):Observable<any>{

            return this.http.get('http://127.0.0.1:8080/employee/dptid/'+id);
        };
        public GetEmployeeByid(id:number):Observable<any>{

           // console.log('http://127.0.0.1:8080/employee/Byid/'+id)
            return this.http.get('http://127.0.0.1:8080/employee/Byid/'+id);
        };
        public CreateEmployee(data:any):Observable<any>{
            debugger;
            return this.http.post('http://127.0.0.1:8080/employee',data);
        };
        public UpdateEmployeeRecord(id,data):Observable<any>{

            return this.http.put('http://127.0.0.1:8080/employee/'+id,data);
        };
        public DeleteEmployee(id):Observable<any>{
            //debugger
            return this.http.delete('http://127.0.0.1:8080/employee/'+id);
        };
        public GetEmployeeByRole(role):Observable<any>{
            return this.http.get('http://127.0.0.1:8080/employee/'+role);
        };

};
