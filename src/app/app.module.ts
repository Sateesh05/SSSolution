import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { departmentService } from './department/department.service';
import { employeeService } from './employee/employee.service';
import { LoginService } from './login/login.service';
import { ToastrComponent } from './toastr/toastr.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './profile/profile/profile.component';
import { profileModule } from './profile/profile/profile.module';


@NgModule({
  declarations: [
    AppComponent,
    ToastrComponent
    
  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot(), RouterModule.forRoot([
      { path: "", loadChildren: () => import('./login/login.module').then(obj => obj.LoginModule) },
      { path: "dashbord", loadChildren: () => import('./dashboard/dashboard.module').then(obj => obj.DashboardModule) }
    ])
  ],
  providers: [departmentService, employeeService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
