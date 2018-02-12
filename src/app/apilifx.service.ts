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

    getBulbs(): any {
        console.log(this.httpOptions);
        return this.http.get(
            'https://api.lifx.com/v1/lights/all/',
            this.httpOptions
        );
    }

}
