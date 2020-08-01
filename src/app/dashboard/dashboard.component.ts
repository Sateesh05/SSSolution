import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var jQuery:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
public userRole:string;
public isShowDept:boolean;
public isShowLeaveManage:boolean;
public isShowLeave:boolean;
  constructor(private router:Router) {
    var item = localStorage.getItem('deptId');
    this.userRole = JSON.parse(item).role;
    //debugger;
    if(this.userRole == 'admin'){
         this.isShowDept = true;
      }else{
        this.isShowDept = false;
        this.isShowLeave = true;
      };
   
   if(this.userRole == "TeamManager"){
     this.isShowLeaveManage = true;
   }else{
    this.isShowLeaveManage = false;
   };
  };
  ngOnInit(): void {
  }

};
