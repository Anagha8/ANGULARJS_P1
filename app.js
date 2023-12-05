var app = angular.module('userApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'UserController'
        })
        .when('/team-details', {
            templateUrl: 'team-details.html',
            controller: 'TeamDetailsController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('UserController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    var jsonFileUrl = 'https://raw.githubusercontent.com/Anagha8/ANGULARJS_P1/main/heliverse_mock_data.json';

    $http.get(jsonFileUrl).then(function (response) {
        $scope.users = response.data;
        $scope.filteredUsers = response.data;
        $scope.uniqueDomains = [...new Set(response.data.map(user => user.domain))];
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.totalPages = Math.ceil($scope.filteredUsers.length / $scope.itemsPerPage);
        $scope.team = [];
    });

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
        }
    };

    $scope.addToTeam = function (user) {
        if (user.available === ($scope.selectedavailable === 'true')) {
            var domainExists = $scope.team.some(function (teamMember) {
                return teamMember.domain === user.domain;
            });

            if (!domainExists) {
                $scope.team.push(user);
                alert('User added to the team successfully!');
            } else {
                alert('User belongs to an existing domain in the team. Choose another user.');
            }
        } else {
            alert('User is not available. Choose an available user.');
        }
    };

    $scope.showTeamDetails = function () {
        console.log($scope.team);
    };

    $scope.$watchGroup(['searchName', 'selectedDomain', 'selectedGender', 'selectedavailable'], function (newValues, oldValues) {
        $scope.currentPage = 1;
        $scope.filteredUsers = $scope.users ? $scope.users.filter(function (user) {
            return (!newValues[0] || user.first_name.toLowerCase().includes(newValues[0].toLowerCase()) ||
                user.last_name.toLowerCase().includes(newValues[0].toLowerCase())) &&
                (!newValues[1] || user.domain === newValues[1]) &&
                (!newValues[2] || user.gender === newValues[2]) &&
                ($scope.selectedavailable === undefined || user.available === ($scope.selectedavailable === 'true'));
        }) : [];

        $scope.totalPages = Math.ceil($scope.filteredUsers.length / $scope.itemsPerPage);
    });

    $scope.goToTeamDetails = function () {
        $location.path('team-details');
    };
}]);

app.controller('TeamDetailsController', ['$scope', function ($scope) {
    // Controller for the team details page
    // The $scope.team variable should be accessible here as well
}]);
