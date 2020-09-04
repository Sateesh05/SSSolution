import { Component, OnInit, ViewChild } from '@angular/core';
import { departmentService } from './department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { department } from './department';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from '../toastr/toastr.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
declare var jQuery: any;
@Component({
  selector: 'department1',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  //create deportmentRecords varable  of array
  deportmentRecords = new Array<department>()
  //creating class variable
  department: any = new department();
  //user role variable
  public userRole: string;
  //pagination configaration set up obj variable declaration
  config: any;
  public isFormSubmitted: boolean = null;
  public dataSource = new MatTableDataSource<department>();
  @ViewChild(MatSort,{static:true}) 
  public sort:MatSort;
  @ViewChild(MatPaginator,{static:true}) 
  public paginator: MatPaginator;
  public dptData: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required,Validators.maxLength(20)]),
    description: new FormControl(null, [Validators.required,Validators.maxLength(100)]),
  });

  displayedColumns: string[] = ['s_no', 'name', 'description','update', 'delete'];
  constructor(public service: departmentService,
    private notifyService: NotificationService,
    private SpinnerService: NgxSpinnerService) {
    //get object from localstorage
    var item = window.localStorage.getItem('deptId');
    //storing the data of object in variable
    this.userRole = JSON.parse(item).role;
  }
  ngOnInit(): void {
    // calling get all departmentrecords method
    this.getDepartmentRecords();
    this.isFormSubmitted = false;
    // this.config = {
    //   itemsPerPage: 5,
    //   currentPage: 1,
    //   totalItems: this.deportmentRecords.length
    // };
  };
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  };
  showCreateToaster() {
    this.notifyService.showSuccess("Record Added Successfully !!", "Department Records")
  };
  showUpdateToaster() {
    this.notifyService.showSuccess("Record Updated Successfully !!", "Department Records")
  };
  showDeleteToaster() {
    this.notifyService.showSuccess("Record Deleted Successfully !!", "Department Records")
  };
  showLeavePopupWarning() {
    this.notifyService.showWarning('fill the Leve Request popup fields!!', 'Department Request popup')
  };
  showErrormessage() {
    this.notifyService.showError('failed Record added!!', 'DepartMent Records')
  };
  showWarningMessage() {
    this.notifyService.showWarning('fill the popup fields', 'Warning')
  };
  showDuplicateWarningMessage() {
    this.notifyService.showWarning('name duplicate is not allowed', 'Warning')
  }

  // Department Get Records
  getDepartmentRecords() {
    this.SpinnerService.show();
    this.service.getAllDepartmentRecords().subscribe((posRes) => {
      if (posRes) {
        this.deportmentRecords = posRes;
        this.dataSource.data = posRes as department[];
        this.deportmentRecords.map((element, index) => {
          element.s_no = index + 1;
          this.SpinnerService.hide();
        });
        //console.log(this.deportmentRecords)
      };
    }, (errRes: HttpErrorResponse) => {
      console.log(errRes);
    });
  };
  //Error Handling Method
  public errCallBack = (errRes: HttpErrorResponse) => {
    if (errRes.error instanceof Error) {
      debugger;
      console.log('client side error',errRes);
      this.showErrormessage();
    } else {
      console.log('server side error');
    };
  };
  //Openpopup Method
  OpenPopup(item: any) {
    if (item) {
      jQuery("#m_title").html("Update Record");
      jQuery("#btn_title").html("Update");
      this.department = item;
    } else {
      jQuery("#m_title").html("Add New Record");
      jQuery("#btn_title").html("save");
    }
    jQuery("#departmentModel").modal("show");
  };
  //Insert and Update method
  InsertUpdate() {
    debugger
    if (this.department.id > 0) {
      const data = { 'department': this.department }
      const id = this.department.id;
      this.SpinnerService.show();
      this.isFormSubmitted = true;
      if (this.dptData.valid) {
        this.service.updateDepartmentRecord(id, data).subscribe((posRes) => {
          // console.log(posRes);
          if (posRes.update === "success") {
            this.department = new department();
            this.getDepartmentRecords();
            this.isFormSubmitted = null;
            this.SpinnerService.hide();
            this.showUpdateToaster();
            jQuery("#departmentModel").modal("hide");
          }else if(posRes.errno == 1582){
            this.showDuplicateWarningMessage();
          }

        }, this.errCallBack);
      } else {
        this.showWarningMessage();
      };
    } else {
      this.isFormSubmitted = true;
      if (this.dptData.valid) {
        this.SpinnerService.show();
        this.service.createDepartmentRecord({ 'department': this.department }).subscribe((posRes) => {
          //console.log(posRes)
          if (posRes.insert === "success") {
            this.department = new department();
            this.getDepartmentRecords();
            this.isFormSubmitted = null;
            this.SpinnerService.hide();
            this.showCreateToaster();
            jQuery("#departmentModel").modal("hide");
          }else if(posRes.errno == 1582){
            this.showDuplicateWarningMessage();
          }
        }, this.errCallBack);
      } else {
        this.showWarningMessage();
      }
    }
  };
  //delete record method
  delete(data) {
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
        this.service.deleteDepartmentRecord({ 'id': data }).subscribe((posRes) => {
          if (posRes.delete === "success") {
            this.getDepartmentRecords();
            this.SpinnerService.hide();
            this.showDeleteToaster();
            //this.recordDletedSucces();
          }
        }, this.errCallBack);
      } else if (result.isDismissed) {
        console.log('Clicked No, File is safe!');
      }
    })
  };
  // popup close Method
  close() {
    this.department = new department();
    this.isFormSubmitted = null;
  };
  // pageChanged(event) {
  //   this.dataSource.currentPage = event;
  // }
};


