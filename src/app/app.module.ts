//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
//  import { DepartmentComponent } from './department/department.component';
//  import { DashboardComponent } from './dashboard/dashboard.component'; import { EmployeeComponent } from './employee/employee.component';
//  import { LeaveComponent } from './leave/leave.component';
//  import { LoginComponent } from './login/login.component';
//  import { LeaveManagementComponent } from './leave-management/leave-management.component';
import { RouterModule } from '@angular/router';
import { departmentService } from './department/department.service';
import { employeeService } from './employee/employee.service';
import { LoginService } from './login/login.service';
import { ToastrComponent } from './toastr/toastr.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    ToastrComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(), RouterModule.forRoot([
      { path: "", loadChildren: () => import('./login/login.module').then(obj => obj.LoginModule) },
      { path: "dashbord", loadChildren: () => import('./dashboard/dashboard.module').then(obj => obj.DashboardModule) }
    ])
  ],
  providers: [departmentService, employeeService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
