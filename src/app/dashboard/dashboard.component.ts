import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../login/user';
import Swal from 'sweetalert2';
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
public cardImageBase64:string;
public isImageSaved:boolean;
public isShowMyprofile:boolean;
  constructor(private router:Router) {
    var item = localStorage.getItem('deptId');
    this.userRole = JSON.parse(item).role;
    this.cardImageBase64 =JSON.parse(item).image;
    //console.log(this.cardImageBase64);
    if(this.userRole == 'admin'){
         this.isShowDept = true;
         this.isShowMyprofile = false;
      }else{
        this.isShowDept = false;
        this.isShowLeave = true;
        this.isShowMyprofile = true;
      };
      

   if(this.userRole == "TeamManager"){
     this.isShowLeaveManage = true;
   }else{
    this.isShowLeaveManage = false;
    //this.isShowMyprofile = false;
   };
  };
  ngOnInit(): void {
    if(this.cardImageBase64 != "null" && this.cardImageBase64 != undefined && this.cardImageBase64 != ''){
      this.isImageSaved = true;
    }
  }

  logout(){
    Swal.fire({
      title: 'Are you sure to LogOut?',
      //text: 'You will not be able to recover this imaginary file!',
      //icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, LogOut it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
    this.router.navigate(['']);
      }
   })
 }
};
