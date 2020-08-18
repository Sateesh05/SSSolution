
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
//import { BrowserModule } from '@angular/platform-browser'

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, HttpClientModule, RouterModule.forChild([
    {
      path: '', component: DashboardComponent, children: [
        {
          path: 'department', loadChildren: () => import('../department/department.module')
            .then(obj => obj.departmentModule)
        },
        {
          path: 'employee', loadChildren: () => import('../employee/employee.module')
            .then(obj => obj.EmployeeModule)
        },
        {
          path: 'leave', loadChildren: () => import('../leave/leave.module').then(
            obj => obj.LeaveModule)
        },
        {
          path:'profile',loadChildren:()=>import('../profile/profile/profile.module').then(
            obj=>obj.profileModule)
        },
        {
          path:'',loadChildren:()=>import('../Home/home.module').then(obj => obj.homeModule)
        },

        {
          path: 'leaves',loadChildren:()=>import('../leave-management/leavemanage.module').then(
            obj => obj.leaveManageModule)
        },
        {
          path:'Home',loadChildren:()=>import('../Home/home.module').then(obj => obj.homeModule)
        }
      ]
    }
  ])],
  providers: [],
  exports: [DashboardComponent]
})
export class DashboardModule { }