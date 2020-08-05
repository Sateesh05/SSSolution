import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class LeaveService{
  constructor(private http:HttpClient){}
    public GetLeaveRecords(data:any):Observable<any>{
      const opts = { params: new HttpParams({
        fromString: `userid=${data.id}&reportingPerson_id=${data.reportingPerson_id}
        &departmentName=${data.department}&role=${data.role}`
      })}
      return this.http.get('http://127.0.0.1:8080/leaveRequest',opts);
    };
    public getLeaveRecordByUserId(userid:any):Observable<any>{
     // debugger
      return this.http.get('http://127.0.0.1:8080/leaveRequest/userid/'+userid);
    }
    public LeaveRecordGetById(id:any):Observable<any>{
      return this.http.get('http://127.0.0.1:8080/leaveRequest/'+id);
    };
  public CreateLeaveRecord(data: any):Observable<any>{
      //debugger
        return this.http.post('http://127.0.0.1:8080/leaveRequest/',data);
    };
    public UpdateLeaveRecord(id,data):Observable<any>{
        return this.http.put('http://127.0.0.1:8080/leaveRequest/'+id,data);
    };
    public DeleteLeveRecord(id):Observable<any>{
        return this.http.delete('http://127.0.0.1:8080/leaveRequest/'+id);
    };
    public GetLeaveRecordByUserId(userid:number):Observable<any>{
      return this.http.get('http://127.0.0.1:8080/leaveRequest/'+userid);
    }
};
