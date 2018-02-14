import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ApilifxService} from "../apilifx.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    apiTokenControl = new FormControl(this._apilfx.getApiToken(), {
        updateOn: 'blur'
    });

    bulbsControl = new FormControl();
    bulbList = [];
    sceneList = [];

    playSettings = new FormGroup({
        state: new FormControl(this._apilfx.getPlayLight().state),
        scene: new FormControl(this._apilfx.getPlayLight().scene),
        color: new FormControl(this._apilfx.getPlayLight().color, {
            updateOn: 'blur'
        })
    });

    pauseSettings = new FormGroup({
        state: new FormControl(this._apilfx.getPauseLight().state),
        scene: new FormControl(this._apilfx.getPauseLight().scene),
        color: new FormControl(this._apilfx.getPauseLight().color, {
            updateOn: 'blur'
        })
    });

    timeoutSettings = new FormGroup({
        state: new FormControl(this._apilfx.getTimeoutLight().state),
        scene: new FormControl(this._apilfx.getTimeoutLight().scene),
        color: new FormControl(this._apilfx.getTimeoutLight().color, {
            updateOn: 'blur'
        })
    });


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
        this.playSettings.valueChanges.subscribe(
            (value: string) => {
                this._apilfx.setPlayLight(value)
            }
        );
        this.pauseSettings.valueChanges.subscribe(
            (value: string) => {
                this._apilfx.setPauseLight(value)
            }
        );
        this.timeoutSettings.valueChanges.subscribe(
            (value: string) => {
                this._apilfx.setTimeoutLight(value)
            }
        );
        this.getBulbs();
        this.getScenes();
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

    sendPauseState() {
        this._apilfx.sendPauseState().subscribe();
    }

    sendTimeoutState() {
        this._apilfx.sendTimeoutState().subscribe();
    }

    ngOnInit() {

    }

}
