import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { departmentService } from '../department/department.service';
                                    
@Component({
    selector : 'login',
    templateUrl : './login.component.html',
    styleUrls : ['./login.component.css']
})
export class LoginComponent{
    user = new User();
    public result:any;
    constructor(public router:Router,
                private service:LoginService,
                private department:departmentService){}    
    Register(data){
        const userData = data.value; 
        if(userData.email =='super@admin'&& userData.password == '123'){
            this.user.department_id = 0;
            this.user.role = 'admin';
            this.user.id = 0;
            localStorage.setItem('deptId',JSON.stringify(this.user));
            this.router.navigate(['/dashbord']);            
            console.log(this.user);
            //.router.navigate(['/dashbord'],{state:{param:user}});
        }else{
            this.service.LoginData(userData).subscribe((posRes)=>{
                if(posRes){
                   this.user = posRes[0];
                   this.department.getByIdDepartmentRecord(this.user.department_id).subscribe((posRe)=>{
                       this.user.department = posRe[0].name;
                       //console.log(this.user)
                       localStorage.setItem('deptId',JSON.stringify(this.user));
                       this.router.navigate(['/dashbord']);
                   })
                };                                                              
            },(err:HttpErrorResponse)=>{
                if(err.error instanceof Error){
                    console.log('client side error')
                }else{
                    console.log('server side error')
                };
            })    
        };                 
    };
};