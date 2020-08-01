import { NgModule } from "@angular/core";
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { employeeService } from 'src/app/employee/employee.service';
import { departmentService } from 'src/app/department/department.service';

@NgModule({
    declarations:[ProfileComponent],
    imports:[CommonModule,HttpClientModule,FormsModule,RouterModule.forChild([
        {path:'',component:ProfileComponent}
    ])],
    providers:[employeeService,departmentService],
    exports:[ProfileComponent]
})
export class profileModule{}