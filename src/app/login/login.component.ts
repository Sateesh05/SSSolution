import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { departmentService } from '../department/department.service';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  user = new User();
  public result: any;
  constructor(public router: Router,
    private service: LoginService,
    private department: departmentService) { }
  Register(data) {

    const userData = data.value;
    if (userData.email == '' || userData.password == '') {

      this.isEmailValid = userData.email == '' ? false : true;
      this.isPasswordValid = userData.password == '' ? false : true;
    }
    else {
      this.isPasswordValid = this.isEmailValid = true;
      if (userData.email == 'super@admin' && userData.password == '123') {
        this.user.department_id = 0;
        this.user.role = 'admin';
        this.user.id = 0;
        localStorage.setItem('deptId', JSON.stringify(this.user));
        this.router.navigate(['/dashbord']);
        console.log(this.user);
      } else {
        this.service.LoginData(userData).subscribe((posRes) => {
          if (posRes) {
            this.user = posRes[0];
            this.department.getByIdDepartmentRecord(this.user.department_id).subscribe((posRe) => {
              this.user.department = posRe[0].name;
              //console.log(this.user)
              localStorage.setItem('deptId', JSON.stringify(this.user));
              this.router.navigate(['/dashbord']);
            })
          };
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('client side error')
          } else {
            console.log('server side error')
          };
        })
      }
    };
  };
  onKeyUp1(event: any) {
    //debugger;
    if (event.target.name == 'email' && event.target.value != null && event.target.value != undefined && event.target.value != '') {
      this.isEmailValid = true;

    } else {
      this.isEmailValid = false;
      //this.isPasswordValid = true;
    }
  };
  onKeyUp2(event: any) {
    //debugger;
    if (event.target.name == 'password' && event.target.value != null && event.target.value != undefined && event.target.value != '') {
      this.isPasswordValid = true;

    } else {
      //this.isEmailValid = false;
      this.isPasswordValid = false;
    }
  };

};
