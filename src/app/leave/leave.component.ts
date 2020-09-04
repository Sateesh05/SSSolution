import { Component, OnInit } from '@angular/core';
import { LeaveService } from './leave.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Leave } from './leave';
import { employee } from '../employee/employee';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { NotificationService } from '../toastr/toastr.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

declare var jQuery: any;
@Component({
  selector: 'index',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveComponent implements OnInit {
  public leave = new Leave();
  public employeeData = new Array<employee>();
  public employee = new employee();
  public leaveResult = new Array<Leave>();
  public isShowLeave: boolean;
  public user = new Leave();
  public config: any;
  pipe = new DatePipe('en-US');
  public isFormSubmitted: boolean = null;
  public isShowReportingPeson:boolean = null;

  constructor(public service: LeaveService,
    private empService: employeeService,
    private departmentService: departmentService,
    private notifyService: NotificationService,

    private SpinnerService: NgxSpinnerService
  ) {
    var item = localStorage.getItem('deptId');
    var itemobj = JSON.parse(item);
    this.user = itemobj;
    this.user.reportingPerson_id = this.user.id;
    debugger
    if (this.user.role == "TeamManager" || this.user.role == "admin") {
      this.isShowLeave = true;
      this.isShowReportingPeson = false;
      this.formData.patchValue({
        reportingPerson_id : 'null'
      })
    } else {
      this.isShowLeave = false;
      this.isShowReportingPeson = true;
    }
  };

  // Initiate Register FormGroup
  public formData: FormGroup = new FormGroup({
    subject: new FormControl(null, [Validators.required]),
    reason: new FormControl(null, [Validators.required]),
    dateOfleave: new FormControl(null, [Validators.required]),
    reportingPerson_id: new FormControl(null, []),
    action: new FormControl(null, [Validators.required])
  });
  ngOnInit() {
    jQuery('#leavedept_title').html(this.user.department);
    this.GetEmployeeByRole(this.role);
    jQuery('#leavebtn_title').html('Apply Leave');
    this.GetAllLeaveRecords(this.user.id);
    this.config = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: this.leaveResult.length
    };
    this.isFormSubmitted = false;
  };
  showCreateToaster() {
    this.notifyService.showSuccess("Record Added Successfully !!", "Leave Records")
  };
  showUpdateToaster() {
    this.notifyService.showSuccess("Record Updated Successfully !!", "Leave Records")
  };
  showDeleteToaster() {
    this.notifyService.showSuccess("Record Deleted Successfully !!", "Leave Records")
  };
  showLeavePopupWarning() {
    this.notifyService.showWarning('fill the Leve Request popup fields!!', 'Leave Request popup')
  }
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
    this.service.getLeaveRecordByUserId(user).subscribe((posRes) => {
      if (posRes) {
        this.leaveResult = posRes;
        debugger
        if(posRes.length>0){
          this.SpinnerService.show();
        }
        // debugger;
        console.log(this.leaveResult);
        this.service.getLeaveRecordByUserId(user).subscribe((posRes) => {
          if (posRes) {
            this.leaveResult = posRes;
            this.leaveResult.map((element, index) => { element.s_no = index + 1 })
            console.log(this.leaveResult);
            //collect and store resulted element ids
            this.leaveResult.filter(ele => this.Ids_Array.push(ele.userid));
            //console.log(this.Ids_Array);
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
                this.SpinnerService.hide();
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
      //debugger;
      if (posRes) {
        this.employeeData = posRes;
       // console.log(this.employeeData)
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
  //Open Popup Method
  actionItem_array: string[] = [];
  public filterData;
  OpenPopup(item) {
    //debugger;
    if (item) {
      var date = this.pipe.transform(new Date(item.dateOfleave), 'yyyy-MM-dd');
      item.dateOfleave = date;
      this.leave = item;
      jQuery('#m_title').html('Update Record');
      jQuery('#btn_addrecord_title').html('Update');
      jQuery('#action').prop('disabled', false);
      jQuery('#leaveModal').modal('show');
    } else {
      this.filterData = this.leaveResult.filter(
        function isBigEnough(element, index, array) {
          return (element.action == 'Pending' || element.action == 'Approved');
        }
      );
      console.log(this.filterData.length);
      if (this.filterData.length < 5) {
        jQuery('#action').prop('disabled', false);
        this.leave.name = this.user.name;
        this.leave.userid = this.user.userid;
        this.leave.action = 'Pending'
        this.leave.reportingPerson_id =''
        jQuery('#action').prop('disabled', true);
        jQuery('#m_title').html('Leave Request');
        jQuery('#btn_addrecord_title').html('Apply');
        jQuery('#leaveModal').modal('show');
      } else {
        alert('you have exceeds yours  5 lives limit ')
      };
    }
  };
  InsertUpdate() {
    debugger;
    this.isFormSubmitted = true;
    if (this.leave.id > 0) {
      const id = this.leave.id;
      const data = { 'leave': this.leave };
      this.SpinnerService.show();
      if (this.formData.valid) {
        this.SpinnerService.show();
        this.service.UpdateLeaveRecord(id, data).subscribe((poRes) => {
          if (poRes.update === 'success') {
            this.GetAllLeaveRecords(this.user.id);
            this.SpinnerService.hide();
            this.showUpdateToaster();
            this.leave = new Leave();
            jQuery('#leaveModal').modal('hide');
          }
        }, this.ErrorCallBack);

      } else {
        this.showLeavePopupWarning();
      }
    } else if (this.formData.valid) {
      this.leave.userid = this.user.id
      if(this.leave.reportingPerson_id==''){
        this.leave.reportingPerson_id = null;
      }
      const data = { 'leave': this.leave }
      this.SpinnerService.show();
      this.service.CreateLeaveRecord(data).subscribe((posRes) => {
        if (posRes.insert === 'success') {
          this.GetAllLeaveRecords(this.user.id);
          this.SpinnerService.hide();
          jQuery('#leaveModal').modal('hide');
          this.showCreateToaster();
        } else {
          alert(posRes.insert);
          this.SpinnerService.hide();
        }
      }, this.ErrorCallBack)
      this.isFormSubmitted = null;
      this.leave = new Leave();
      jQuery('#leaveModal').modal('hide');
    }else{
     this.showLeavePopupWarning();
    }
  };
  //delete Method
  delete(id) {
    //show delete alert model
    Swal.fire({
      title: 'Are you sure To Delete it?',
      text: 'You will not be able to recover this record !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.SpinnerService.show();
        this.service.DeleteLeveRecord(id).subscribe((posRes) => {
          if (posRes.delete === 'success') {
            this.GetAllLeaveRecords(this.user.id);
            this.SpinnerService.hide();
            this.showDeleteToaster();
          };
        }, this.ErrorCallBack)
        console.log('Clicked Yes, File deleted!');
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    })
  };
  close() {
    this.isFormSubmitted = null;
    this.leave = new Leave();
  };
  pageChanged(event) {
    this.config.currentPage = event;
  };
};
