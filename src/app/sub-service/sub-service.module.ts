import { CommonModule } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ReactiveFormsModule } from '@angular/forms';

import { ApiModule } from 'src/app/api/api.module';
import { AuthModule } from 'src/app/auth/auth.module';
import { SubServiceComponent } from './sub-service.component';
import { SubServiceDashboardComponent } from './dashboard/sub-service-dashboard.component';
import { SubServiceDashboardItemComponent } from './dashboard/item/sub-service-dashboard-item.component';
import { SubServiceFilterComponent } from './filter/sub-service-filter.component';
import { SubServiceMatDateAdapter } from './sub-service-mat-date-adapter';
import { SubServiceService } from './sub-service.service';
import { SubServiceRoutingModule } from './sub-service-routing.module';

@NgModule({
  declarations: [
    SubServiceComponent,
    SubServiceDashboardComponent,
    SubServiceDashboardItemComponent,
    SubServiceFilterComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxEchartsModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule,

    SubServiceRoutingModule,
    ApiModule,
    AuthModule
  ],
  providers: [
    SubServiceService,
    {
      provide: DateAdapter,
      useClass: SubServiceMatDateAdapter
    }
  ]
})
export class SubServiceModule { }
