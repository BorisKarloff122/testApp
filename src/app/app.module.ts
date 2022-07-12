import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './components/grid/grid.component';
import { StoreModule } from "@ngrx/store";
import { HttpClientModule } from "@angular/common/http";
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { tableReducer } from './store/table/table.reducers';
import { TableEffects } from './store/table/table.effects';
import { ToolBarModule } from "@progress/kendo-angular-toolbar";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import {ButtonModule} from "@progress/kendo-angular-buttons";


@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
  ],
  imports: [
    BrowserModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({measurementInfo: tableReducer}),
    EffectsModule.forRoot([TableEffects]),
    ToolBarModule,
    ReactiveFormsModule,
    DropDownListModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
