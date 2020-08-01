import { Component, OnInit } from '@angular/core';
import { departmentService } from './department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { department } from './department';

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
  
  constructor(public service: departmentService) {
    //get object from localstorage
    var item = window.localStorage.getItem('deptId');
    //storing the data of object in variable
    this.userRole = JSON.parse(item).role;
  }
  ngOnInit(): void {
    // calling get all departmentrecords method
    this.getDepartmentRecords()
  }
  // Department Get Records
  getDepartmentRecords() {
    this.service.getAllDepartmentRecords().subscribe((posRes) => {
      if (posRes) {
        this.deportmentRecords = posRes;
        //console.log(this.deportmentRecords)
      };
    }, (errRes: HttpErrorResponse) => {
      console.log(errRes);
    });
  };
  //Error Handling Method
  public errCallBack = (errRes: HttpErrorResponse) => {
    if (errRes.error instanceof Error) {
      console.log('client side error');
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
      jQuery("#btn_title").html("Insert");
    }
    jQuery("#departmentTable").modal("show");
  };
  //Insert and Update method
  InsertUpdate() {
    if (this.department.id > 0) {
      const data = { 'department': this.department }
      const id = this.department.id;
      this.service.updateDepartmentRecord(id, data).subscribe((posRes) => {
       // console.log(posRes);
        if (posRes.update === "success") {
          this.department = new department();
          this.getDepartmentRecords();
          jQuery("#departmentTable").modal("hide");
          alert('record updated successfully');
        };
      }, this.errCallBack);

    } else {
      this.service.createDepartmentRecord({ 'department': this.department }).subscribe((posRes) => {
        //console.log(posRes)
        if (posRes.insert === "success") {
          this.department = new department();
          this.getDepartmentRecords();
          alert('record added successfully');
          jQuery("#departmentTable").modal("hide");
        }
      }, this.errCallBack);
      // this.addErrorMessage();      
    }
  };
  //delete record method
  delete(data) {
    confirm('do you want delete this record!');
    this.service.deleteDepartmentRecord({ 'id': data }).subscribe((posRes) => {
      if (posRes.delete === "success") {
        this.getDepartmentRecords();
        //this.recordDletedSucces();
      }
    }, this.errCallBack);
  };
  // popup close Method
  close() {
    this.department = new department();
  };
};


