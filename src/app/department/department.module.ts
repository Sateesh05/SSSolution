import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './department.component';
import { departmentService } from './department.service';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [DepartmentComponent],
    imports: [CommonModule, FormsModule, HttpClientModule, RouterModule.forChild([
        { path: '', component: DepartmentComponent }
    ])],
    providers: [departmentService],
    exports: [DepartmentComponent]
})
export class departmentModule { }
