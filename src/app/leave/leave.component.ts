import { Component, OnInit } from '@angular/core';
import { LeaveService } from './leave.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Leave } from './leave';
import { employee } from '../employee/employee';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { NotificationService } from '../toastr/toastr.service';
import { DatePipe } from '@angular/common';
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
  public config:any;
  pipe = new DatePipe('en-US');
  constructor(public service: LeaveService,
    private empService: employeeService,
    private departmentService: departmentService,
    private notifyService : NotificationService) {
    var item = localStorage.getItem('deptId');
    var itemobj = JSON.parse(item);
    this.user = itemobj;
    this.user.reportingPerson_id = this.user.id;
    //console.log(this.user.role);
    if (this.user.role == "TeamManager" || this.user.role == "admin") {
      this.isShowLeave = true;
    } else {
      this.isShowLeave = false;
    }
  };
  ngOnInit(){
    jQuery('#leavedept_title').html(this.user.department);
    this.GetEmployeeByRole(this.role);
    jQuery('#leavebtn_title').html('Apply Leave');
    this.GetAllLeaveRecords(this.user.id);
    this.config = {
      currentPage:1,
      itemsPerPage:5,
      totalItems:this.leaveResult.length
    };
  };
  showCreateToaster(){
    this.notifyService.showSuccess("Record Added Successfully !!", "Leave Records")
  };
  showUpdateToaster(){
    this.notifyService.showSuccess("Record Updated Successfully !!", "Leave Records")
  };
  showDeleteToaster(){
    this.notifyService.showSuccess("Record Deleted Successfully !!", "Leave Records")
  };
  showLeavePopupWarning(){
    this.notifyService.showWarning('fill the Leve Request popup fields!!','Leave Request popup')
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
       // debugger;
        console.log(this.leaveResult);
        this.service.getLeaveRecordByUserId(user).subscribe((posRes) => {
          if (posRes) {
            this.leaveResult = posRes;
            this.leaveResult.map((element, index) => { element.s_no = index + 1 })
            console.log(this.leaveResult);
            //collect and store resulted element ids
            this.leaveResult.filter(ele => this.Ids_Array.push(ele.userid));
            console.log(this.Ids_Array);
            this.Ids_Array = [... new Set(this.Ids_Array)];
            this.Ids_Array.forEach(elem => this.empService.GetEmployeeByid(elem).subscribe((posResult) => {

              let filterResulte = this.leaveResult.filter(el => el.userid == elem);
              filterResulte.forEach(element => element.name = posResult[0].name)
            }), this.ErrorCallBack)

            this.leaveResult.filter(ele => this.department_Array.push(ele.reportingPerson_id));
            //console.log(this.department_Array)
            //debugger;
            this.department_Array = [...new Set(this.department_Array)]
            this.department_Array.forEach(element => {
              this.empService.GetEmployeeByid(element).subscribe((posRe) => {
                let filterResult = this.leaveResult.filter(ele => ele.reportingPerson_id == element)
                //console.log(filterResult)
                filterResult.forEach(ele => ele.reportingPersonName = posRe[0].name)
                //console.log(posRe);
                //console.log(this.leaveResult)
              }, this.ErrorCallBack)
            });
          }
        }, this.ErrorCallBack)

        this.leaveResult.filter(ele => this.department_Array.push(ele.reportingPerson_id));
        //console.log(this.department_Array)
        //debugger;
        this.department_Array = [...new Set(this.department_Array)]
        this.department_Array.forEach(element => {
          this.empService.GetEmployeeByid(element).subscribe((posRe) => {
            let filterResult = this.leaveResult.filter(ele => ele.reportingPerson_id == element)
            //console.log(filterResult)
            filterResult.forEach(ele => ele.reportingPersonName = posRe[0].name)
            //console.log(posRe);
            //console.log(this.leaveResult)
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
        console.log(this.employeeData)
        this.employeeData.filter(element => this.departmentIdArray.push(element.department_id));
        // console.log(this.departmentIdArray);
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
      jQuery('#Newdepartment').modal('show');
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
        jQuery('#action').prop('disabled', true);
        jQuery('#m_title').html('Leave Request');
        jQuery('#btn_addrecord_title').html('Apply');
        jQuery('#Newdepartment').modal('show');
      } else {
        alert('you have exceeds yours  5 lives limit ')
      };
    }
  };
  InsertUpdate(data) {
    if (this.leave.id > 0) {
      const id = this.leave.id;
      const data = { 'leave': this.leave };
      this.service.UpdateLeaveRecord(id, data).subscribe((poRes) => {
        if (poRes.update === 'success') {
          this.GetAllLeaveRecords(this.user.id);
          this.showUpdateToaster();
        }
      }, this.ErrorCallBack)
      this.leave = new Leave();
      jQuery('#Newdepartment').modal('hide');
    } else if(data.valid){
      this.leave.userid = this.user.id
      const data = { 'leave': this.leave }
      //debugger;
      this.service.CreateLeaveRecord(data).subscribe((posRes) => {
        if (posRes.insert === 'success') {
          this.GetAllLeaveRecords(this.user.id);
          this.showCreateToaster();
        }else{
          alert(posRes.insert);
        }
      }, this.ErrorCallBack)
      this.leave = new Leave();
      jQuery('#Newdepartment').modal('hide');

    }else this.showLeavePopupWarning();//alert('enter field values')
  };
  //delete Method
  delete(id) {
    this.service.DeleteLeveRecord(id).subscribe((posRes) => {
      if (posRes.delete === 'success') {
        this.GetAllLeaveRecords(this.user.id);
        this.showDeleteToaster();
      };
    }, this.ErrorCallBack)
  };
  close() {
    this.leave = new Leave();
  };
  pageChanged(event){
    this.config.currentPage=event;
  };
};
