import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
   MatCheckboxModule,
   MatCardModule,
  MatToolbarModule,
  MatTabsModule,
   MatIconModule,
   MatListModule,
   MatSidenavModule,
   MatInputModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatMenuModule,
   MatSelectModule,
   MatButtonToggleModule,
   MatTooltipModule,
   MatRadioModule,
   MatDialogModule,
   MatSliderModule,
   MatTableModule,
   MatPaginatorModule,
   MatChipsModule,
   MatSortModule,
   MatExpansionModule
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';
import 'hammerjs';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from './header/header.component';
import {FiltersComponent} from './filters/filters.component';
import {FilterItemComponent} from './filters/filter-item/filter-item.component';
import {TabsComponent} from './tabs/tabs.component';
import {MapComponent} from './tabs/map/map.component';
import {ResultsComponent} from './tabs/results/results.component';
import {DetailsComponent} from './tabs/details/details.component';
import {VisualizationComponent} from './tabs/visualization/visualization.component';
import {DataService} from "./data.service";
import {VisualizationService} from "./visualization.service";
import {AgmCoreModule, AgmMap, GoogleMapsAPIWrapper} from '@agm/core';
import { LineChartComponent } from './tabs/visualization/charts/line-chart/line-chart.component';
import { HistogramComponent } from './tabs/visualization/charts/histogram/histogram.component';
import { PlotOptionsComponent } from './tabs/visualization/plot-options/plot-options.component';
import { ScatterPlotComponent } from './tabs/visualization/charts/scatter-plot/scatter-plot.component';
import { BoxPlotComponent } from './tabs/visualization/charts/box-plot/box-plot.component';
import { SummaryStatisticsComponent } from './tabs/visualization/summary-statistics/summary-statistics.component';
import { SideNavComponent } from './side-nav/side-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FiltersComponent,
    FilterItemComponent,
    TabsComponent,
    MapComponent,
    ResultsComponent,
    DetailsComponent,
    VisualizationComponent,
    LineChartComponent,
    HistogramComponent,
    PlotOptionsComponent,
    ScatterPlotComponent,
    BoxPlotComponent,
    SummaryStatisticsComponent,
    SideNavComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCG8oE0dNOkKju0PeMK63rwQR7gB7kdJ7w'
    }),
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    MatDialogModule,
    MatSliderModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatSortModule,
    MatExpansionModule
  ],
  entryComponents: [
    SummaryStatisticsComponent, DetailsComponent
  ],
  providers: [DataService, AgmMap, GoogleMapsAPIWrapper, VisualizationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
