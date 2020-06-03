import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminMetadataComponent } from './metadata/admin-metadata.component';
import { AdminMetadataItemDialogComponent } from './metadata/item-dialog/admin-metadata-item-dialog.component';
import { AdminMetadataService } from './metadata/admin-metadata.service';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserItemDialogComponent } from './users/item-dialog/admin-user-item-dialog.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminUsersService } from './users/admin-users.service';
import { ApiModule } from 'src/app/api/api.module';
import { AuthModule } from 'src/app/auth/auth.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminMetadataItemDialogComponent,
    AdminMetadataComponent,
    AdminUserItemDialogComponent,
    AdminUsersComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    NgJsonEditorModule,
    ReactiveFormsModule,

    AdminRoutingModule,
    ApiModule,
    AuthModule
  ],
  providers: [
    AdminMetadataService,
    AdminUsersService
  ]
})
export class AdminModule { }
