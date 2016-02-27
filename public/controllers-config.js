angular.module('proyecto', ['ngResource', 'emguo.poller'])
    .controller('controller', ['$scope', '$resource', 'poller', '$http', '$location',
        function($scope, $resource, poller, $http, $location) {
            $scope.user = [];
            var req = {
                method: 'GET',
                url: 'http://localhost:3000/api/users/id'
            }
            $http(req).then(function successCallback(response) {
                try {
                    if (response.data.User != 'undefined') {
                        $scope.user = response.data.User[0];
                        console.log($scope.user);
                        $scope.textPost.userPost = $scope.user.sName;
                    }
                } catch (err) {}
            }, function errorCallback(response) {
                console.log("Error en solicitud de USUARIO");
            });
            $scope.changeInfo = function() {
                if (typeof $scope.user.newNacimiento !== (null || undefined || 'undefined')) {
                    $scope.user.fNacimiento = $scope.user.newNacimiento;
                }
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:3000/api/users/edit/info',
                    data: {
                        sName: $scope.user.sName,
                        sDesc: $scope.user.sDesc,
                        iSexo: $scope.user.iSexo,
                        fNacimiento: $scope.user.fNacimiento
                    }
                }
                $http(req).then(function successCallback(response) {
                    try {
                        console.log(response);
                        $location.path('/');

                    } catch (err) {}
                }, function errorCallback(response) {
                    console.log("Error en solicitud de USUARIO");
                });
            }
            $scope.changeEmail = function() {
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:3000/api/users/edit/email',
                    data: {
                        oldEmail: $scope.user.oldEmail,
                        newEmail: $scope.user.newEmail
                    }
                }
                $http(req).then(function successCallback(response) {
                    try {
                        console.log(response);
                        if (response.data.User != 'undefined') {
                            $scope.user = response.data.User[0];
                            console.log($scope.user);
                            $scope.textPost.userPost = $scope.user.sName;
                        }
                    } catch (err) {}
                }, function errorCallback(response) {
                    console.log("Error en solicitud de USUARIO");
                });
            }
            $scope.changePassword = function() {
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:3000/api/users/edit/password',
                    data: {
                        oldPassword: $scope.user.oldPassword,
                        newPassword: $scope.user.newPassword
                    }
                }
                $http(req).then(function successCallback(response) {
                    try {
                        console.log(response);
                        if (response.data.User != 'undefined') {
                            $scope.user = response.data.User[0];
                            console.log($scope.user);
                            $scope.textPost.userPost = $scope.user.sName;
                        }
                    } catch (err) {}
                }, function errorCallback(response) {
                    console.log("Error en solicitud de USUARIO");
                });
            }
            $scope.deleteAllPosts = function() {
                var req = {
                    method: 'DELETE',
                    url: 'http://localhost:3000/api/posts/delete/all'
                }
                $http(req).then(function successCallback(response) {
                    try {
                        
                    } catch (err) {}
                }, function errorCallback(response) {
                    console.log("Error en solicitud de USUARIO");
                });
            }
        }
    ]);
