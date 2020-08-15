import { Component, OnInit } from '@angular/core';
import { Leave } from './leaveMange';
import { employee } from '../employee/employee';
import { LeaveService } from '../leave/leave.service';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
declare var jQuery: any;
@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css']
})
export class LeaveManagementComponent implements OnInit {
  public leave = new Leave();
  public employeeData = new Array<employee>();
  public employee = new employee();
  public leaveResult = new Array<Leave>();
  public isShow: boolean;
  public user = new Leave();
  config: any;
  public isFormSubmitted: boolean;
  public formData: FormGroup = new FormGroup({
    subject: new FormControl(null, [Validators.required]),
    reason: new FormControl(null, [Validators.required]),
    action: new FormControl(null, [Validators.required]),
    reportingPerson_id: new FormControl(null, [Validators.required]),
    dateOfleave: new FormControl(null, [Validators.required])
  })
  constructor(public service: LeaveService,
    private empService: employeeService,
    private departmentService: departmentService,
    private SpinnerService: NgxSpinnerService) {
    var item = localStorage.getItem('deptId');
    var itemobj = JSON.parse(item);
    this.user = itemobj;
    this.user.reportingPerson_id = this.user.id;
    //console.log(this.user.role);
    if (this.user.role == "TeamManager" || this.user.role == "admin") {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  };
  ngOnInit(): void {
    this.GetEmployeeByRole(this.role);
    jQuery('#btn_title').html('Apply Leave');
    this.GetAllLeaveRecords(this.user);
    //console.log(this.reportingPerson_id)
    jQuery('#leave_dept_title').html(this.user.department);
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.leaveResult.length
    };
    this.isFormSubmitted = false;
  };
  //Error Handling Method
  public ErrorCallBack = (err: HttpErrorResponse) => {
    if (err.error instanceof Error) {
      console.log('server side error')
    } else {
      console.log('client side error')
    }
  };
  //Get All Leave Records Method
  department_Array: any[] = [];
  Ids_Array: any[] = [];
  GetAllLeaveRecords(user) {
    this.SpinnerService.show();
    this.service.GetLeaveRecords(user).subscribe((posRes) => {
      if (posRes) {
        this.leaveResult = posRes;
        console.log(this.leaveResult);
        this.service.GetLeaveRecords(user).subscribe((posRes) => {
          if (posRes) {
            this.leaveResult = posRes;
            this.leaveResult.map((element, index) => { return element.s_no = index + 1 });
            //collect and store resulted element ids
            this.leaveResult.filter(ele => this.Ids_Array.push(ele.userid));
            console.log(this.Ids_Array);
            this.Ids_Array = [... new Set(this.Ids_Array)];
            this.Ids_Array.forEach(elem => this.empService.GetEmployeeByid(elem).subscribe((posResult) => {
              let filterResulte = this.leaveResult.filter(el => el.userid == elem);
              filterResulte.forEach(element => element.name = posResult[0].name)
            }), this.ErrorCallBack)

            this.leaveResult.filter(ele => this.department_Array.push(ele.reportingPerson_id));
            this.department_Array = [...new Set(this.department_Array)]
            this.department_Array.forEach(element => {
              this.empService.GetEmployeeByid(element).subscribe((posRe) => {
                let filterResult = this.leaveResult.filter(ele => ele.reportingPerson_id == element)
                filterResult.forEach(ele => ele.reportingPersonName = posRe[0].name)
              }, this.ErrorCallBack)
            });
          }
        }, this.ErrorCallBack)

        this.leaveResult.filter(ele => this.department_Array.push(ele.reportingPerson_id));
        this.department_Array = [...new Set(this.department_Array)]
        this.department_Array.forEach(element => {
          this.empService.GetEmployeeByid(element).subscribe((posRe) => {
            let filterResult = this.leaveResult.filter(ele => ele.reportingPerson_id == element)
            filterResult.forEach(ele => ele.reportingPersonName = posRe[0].name)
            this.SpinnerService.hide();
          }, this.ErrorCallBack)
        });
      }
    }, this.ErrorCallBack)
  };
  //Get Leave Record By Role
  public role: string = 'TeamManager';
  public departmentIdArray: any[] = [];
  GetEmployeeByRole(role) {
    this.empService.GetEmployeeByRole(role).subscribe((posRes) => {
      if (posRes) {
        this.employeeData = posRes;
        console.log(this.employeeData)
        this.employeeData.filter(element => this.departmentIdArray.push(element.department_id));
        this.departmentIdArray = [...new Set(this.departmentIdArray)];
        this.departmentIdArray.forEach(element => {
          this.departmentService.getByIdDepartmentRecord(element).subscribe((posResponse) => {
            if (posResponse) {
              let filterResult = this.employeeData.filter(item => item.department_id == element);
              filterResult.forEach(ele => ele.department = posResponse[0].name)
            };
          }, this.ErrorCallBack)
        });
      };
    }, this.ErrorCallBack);

  };
  pipe = new DatePipe('en-US');
  actionItem_array: string[] = [];
  public filterData;
  OpenPopup(item) {
    if (item) {
      debugger;
      var date = this.pipe.transform(new Date(item.dateOfleave), 'yyyy-MM-dd');
      item.dateOfleave = date;
      this.leave = item;
      this.isFormSubmitted = true;
      jQuery('#m_title').html('Update Record');
      jQuery('#btn_addrecord_title').html('Update');
      jQuery('#action').prop('disabled', false);
      jQuery('#leaveMangementModel').modal('show');
    } else {
      this.service.GetLeaveRecordByUserId(this.user.id).subscribe((posRes) => {
        //console.log(posRes)
        this.filterData = posRes.filter(
          function isBigEnough(element, index, array) {
            return (element.action == 'Pending' || element.action == 'Approved');
          }
        );
        //console.log(this.filterData.length);
        if (this.filterData.length < 5) {
          jQuery('#action').prop('disabled', false);
          this.leave.name = this.user.name;
          this.leave.userid = this.user.userid;
          this.leave.action = 'Pending'
          jQuery('#action').prop('disabled', true);
          jQuery('#m_title').html('Leave Request');
          jQuery('#btn_addrecord_title').html('Apply');
          jQuery('#leaveMangementModel').modal('show');
        } else {
          alert('you have exceeds yours  5 lives limit ')
        };
      }, this.ErrorCallBack);
    }
  };
  InsertUpdate() {
    if (this.leave.id > 0) {
      const id = this.leave.id;
      const data = { 'leave': this.leave };
      if (this.formData.valid) {
        this.isFormSubmitted = true;
        this.SpinnerService.show();
        this.service.UpdateLeaveRecord(id, data).subscribe((poRes) => {
          if (poRes.update === 'success') {
            this.GetAllLeaveRecords(this.user);
            this.isFormSubmitted = null;
            this.leave = new Leave();
            jQuery('#leaveMangementModel').modal('hide');
            this.SpinnerService.hide();
          };
        }, this.ErrorCallBack)
      } else {
        alert('fill popup fields')
      };
    } else {
      this.leave.userid = this.user.id
      const data = { 'leave': this.leave };
      if (this.formData.valid) {
        this.isFormSubmitted = true;
        this.SpinnerService.show();
        this.service.CreateLeaveRecord(data).subscribe((posRes) => {
          if (posRes.insert === 'success') {
            this.GetAllLeaveRecords(this.user);
            this.isFormSubmitted = null;
            this.leave = new Leave();
            jQuery('#leaveMangementModel').modal('hide');
            this.SpinnerService.hide();
          };
        }, this.ErrorCallBack)
      } else {
        alert('alert')
      }
    };
  };
  //delete Method
  delete(id) {
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
        this.service.DeleteLeveRecord(id).subscribe((posRes) => {
          if (posRes.delete === 'success') {
            this.GetAllLeaveRecords(this.user);
            this.SpinnerService.hide();
          };
        }, this.ErrorCallBack)
        //console.log('Clicked Yes, File deleted!');
      } else if (result.isDismissed) {
       // console.log('Clicked No, File is safe!');
      }
    })
  };
  close() {
    this.isFormSubmitted = null;
    this.leave = new Leave();
  };
  pageChanged(event) {
    this.config.currentPage = event;
  }
};
