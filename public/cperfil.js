angular.module('proyecto', ['ngResource', 'emguo.poller'])
    .controller('controller', ['$scope', '$resource', 'poller', '$http', function($scope, $resource, poller, $http) {
        $scope.posts = [];
        $scope.textPost = {};
        $scope.textComentario = {};
        

        $scope.array = [];
        $scope.limiteComentarios = [];
        $scope.user = [];
        var addPost = $resource("http://localhost:3000/api/posts/id");
        var myPoller = poller.get(addPost);
        myPoller.promise.then(null, null, function(data) {
            console.log(data.Posts);
            $scope.posts = data.Posts;
        });

        var req = {
                method: 'GET',
                url: 'http://localhost:3000/api/users/id'
            }

            $http(req).then(function successCallback(response) {
                if(response.data.User != 'undefined'){
                $scope.user = response.data.User[0];
                console.log($scope.user);
                $scope.textPost.userPost = $scope.user.sName;
                }
                
            }, function errorCallback(response) {
                console.log("Error en solicitud de USUARIO");
            });

      

    }]);