import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard as AdminAuthGuard } from './auth/admin-auth.guard';
import { NoSigninGuard } from './auth/no-signin.guard';
import { AuthGuard as UserAuthGuard } from './auth/user-auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AdminAuthGuard],
    canLoad: [AdminAuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then((m) => m.SigninModule),
    canActivate: [NoSigninGuard]
  },
  {
    path: 'sub-service',
    loadChildren: () => import('./sub-service/sub-service.module').then((m) => m.SubServiceModule),
    data: { roles: ['sub-service'] },
    canActivate: [UserAuthGuard],
    canLoad: [UserAuthGuard]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdminAuthGuard,
    NoSigninGuard,
    UserAuthGuard
  ]
})
export class AppRoutingModule { }
