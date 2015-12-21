/*jslint vars: true, devel:true, nomen: true, node: true, indent: 2, maxerr: 50*/
/*global describe, it, angular, io*/
'use strict';

(function () {

  var app = angular.module("shazamApp");

  function ShazamController($scope, $cordovaVibration) {
    // var socket = io("http://localhost:8080");
    var socket = io("http://secure-citadel-7581.herokuapp.com/");

    var shazamMsg = {
      location: "mobileApp"
    };

    $scope.appState = {};
    $scope.imgUrl = "";
    $scope.imgSrc = "";
    $scope.shazam = function () {
      // console.log("Emiitted Shazam");
      socket.emit("Shazam!", shazamMsg);
    };

    function onRefresh(newState) {
      $scope.$apply(function () {
        // console.log("Refresh called @" + new Date());
        var lastLocation = newState.lastEventSource;

        //Copy the app state
        $scope.appState = newState;

        // console.log($scope.appState[lastLocation]);
        // //Set the image to be displayed
        if ($scope.appState.isBilly) {
          $scope.imgUrl = $scope.appState[lastLocation].billyImg;
          $scope.imgSrc = $scope.appState[lastLocation].billySrc;
        } else {
          $scope.imgUrl = $scope.appState[lastLocation].shazamImg;
          $scope.imgSrc = $scope.appState[lastLocation].shazamSrc;
        }
        // console.log($scope.appState);
        // console.log($scope.imgUrl);
        // console.log($scope.imgSrc);
      });
    }

    // $cordovaNativeAudio
    //   .preloadSimple('transform', 'audio/shazam.transform.mp3')
    //   .then(function (msg) {
    //     console.log(msg);
    //   }, function (error) {
    //     alert(error);
    //   });

    function onTransform(newState) {

      // $cordovaNativeAudio.play('transform');
      //
      var audio = new Audio("audio/shazam.transform.mp3");
      audio.play();
      // console.log("Transform called @" + new Date());
      // console.log(newState);
      onRefresh(newState);
      $cordovaVibration.vibrate(100);
      //Flicker Screen
    }

    socket.on("Refresh!", onRefresh);
    socket.on("Transform!", onTransform);
    socket.emit("Who am I?");
  }

  app.controller('shazam.controller', ["$scope", "$cordovaVibration", ShazamController]);
}());
