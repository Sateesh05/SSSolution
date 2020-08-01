import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { departmentService } from '../department/department.service';
@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, HttpClientModule, FormsModule, RouterModule.forChild([
        { path: '', component: LoginComponent }
        
    ])],
    providers: [LoginService,departmentService],
    exports: [LoginComponent]
})
export class LoginModule { }