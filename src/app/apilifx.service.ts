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
    private selectedBulbs = [];
    private playLight = {
        'scene': null,
        'color': null
    };

    constructor(private http: HttpClient) {
    }

    setApiToken(apiToken) {
        this.apiToken = apiToken;
        this.httpOptions.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.apiToken
        });
        console.log(this.httpOptions);
        localStorage.setItem('apiToken', apiToken);
    }

    setSelectedBulbs(bulbs) {
        this.selectedBulbs = bulbs;
    }

    setPlayScene(scene) {
        this.playLight.scene = scene;
        this.playLight.color = null;
    }

    setPlayColor(color) {
        this.playLight.color = color;
        this.playLight.scene = null;
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

        if(this.playLight.scene) {
            url = 'https://api.lifx.com/v1/scenes/scene_id:'+this.playLight.scene+'/activate';
            data = {};
        } else {
            url = 'https://api.lifx.com/v1/lights/all/state';
            data = {'color':this.playLight.color}
        }

        return this.http.put(
            url,
            JSON.stringify(data),
            this.httpOptions
        );

    }

}
