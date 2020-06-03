import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubServiceComponent } from './sub-service.component';
import { SubServiceDashboardComponent } from './dashboard/sub-service-dashboard.component';

const routes: Routes = [
  {
    path: '', component: SubServiceComponent,
    children: [
      { path: 'dashboard', component: SubServiceDashboardComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SubServiceRoutingModule { }
