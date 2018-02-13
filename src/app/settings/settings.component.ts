import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ApilifxService} from "../apilifx.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    apiTokenControl = new FormControl(localStorage.getItem('apiToken'), {
        updateOn: 'blur'
    });

    bulbsControl = new FormControl();
    bulbList = [];

    playSceneControl = new FormControl();
    sceneList = [];

    playColorControl = new FormControl();

    constructor(private _apilfx: ApilifxService) {
        this.apiTokenControl.valueChanges.subscribe(
            (value: string) => {
                _apilfx.setApiToken(value);
                this.getBulbs();
                this.getScenes();
            }
        );
        this.bulbsControl.valueChanges.subscribe(
            (value: string) => {
                _apilfx.setSelectedBulbs(value);
            }
        );
        this.playSceneControl.valueChanges.subscribe(
            (value: string) => {
                this.setPlayScene(value)
            }
        );
        this.playColorControl.valueChanges.subscribe(
            (value: string) => {
                this.setPlayColor(value);
            }
        );
        this.getBulbs();
        this.getScenes();
    }

    setPlayScene(value) {
        this._apilfx.setPlayScene(value);
    }

    setPlayColor(value) {
        this._apilfx.setPlayColor(value);
    }

    getBulbs() {
        this._apilfx.getBulbs()
            .subscribe(
                bulbs => console.log(this.bulbList = bulbs),
                error => console.log(error.error.error)
            );
    }

    getScenes() {
        this._apilfx.getScenes()
            .subscribe(
                scenes => console.log(this.sceneList = scenes),
                error => console.log(error.error.error)
            );
    }


    sendPlayState() {
        this._apilfx.sendPlayState().subscribe();
    }

    ngOnInit() {

    }

}
