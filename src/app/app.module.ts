import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatCardModule, MatExpansionModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatExpansionModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
