import {Routes, RouterModule} from "@angular/router";

import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";

const appRoutes: Routes = [
  // {path: '', component: AppComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
