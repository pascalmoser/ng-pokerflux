import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {MatButtonModule, MatToolbarModule} from '@angular/material';

import {AppComponent} from './app.component';
import {AboutComponent} from './about/about.component';
import {PokertimerComponent} from './pokertimer/pokertimer.component';


@NgModule({
    declarations: [
        AppComponent,
        AboutComponent,
        PokertimerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
