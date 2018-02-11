import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatOptionModule,
    MatSelectModule
} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AboutComponent} from './about/about.component';
import {PokertimerComponent} from './pokertimer/pokertimer.component';
import {SettingsComponent} from './settings/settings.component';


@NgModule({
    declarations: [
        AppComponent,
        AboutComponent,
        PokertimerComponent,
        SettingsComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatOptionModule,
        MatSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
