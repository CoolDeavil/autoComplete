import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '../Components/app.component';
import {HighlightPipe} from "../Pipes/highlight.pipe";
import {SafeHtmlPipe} from "../Pipes/safeHtml.pipe";
import {ListComponent} from "../Components/list.component";
import {ClickOutsideDirective} from "../Directives/click-outside.directive";
import {StoreService} from "../Services/store.service";
import {HttpClientModule} from "@angular/common/http";
import ScrollBox from "../Classes/scrollBox";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    ListComponent,
    HighlightPipe,
    SafeHtmlPipe,
    ClickOutsideDirective,
  ],
  providers: [
    HighlightPipe,
    SafeHtmlPipe,
    ClickOutsideDirective,
    StoreService,
    ScrollBox,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
