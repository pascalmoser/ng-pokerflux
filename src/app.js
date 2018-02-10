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
            on: false
        };

        $scope.gameSchedule = [
            { smallblind:10, bigblind:20, playtime:30*60, breaktime:15*60 },
            { smallblind:20, bigblind:40, playtime:30*60, breaktime:15*60 },
            { smallblind:50, bigblind:100, playtime:20*60, breaktime:10*60 },
            { smallblind:100, bigblind:200, playtime:20*60, breaktime:10*60 },
            { smallblind:200, bigblind:400, playtime:20*60, breaktime:10*60 },
            { smallblind:400, bigblind:800, playtime:10*60, breaktime:5*60 },
            { smallblind:800, bigblind:1600, playtime:10*60, breaktime:5*60 }
        ];

        $scope.game = {
            state: 'pause', // play, pause, timeout
            smallBlind: $scope.gameSchedule[0].smallblind,
            bigBlind: $scope.gameSchedule[0].bigblind,
            playTime: $scope.gameSchedule[0].playtime,
            breakTime: 0,
            scheduleIndex: 0,
            onBreakTime: false
        };

        $scope.toggleTimer = function(forcePlay) {
            if($scope.timer.on !== true || forcePlay === true) {
                $scope.game.state = 'play';
                $scope.timer.on = true;
                $scope.playTimer();
            } else {
                $scope.game.state = 'pause';
                $scope.timer.on = false;
                $scope.pauseTimer();
            }
        };

        $scope.playTimer = function() {
            if($scope.game.scheduleIndex === 0) {
                $scope.scheduler();
            } else {
                console.log('play');
                $scope.submitLight();
                $scope.$broadcast('timer-start');
            }
        };

        $scope.pauseTimer = function() {
            console.log('pause');
            $scope.submitLight();
            $scope.$broadcast('timer-stop');
        };

        $scope.scheduler = function() {
            if($scope.game.breakTime > 0 && !$scope.game.onBreakTime) {
                console.log('break');
                $scope.breakTime();
            } else {
                $scope.game.onBreakTime = false;
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
            if($scope.game.state !== 'timeout') {
                $scope.game.state = 'timeout';
                $scope.$broadcast('timer-set-countdown-seconds', 5);
                $scope.$broadcast('timer-start');

                console.log('timeout');
                $scope.submitLight();
            } else {
                $scope.scheduler();
            }
        };

        $scope.breakTime = function() {
            $scope.$broadcast('timer-set-countdown-seconds', $scope.game.breakTime);
            $scope.game.state = 'pause';
            $scope.game.onBreakTime = true;
            $scope.$broadcast('timer-start');

            console.log('breaktime');
            $scope.submitLight();
        };

        $scope.light = {
            apitoken: 'c9ca88d17f51936c83778c1fbdfea7066248becac5f64c19fe6a598465730da6',
            playClor: 'rgb:42,222,90',
            pauseColor: 'rgb:131,65,214',
            timeoutColor: 'rgb:255,0,24',
            timeoutEffects: {
                period:1,
                cycles:4,
                type:'pulse'
            }
        };

        $scope.submitLight = function() {
            var color = '';
            var url = '';
            var data = '';
            var method = '';
            if($scope.game.state === 'play') {
                color = $scope.light.playClor;
                url = 'state';
                data = '{"color":"'+color+'"}';
                method = 'PUT';
            } else if ($scope.game.state === 'pause') {
                color = $scope.light.pauseColor;
                url = 'state';
                data = '{"color":"'+color+'"}';
                method = 'PUT';
            } else if ($scope.game.state === 'timeout') {
                color = $scope.light.timeoutColor;
                url = 'effects/pulse';
                data = '{"period":"'+$scope.light.timeoutEffects.period+'", "cycles":"'+$scope.light.timeoutEffects.cycles+'", "color":"'+color+'"}';
                method = 'POST';
            }

            $http({
                method: method,
                url: "https://api.lifx.com/v1/lights/all/"+url,
                headers: {'Authorization': 'Bearer '+$scope.light.apitoken, 'Content-Type': 'application/json'},
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
                },
                function(response){
                    showCustomToast( $mdToast, "Status " + response.status + " " + response.statusText + " (" + response.data.error + ")" );
                    $scope.submitProgress=false;
                }
            );
        };

        function showCustomToast( $mdToast, toastMsg ) {
            $mdToast.show(
                $mdToast.simple()
                .action('OK')
                .highlightAction(true)
                .textContent(toastMsg)
                .position('bottom right')
                .hideDelay(6000)
            );
        }
    }

})();
