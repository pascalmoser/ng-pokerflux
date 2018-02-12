import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApilifxService} from "../apilifx.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    apiToken = new FormControl(localStorage.getItem('apiToken'), {
        updateOn: 'blur'
    });

    bulbs = new FormControl();

    bulbList = [];

    constructor(private _apilfx: ApilifxService) {
        this.apiToken.valueChanges.subscribe(
            (value: string) => {
                _apilfx.setApiToken(value);
                this.getBulbs();
            }
        );
        this.getBulbs();
    }

    getBulbs() {
        this._apilfx.getBulbs()
            .subscribe(
                bulbs => console.log(this.bulbList = bulbs),
                error => console.log(error.error.error)
            );
    }


    ngOnInit() {

    }

}
