import { Component, OnInit, ElementRef } from '@angular/core';
import { employeeService } from './employee.service';
import { employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { departmentService } from '../department/department.service';
declare var jQuery: any;
@Component({
  selector: 'employee2',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  public employee = new employee();
  dptId_array: any[] = [];
  public employeeResult = new Array<employee>();
  public user = new employee();
  public deportmentRecords: any;
  public userId: number;
  public userRole: string;
  public isShow: boolean;
  constructor(public service: employeeService,
    public departmentService: departmentService) {
    var item = window.localStorage.getItem('deptId');
    var itemobj = JSON.parse(item);
    this.user = itemobj;
    //this.userId = JSON.parse(item).department_id;
    //this.userRole = JSON.parse(item).role;
    console.log(this.userId, this.userRole,item);
    this.isShow = (this.user.role == "TeamManager" || this.user.role == "admin") ? true : false;
  };
  getDepartmentRecords() {
    this.departmentService.getAllDepartmentRecords().subscribe((posRes) => {
      if (posRes) {
        this.deportmentRecords = posRes;
        //console.log(this.deportmentRecords)
      };
    },this.ErrorCallBack);
  };
  ngOnInit(): void {
    this.GetAllEmployee(this.user.department_id);
    this.getDepartmentRecords()
    jQuery('#dept_title').html(this.user.department)
  };
  //Get All EmployeeRecords
  GetAllEmployee(userId) {
    this.service.GetEmployeeList(userId).subscribe((posRes) => {
      //debugger;
      if (posRes) {
        this.employeeResult = posRes;
        console.log(this.employeeResult);
        var deptArray: any;

        //Step1 : Get the list of department ids from list employees
        this.employeeResult.filter(element => this.dptId_array.push(element.department_id));
        //deptArray = this.employeeResult.filter(element => element.department_id > 0);
        deptArray = this.dptId_array;

        //Step2: Filter the departments with distinct.
        deptArray = [...new Set(deptArray)];
        //console.log(deptArray);

        //Step3: Call the department service using foreach and uppdate the employee list with department name
        deptArray.forEach(element => {
          this.departmentService.getByIdDepartmentRecord(element).subscribe((response) => {
            //debugger
            let filterResult = this.employeeResult.filter(item => item.department_id == element);
            filterResult.forEach(element => {
              element.department = response[0].name;
            });
          }, (err: HttpErrorResponse) => { console.log(err); });
        });
      };
    }, this.ErrorCallBack)
  };
  //Error Handling method
  public ErrorCallBack = (errRes: HttpErrorResponse) => {
    if (errRes.error instanceof Error) {
      console.log('server side error');
    } else {
      console.log('client side error')
    };
  };
  //Open Popup Method
  OpenPopup(item) {
    if (item) {
      var date = new Date(item.dateOfJoining);
      item.dateOfJoining = date.getFullYear() + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)));
      this.employee = item;
      jQuery('#m_title').html('Update Employee');
      jQuery('#btn_title').html('Update');
    } else {
      jQuery('#m_title').html('Add New Employee');
      jQuery('#btn_title').html('insert');
    }
    jQuery("#department_Modal").modal("show");
  };
  //Insert and Update Method
  InsertUpdate() {
    if (this.employee.id > 0) {
      const id = this.employee.id;
      const data = { 'employee': this.employee }
      
      this.service.UpdateEmployeeRecord(id, data).subscribe((posRes) => {
        if (posRes.update === 'success') {
          this.GetAllEmployee(this.user.department_id);
        };
      }, this.ErrorCallBack)
      this.employee = new employee();
      jQuery("#myModal").modal("hide");
    } else {
      debugger
      this.service.CreateEmployee({ 'employee': this.employee }).subscribe((posRes) => {
        console.log(posRes);
        if (posRes.insert === 'success') {
          this.GetAllEmployee(this.user.department_id);
        };
      }, this.ErrorCallBack);
    };
    this.employee = new employee();
    jQuery("#myModal").modal("hide");
  };
  //Delete EmployeeRecord
  Delete(id) {
    this.service.DeleteEmployee(id).subscribe((posRes) => {
      if (posRes.delete === 'success') {
        this.GetAllEmployee(this.user.department_id);
      };
    }, this.ErrorCallBack)
  };
  //get EmployeeById Method
  GetEmployeeByDepartment(id) {
    this.service.GetEmployeeByDepartmentId(id).subscribe((posRes) => {
      if (posRes) {
        this.employee = posRes;
      }
    }, this.ErrorCallBack)
  }
  //Popup Close Method
  close() {
    this.employee = new employee();
  };
};
