import { Component, OnInit, ElementRef } from '@angular/core';
import { employeeService } from './employee.service';
import { employee } from './employee';
import { HttpErrorResponse } from '@angular/common/http';
import { departmentService } from '../department/department.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../toastr/toastr.service';
import Swal from 'sweetalert2';
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
  public config: any;
  public isFormSubmitted: boolean = null;
  public employeeData: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    age: new FormControl(null, [Validators.required]),
    experiance: new FormControl(null, [Validators.required]),
    mobileNumber: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    dateOfJoining: new FormControl(null, [Validators.required]),
    department_id: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required]),
    designation: new FormControl(null, [Validators.required])
  })
  pipe = new DatePipe('en-US');
  constructor(public service: employeeService,
    public departmentService: departmentService,
    private notifyService: NotificationService,
    private SpinnerService: NgxSpinnerService) {
    var item = window.localStorage.getItem('deptId');
    var itemobj = JSON.parse(item);
    this.user = itemobj;
    //this.userId = JSON.parse(item).department_id;
    //this.userRole = JSON.parse(item).role;
    console.log(this.userId, this.userRole, item);
    this.isShow = (this.user.role == "TeamManager" || this.user.role == "admin") ? true : false;
  };
  getDepartmentRecords() {
    this.departmentService.getAllDepartmentRecords().subscribe((posRes) => {
      if (posRes) {
        this.deportmentRecords = posRes;
        //console.log(this.deportmentRecords)
      };
    }, this.ErrorCallBack);
  };
  ngOnInit(): void {
    this.GetAllEmployee(this.user.department_id);
    this.isFormSubmitted = false;
    this.getDepartmentRecords();
    jQuery('#dept_title').html(this.user.department);
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.employeeResult.length
    };
  };
  showCreateToaster() {
    this.notifyService.showSuccess("Record Added Successfully !!", "Employee Records")
  };
  showUpdateToaster() {
    this.notifyService.showSuccess("Record Updated Successfully !!", "Employee Records")
  };
  showDeleteToaster() {
    this.notifyService.showSuccess("Record Deleted Successfully !!", "Employee Records")
  };
  showLeavePopupWarning() {
    this.notifyService.showWarning('fill the Employee Request popup fields!!', 'Employee Request popup')
  };
  showErrormessage() {
    this.notifyService.showError('failed Record added!!', 'Employee Records')
  };
  showWarningMessage() {
    this.notifyService.showWarning('fill the popup fields', 'Warning')
  }
  //Get All EmployeeRecords
  GetAllEmployee(userId) {
    this.SpinnerService.show();
    this.service.GetEmployeeList(userId).subscribe((posRes) => {
      //debugger;
      if (posRes) {
        this.employeeResult = posRes;
        this.employeeResult.forEach((element, index) => { element.s_no = index + 1 })
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
              this.SpinnerService.hide();
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
      this.showErrormessage();
    };
  };
  //Open Popup Method
  empOpenPopup(item) {
    if (item) {
      var date = this.pipe.transform (new Date(item.dateOfJoining),'yyyy-MM-dd')
      item.dateOfJoining = date;
      this.employee = item;
      jQuery('#m_title').html('Update Employee');
      jQuery('#btn_title').html('Update');
    } else {
      jQuery('#m_title').html('Add New Employee');
      jQuery('#btn_title').html('insert');
    }
    jQuery("#employeeModal").modal("show");
  };
  //Insert and Update Method
  empInsertUpdate() {
   //debugger;
    if (this.employee.id > 0) {
      const id = this.employee.id;
      const data = { 'employee': this.employee }
      this.isFormSubmitted = true;
      if (this.employeeData.valid) {
        this.SpinnerService.show();
        this.service.UpdateEmployeeRecord(id, data).subscribe((posRes) => {
          if (posRes.update === 'success') {
            this.GetAllEmployee(this.user.department_id);
            this.isFormSubmitted = null;
            this.employee = new employee();
            this.SpinnerService.hide();
            this.showUpdateToaster()
            jQuery("#employeeModal").modal("hide");
          };
        }, this.ErrorCallBack)
      } else {
        this.showWarningMessage();
      }
    } else {
      this.isFormSubmitted = true;
      if (this.employeeData.valid) {
        this.SpinnerService.show();
        this.service.CreateEmployee({ 'employee': this.employee }).subscribe((posRes) => {
          if (posRes.insert === 'success') {
            this.GetAllEmployee(this.user.department_id);
            this.isFormSubmitted = null;
            this.employee = new employee();
            this.SpinnerService.hide();
            this.showCreateToaster();
            jQuery("#employeeModal").modal("hide");
          };
        }, this.ErrorCallBack);
     } else {
        this.showWarningMessage();
     }
    };
  };
  //Delete EmployeeRecord
  Delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SpinnerService.show();
        this.service.DeleteEmployee(id).subscribe((posRes) => {
          if (posRes.delete === 'success') {
            this.GetAllEmployee(this.user.department_id);
            this.showDeleteToaster();
            this.SpinnerService.hide();
          };
        }, this.ErrorCallBack)
      } else if (result.isDismissed) {
        this.showWarningMessage();
      }
    })
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
    this.isFormSubmitted = null;
    this.employee = new employee();
  };
  pageChanged(event) {
    this.config.currentPage = event;
  };
};
