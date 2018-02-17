import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class ApilifxService {

    private apiToken: string = localStorage.getItem('apiToken');
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.apiToken
        })
    };
    private selectedBulbs = localStorage.getItem('selectedBulbs') ?
        JSON.parse(localStorage.getItem('selectedBulbs')) : ['All'];
    private playLight = {
        'state': localStorage.getItem('playState') ? localStorage.getItem('playState') : 'color',
        'scene': localStorage.getItem('playScene'),
        'color': localStorage.getItem('playColor') ? localStorage.getItem('playColor') : '#21A344'
    };
    private pauseLight = {
        'state': localStorage.getItem('pauseState') ? localStorage.getItem('pauseState') : 'color',
        'scene': localStorage.getItem('pauseScene'),
        'color': localStorage.getItem('pauseColor') ? localStorage.getItem('pauseColor') : '#8341d6'
    };
    private timeoutLight = {
        'state': localStorage.getItem('timeoutState') ? localStorage.getItem('pauseState') : 'color',
        'scene': localStorage.getItem('timeoutScene'),
        'color': localStorage.getItem('timeoutColor') ? localStorage.getItem('pauseColor') : '#ff0018'
    };

    constructor(private http: HttpClient) {
    }

    setApiToken(apiToken) {
        this.apiToken = apiToken;
        this.httpOptions.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.apiToken
        });
        localStorage.setItem('apiToken', apiToken);
    }

    getApiToken() {
        return this.apiToken;
    }

    setSelectedBulbs(bulbs) {
        this.selectedBulbs = bulbs;
        localStorage.setItem('selectedBulbs', JSON.stringify(bulbs));
    }

    getSelectedBulbs() {
        return this.selectedBulbs;
    }

    setPlayLight(form) {
        this.playLight.state = form.scene;
        this.playLight.color = form.color;
        this.playLight.scene = form.scene;

        localStorage.setItem('playState', form.state);
        localStorage.setItem('playColor', form.color);
        localStorage.setItem('playScene', form.scene);
    }

    getPlayLight() {
        return this.playLight;
    }

    setPauseLight(form) {
        this.pauseLight.state = form.scene;
        this.pauseLight.color = form.color;
        this.pauseLight.scene = form.scene;

        localStorage.setItem('pauseState', form.state);
        localStorage.setItem('pauseColor', form.color);
        localStorage.setItem('pauseScene', form.scene);
    }

    getPauseLight() {
        return this.pauseLight;
    }

    setTimeoutLight(form) {
        this.timeoutLight.state = form.scene;
        this.timeoutLight.color = form.color;
        this.timeoutLight.scene = form.scene;

        localStorage.setItem('timeoutState', form.state);
        localStorage.setItem('timeoutColor', form.color);
        localStorage.setItem('timeoutScene', form.scene);
    }

    getTimeoutLight() {
        return this.timeoutLight;
    }

    getBulbs(): any {
        return this.http.get(
            'https://api.lifx.com/v1/lights/all/',
            this.httpOptions
        );
    }

    getScenes(): any {
        return this.http.get(
            'https://api.lifx.com/v1/scenes/',
            this.httpOptions
        );
    }

    sendPlayState(): any {
        let url: string;
        let data = {};
        let selector = this.selectedBulbs.indexOf('all') !== -1 ? 'all' : this.selectedBulbs.join(',');

        if (this.playLight.state == 'scene') {
            url = 'https://api.lifx.com/v1/scenes/scene_id:' + this.playLight.scene + '/activate';
            data = {};
        } else {
            url = 'https://api.lifx.com/v1/lights/' + selector + '/state';
            data = {'color': this.playLight.color, 'power' : 'on'}
        }

        return this.sendPut(url, data);

    }

    sendPauseState(): any {
        let url: string;
        let data = {};
        let selector = this.selectedBulbs.indexOf('all') !== -1 ? 'all' : this.selectedBulbs.join(',');

        console.log(selector);

        if (this.pauseLight.state == 'scene') {
            url = 'https://api.lifx.com/v1/scenes/scene_id:' + this.pauseLight.scene + '/activate';
            data = {};
        } else {
            url = 'https://api.lifx.com/v1/lights/' + selector + '/state';
            data = {'color': this.pauseLight.color, 'power' : 'on'}
        }

        return this.sendPut(url, data);
    }

    sendTimeoutState(): any {
        let url: string;
        let data = {};
        let selector = this.selectedBulbs.indexOf('all') !== -1 ? 'all' : this.selectedBulbs.join(',');

        if (this.timeoutLight.state == 'scene') {
            url = 'https://api.lifx.com/v1/scenes/scene_id:' + this.timeoutLight.scene + '/activate';
            data = {};
        } else {
            url = 'https://api.lifx.com/v1/lights/' + selector + '/state';
            data = {'color': this.timeoutLight.color, 'power' : 'on'}
        }

        return this.sendPut(url, data);
    }

    sendPut(url, data): any {
        console.log(url, data);
        return this.http.put(
            url,
            JSON.stringify(data),
            this.httpOptions
        );
    }

}
