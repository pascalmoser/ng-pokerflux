(function () {
    'use strict';

    angular
    .module('Ptimer',['ngMaterial', 'ngStorage', 'timer'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('deep-purple')
        .warnPalette('pink')
    })
    .controller('AppCtrl', AppCtrl);

    function AppCtrl ( $scope, $http, $mdToast, $localStorage ) {

        $scope.timer = {
            state: 'pause', // play, pause, timeout
            breakTime: false
        };

        $scope.gameSchedule = [
            { smallblind:10, bigblind:20, playtime:10, breaktime:9 },
            { smallblind:20, bigblind:40, playtime:8, breaktime:7 },
            { smallblind:50, bigblind:100, playtime:6, breaktime:5 },
            { smallblind:100, bigblind:200, playtime:4, breaktime:3 },
            { smallblind:200, bigblind:400, playtime:2, breaktime:1 }
        ];

        $scope.game = {
            playTime: $scope.gameSchedule[0].playtime,
            breakTime: 0,
            bigBlind: 0,
            smallBlind: 0,
            scheduleIndex: 0
        };

        $scope.toggleTimer = function(forcePlay) {
            if($scope.timer.state !== 'play' || forcePlay === true) {
                $scope.timer.state = 'play';
                $scope.playTimer();
            } else {
                $scope.timer.state = 'pause';
                $scope.pauseTimer();
            }
        };

        $scope.playTimer = function() {
            if($scope.game.scheduleIndex === 0) {
                $scope.scheduler();
            }
            $scope.$broadcast('timer-start');
        };

        $scope.pauseTimer = function() {
            $scope.$broadcast('timer-stop');
        };

        $scope.scheduler = function() {
            if($scope.game.breakTime > 0 && !$scope.timer.breaktime) {
                console.log('break');
                $scope.breakTime();
            } else {
                $scope.timer.breaktime = false;
                $scope.game.smallBlind = $scope.gameSchedule[$scope.game.scheduleIndex].smallblind;
                $scope.game.bigBlind = $scope.gameSchedule[$scope.game.scheduleIndex].bigblind;
                $scope.game.breakTime = $scope.gameSchedule[$scope.game.scheduleIndex].breaktime;
                $scope.$broadcast('timer-set-countdown-seconds', $scope.gameSchedule[$scope.game.scheduleIndex].playtime);
                $scope.game.scheduleIndex++;
                $scope.toggleTimer(true);
            }
        };

        $scope.$on('timer-stopped', function (event, data){
            if(data.seconds === 0) {
                $scope.timeOut();
            }
        });

        $scope.timeOut = function() {
            console.log('timeout');
            if($scope.timer.state !== 'timeout') {
                $scope.timer.state = 'timeout';
                $scope.$broadcast('timer-set-countdown-seconds', 5);
                $scope.$broadcast('timer-start');
            } else {
                $scope.scheduler();
            }
        };

        $scope.breakTime = function() {
            $scope.$broadcast('timer-set-countdown-seconds', $scope.game.breakTime);
            $scope.timer.state = 'pause';
            $scope.timer.breaktime = true;
            $scope.$broadcast('timer-start');
        };

        $scope.pauseTimer = function() {
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };


        $scope.color={
            red: 255,
            green: 255,
            blue: 255
        }
        $scope.effect={
            period:1,
            cycles:4,
            type:'pulse'
        }
        $scope.$storage = $localStorage;
        $scope.effectsOn = false;
        $scope.apitoken=$scope.$storage.api;
        $scope.submitProgress=false;

        getBulbs();
        $scope.apichange = function() {
            getBulbs();
        }

        $scope.submitLight=function() {
            $scope.submitProgress=true;
            var color='rgb:'+$scope.color.red+','+$scope.color.green+','+$scope.color.blue;
            var url= !$scope.effectsOn ? 'state' : 'effects/' + $scope.effect.type;
            var data= !$scope.effectsOn ? '{"color":"'+color+'"}' : '{"period":"'+$scope.effect.period+'", "cycles":"'+$scope.effect.cycles+'", "color":"'+color+'"}';
            var method= !$scope.effectsOn ? 'PUT' : 'POST';
            $http({
                method: method,
                url: "https://api.lifx.com/v1/lights/all/"+url,
                headers: {'Authorization': 'Bearer '+$scope.apitoken, 'Content-Type': 'application/json'},
                data: data
            }).then(
                function(response){
                    var toastMsg = "Status " + response.status + " " + response.statusText + " ";
                    if(response.status==207){
                        angular.forEach(response.data.results, function(value, key) {
                            toastMsg += "(" + value.label + ": " + value.status + ") ";
                        });
                    }
                    showCustomToast( $mdToast, toastMsg );
                    $scope.submitProgress=false;
                    getBulbs();
                },
                function(response){
                    showCustomToast( $mdToast, "Status " + response.status + " " + response.statusText + " (" + response.data.error + ")" );
                    $scope.submitProgress=false;
                }
            );
        }
        function showCustomToast( $mdToast, toastMsg ) {
            $mdToast.show(
                $mdToast.simple()
                .action('OK')
                .highlightAction(true)
                .textContent(toastMsg)
                .position('bottom right')
                .hideDelay(6000)
            );
        };
        function getBulbs(){
            $scope.$storage.api = $scope.apitoken;

            $http({
                method: 'GET',
                url: "https://api.lifx.com/v1/lights/all",
                headers: {'Authorization': 'Bearer '+$scope.apitoken, 'Content-Type': 'application/json'}
            }).then(
                function(response){
                    console.log(response);
                    if(response.status == 200) {
                        $scope.bulbs = [];
                        angular.forEach(response.data, function(value, key) {
                            console.log(value);
                            $scope.bulbs.push({
                                name: value.label,
                                color: hsvToRgb(value.color.hue, value.color.saturation*100, value.brightness*100),
                                location: value.location.name,
                                group: value.group.name
                            });
                        });
                        console.log($scope.bulbs);
                    }
                },
                function(response){
                    showCustomToast( $mdToast, "Status " + response.status + " " + response.statusText + " (" + response.data.error + ")" );
                    $scope.submitProgress=false;
                }
            );
        }
    }

})();
