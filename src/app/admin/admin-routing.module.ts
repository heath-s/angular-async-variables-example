import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminMetadataComponent } from './metadata/admin-metadata.component';
import { AdminUsersComponent } from './users/admin-users.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'metadata', component: AdminMetadataComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: '**', redirectTo: 'home' }
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
export class AdminRoutingModule { }
