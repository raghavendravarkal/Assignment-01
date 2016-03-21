( function() {
    'use strict';
// declare a module
    var myAppModule = angular.module('myApp', ['ngRoute','ngMessages']);

    myAppModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when("/", {templateUrl: "home.html", controller: "firstController"}).
            when("/manager", {templateUrl: "hosthome.html", controller: "formController"}).
            when("/reservations/makeReservation", {templateUrl: "guest.html", controller: "formController"}).
            when("/reservations/change", {templateUrl: "change.html", controller: "formController"}).
            when("/reservations/change/change2", {templateUrl: "change 2.html", controller: "formController"}).
            when("/host", {templateUrl: "host.html", controller: "formController"}).
            when("/seating", {templateUrl: "seating.html", controller: "formController"}).
            when("/profile", {templateUrl: "profile.html", controller: "formController"}).
            when("/contact", {templateUrl: "contact.html", controller: "formController"});
    }]);
    myAppModule.controller('firstController', function ($scope, $rootScope ) {
        //$scope.test = 'hey';
        $rootScope.rName = 'Project X';
        $rootScope.isHomePage = true;
    });


    myAppModule.controller('formController', function ($scope, $rootScope, $location , $http) {
        $rootScope.isHomePage = false;
        $rootScope.rName= 'Project X';
        $scope.rAddress = 'Av. de Rhode, 101, 17480 Roses, Girona, Spain';
        $scope.phone = '+34 972 15 07 17';
        $scope.rUsername ="admin";
        $scope.rPassword= "admin";

        //to get app info

        $scope.form = function (){
            $http({
                method: 'GET',
                url: 'http://localhost:8080/Project-API/api/settings'
            }).success(function(data){
                data:Settings
            }).error(function(error){
                console.log(error);
            });

        };

        //to authenticate user
   $scope.submit = function () {
            if($scope.form.Username==$scope.rUsername && $scope.form.Password==$scope.rPassword){
                $location.path("/host");
            }
            else{
                alert("Re-enter your credentials!")
            }

        };

        //routing to contact page

        $scope.contact = function () {
            $location.path("/contact");
        };

        $scope.sort = {
            by: 'id',
            reverse: false
        };

        //get all the guests
        $scope.guests = [];
        var url = "http://localhost:8080/Project-API/api/guests";
        $http.get(url).success(function (data) {
            $scope.guests = data;
        });

        //get guest by id
        $scope.guestsId= function (index) {
            var url = "http://localhost:8080/Project-API/api/guests/" + $scope.guests[index].id;
            console.log(url);
            $http.get(url).success(function (data) {
                $scope.guestByID = data;
                alert("Contact Number" +$scope.phone + "\n" +"Special Notes!" + $scope.guestByID.notes);

            });
        };


        //add a new guest
        $scope.addRow = function () {
            //to generate confirmation number
            if($scope.guests.length==0) {
                $scope.newGuest.id = 1200;
            }
            else {
                $scope.newGuest.id = (1200 + $scope.guests.length);
            }
            $scope.newGuest.tableno = randomString();
            console.log($scope.newGuest);
            $scope.guests.push({
                'id': $scope.newGuest.id,
                'date': $scope.newGuest.date,
                'time': $scope.newGuest.time,
                'name': $scope.newGuest.name,
                'phone': $scope.newGuest.phone,
                'email': $scope.newGuest.email,
                'partySize': $scope.newGuest.partysize,
                'notes': $scope.newGuest.notes
            });
            console.log($scope.guests);
            $http({
                method: 'POST',
                url: 'http://localhost:8080/Project-API/api/guest/makeReservation',
                data: $scope.newGuest
            }).success(function(data){
                console.log("Successfully POSTED Data");
                console.log(data);
            }).error(function(error){
                console.log("Error");
                console.log(error);
            })


        };

        //to update guest info
        $scope.editReservation = function(position){
            console.log($scope.Guest.id);
            console.log("Function called");
            for (var key in $scope.guests) { //Loads people keys for Comparison
                if ($scope.guests.hasOwnProperty(key)) { //If people has value for keys
                    if($scope.guests[key].id==$scope.Guest.id) // Checks ID
                    {
                        $scope.guestId=$scope.guests[key];

                    }

                }
            }
            console.log($scope.guestId);
            $location.path("/reservations/change/change2");
            console.log($scope.guestId);
            //http({
            //    method:'POST',
            //    url : 'http://localhost:8080/Project-API/api/update',
            //    data:position
            //}).success(function(data){
            //    console.log(data);
            //}).error(function(error){
            //    console.log(error);
            //});

        };

        //to deleteGuest

        $scope.deleteGuest =function(position) {
            console.log(position);
            $scope.guests.splice(position, 1);
            $http({
                method:'POST',
                url:'http://localhost:8080/Project-API/api/guests/delete',
                data:position
            }).success(function(data){
                console.log(data);
            }).error(function(error){
                console.log(error);
            });
        };

        //to update the website profile

        $scope.update = function () {

            $rootScope.rName=$scope.n.rName;
            $scope.rPhone =$scope.n.rPhone;
            $scope.rAddress=$scope.n.rAddress;
            $scope.rUsername =$scope.n.rUsername;
            $scope.rPassword= $scope.n.rPassword;

            $http({
                method: 'POST',
                url: 'http://localhost:8080/Project-API/api/update',
                data: Settings
            }).success(function(data){
                console.log(data);
            }).error(function(error){
                console.log(error);
            })

        };
//to generate tableno for new Guests

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }
        var rString = randomString(1, '0123456789');


    })
})();


