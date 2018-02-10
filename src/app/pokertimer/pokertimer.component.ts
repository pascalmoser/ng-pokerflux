import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {MatButtonModule, MatToolbarModule} from '@angular/material';


@Component({
    selector: 'app-pokertimer',
    templateUrl: './pokertimer.component.html',
    styleUrls: ['./pokertimer.component.scss']
})
export class PokertimerComponent implements OnInit {

    ticks = 0;
    minutesDisplay: number = 0;
    secondsDisplay: number = 0;

    timer: Subscription;

    timerState = {
        on: false,
        pausedTicks: 0
    };

    gameSchedule = [
        {smallblind: 50, bigblind: 100, playtime: 0.3, breaktime: 5},
        {smallblind: 100, bigblind: 200, playtime: 0.5, breaktime: 5},
        {smallblind: 200, bigblind: 400, playtime: 0.5, breaktime: 5},
        {smallblind: 400, bigblind: 800, playtime: 45, breaktime: 5},
        {smallblind: 800, bigblind: 1600, playtime: 60, breaktime: 5},
        {smallblind: 1600, bigblind: 3200, playtime: 60, breaktime: 0}
    ];

    game = {
        state: '', // play, pause, timeout
        smallBlind: this.gameSchedule[0].smallblind,
        bigBlind: this.gameSchedule[0].bigblind,
        playTime: this.gameSchedule[0].playtime,
        breakTime: 0,
        scheduleIndex: 0,
        onBreakTime: false
    };

    constructor() {

    }

    ngOnInit() {

    }

    private toggleTimer() {
        console.log('toggleTimer');

        if (this.game.state === 'play') {
            this.pauseTimer();
            this.game.state = 'pause';
        } else if (this.game.state === 'pause' && this.timerState.on === false) {
            this.startTimer(this.timerState.pausedTicks / 60);
            this.timerState.pausedTicks = 0;
            this.game.state = 'play';
        } else {
            this.stopTimer();
            this.scheduler();
        }

    }

    private scheduler() {
        console.log('scheduler');
        if (this.game.breakTime > 0 && !this.game.onBreakTime) {
            console.log('break');
            this.breakTime();
        } else {
            this.game.state = 'play';
            this.game.onBreakTime = false;
            this.game.smallBlind = this.gameSchedule[this.game.scheduleIndex].smallblind;
            this.game.bigBlind = this.gameSchedule[this.game.scheduleIndex].bigblind;
            this.game.breakTime = this.gameSchedule[this.game.scheduleIndex].breaktime;
            this.startTimer(this.gameSchedule[this.game.scheduleIndex].playtime);
            this.game.scheduleIndex++;
        }
    };

    private timeOut() {
        console.log('timeOut');
        if (this.game.state !== 'timeout') {
            this.game.state = 'timeout';
            this.startTimer(0.15);
            console.log('timeout');
        } else {
            this.scheduler();
        }
    }

    private breakTime() {
        console.log('breakTime');
        this.startTimer(this.game.breakTime);
        this.game.state = 'pause';
        this.game.onBreakTime = true;
        console.log('breaktime');
    };

    private startTimer(minutes) {
        console.log('startTimer');
        this.timerState.on = true;
        let _ = this,
            timer = Observable
                .timer(1000, 1000)
                .map(i => minutes * 60 - i)
                .take(minutes * 60 + 1);

        this.timer = timer.subscribe(
            t => {
                this.ticks = t;

                this.secondsDisplay = this.getSeconds(this.ticks);
                this.minutesDisplay = this.getMinutes(this.ticks);
            }, function (e) {
                console.log(e);
            }, function () {
                console.log('timer finish');
                _.timeOut();
            }
        );
    }

    private pauseTimer() {
        console.log('pauseTimer');
        this.timerState.pausedTicks = this.ticks;
        this.timerState.on = false;
        this.timer.unsubscribe();
    }

    private stopTimer() {
        console.log('stopTimer');
        if (this.timer) {
            this.timer.unsubscribe();
        }
    }

    private getSeconds(ticks: number) {
        return ticks % 60;
    }

    private getMinutes(ticks: number) {
        return (Math.floor(ticks / 60));
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

}
