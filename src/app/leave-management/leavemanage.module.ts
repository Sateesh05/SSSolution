import { NgModule } from "@angular/core";
import { LeaveManagementComponent } from './leave-management.component';
import { RouterModule } from '@angular/router';
import { employeeService } from '../employee/employee.service';
import { departmentService } from '../department/department.service';
import { LeaveService } from '../leave/leave.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [LeaveManagementComponent],
  imports: [NgxPaginationModule, CommonModule, HttpClientModule,FormsModule,RouterModule.forChild([
        {path:'',component:LeaveManagementComponent}
    ])],
    providers: [employeeService,departmentService,LeaveService],
    exports: [LeaveManagementComponent]
})
export class leaveManageModule{}
