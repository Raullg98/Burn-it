angular.module('proyecto', ['ngResource', 'emguo.poller'])
    .controller('controller', function($scope, $resource, poller, $http) {
        $scope.posts = [];
        $scope.textPost = {};
        $scope.textComentario = {};
        $scope.textPost.userPost = "Raul Lara";

        $scope.array = [];
        $scope.limiteComentarios = [];
        var addPost = $resource("http://localhost:3000/api/posts/:id", {
            id: ''
        });
        var myPoller = poller.get(addPost);
        myPoller.promise.then(null, null, function(data) {
            console.log(data.Posts);
            $scope.posts = data.Posts;
        });



        $scope.addLike = function(type, post, idpost) {
            var like = "like" + type;


            var req = {
                method: 'POST',
                url: 'http://localhost:3000/api/likes/add',

                data: {
                    id_user: 1,
                    id_post: idpost,
                    i_type: type
                }
            }

            $http(req).then(function successCallback(response) {
                console.log(response);
                
            }, function errorCallback(response) {
                console.log("Error en Like");
            });

            if (typeof $scope.posts[post].Likes[0] == "undefined") {
                $scope.posts[post].Likes = [];

                $scope.posts[post].Likes[0].userType = type;
                switch (type) {
                    case 1:
                        $scope.posts[post].like1 = 1;
                        break;
                    case 2:
                        $scope.posts[post].like2 = 1;
                        break;
                    case 3:
                        $scope.posts[post].like3 = 1;
                        break;
                    case 4:
                        $scope.posts[post].like4 = 1;
                        break;
                    case 5:
                        $scope.posts[post].like5 = 1;
                        break;
                }




                console.log($scope.posts[post].Likes[0])
            } else {
                if (type == $scope.posts[post].Likes[0].userType) {
                    $scope.posts[post].Likes[0].userType = 0;
                    $scope.posts[post].like--;
                    console.log($scope.posts[post].Likes[0]);
                    switch (type) {
                        case 1:
                            $scope.posts[post].like1--;
                            break;
                        case 2:
                            $scope.posts[post].like2--;
                            break;
                        case 3:
                            $scope.posts[post].like3--;
                            break;
                        case 4:
                            $scope.posts[post].like4--;
                            break;
                        case 5:
                            $scope.posts[post].like5--;
                            break;
                    }
                } else {
                    switch ($scope.posts[post].Likes[0].userType) {
                        case 1:
                            $scope.posts[post].like1--;
                            break;
                        case 2:
                            $scope.posts[post].like2--;
                            break;
                        case 3:
                            $scope.posts[post].like3--;
                            break;
                        case 4:
                            $scope.posts[post].like4--;
                            break;
                        case 5:
                            $scope.posts[post].like5--;
                            break;

                    }
                    $scope.posts[post].Likes[0].userType = type;

                    console.log($scope.posts[post].like);
                    console.log($scope.posts[post].Likes[0]);
                    switch (type) {
                        case 1:
                            $scope.posts[post].like1++;
                            break;
                        case 2:
                            $scope.posts[post].like2++;
                            break;
                        case 3:
                            $scope.posts[post].like3++;
                            break;
                        case 4:
                            $scope.posts[post].like4++;
                            break;
                        case 5:
                            $scope.posts[post].like5++;
                            break;
                    }

                }
            }
        }

        $scope.addComment = function(id, post) {
            var comentariodb = $scope.array[id];
            var req = {
                method: 'POST',
                url: 'http://localhost:3000/api/comentarios/add',

                data: {
                    id_post: id,
                    id_user: 1,
                    sComentario: comentariodb
                }
            }

            $http(req).then(function successCallback(response) {
                console.log(response);

                $scope.textComentario.sComentario = $scope.array[id];
                $scope.textComentario.userCom = 'Raul Lara';
                if (typeof $scope.posts[post].Comentarios == "undefined") {

                    $scope.posts[post].Comentarios = [];
                    $scope.textComentario.sComentario = $scope.array[id];
                    $scope.textComentario.userCom = 'Raul Lara';
                    $scope.posts[post].Comentarios.push($scope.textComentario);
                    console.log("ARRAY COMMENTS NEWS")
                    console.log($scope.posts[post].Comentarios);
                    console.log($scope.posts);
                    console.log("ARRAY COMMENTS NEWS");
                } else {
                    $scope.posts[post].Comentarios.push($scope.textComentario);
                }

                $scope.textPost = {
                    autor: "Raul Lara"
                };
                $scope.array[id] = "";

            }, function errorCallback(response) {
                console.log(response);
            });

        }


        $scope.addPost = function() {
            /*$scope.posts.push($scope.textPost);
		$scope.textPost= {
			autor:"Raul Lara"
		};*/


            var req = {
                method: 'POST',
                url: 'http://localhost:3000/api/posts/add',

                data: {
                    id_user: 1,
                    sPost: $scope.textPost.sPost,
                    fVencimiento: $scope.hours
                }
            }

            $http(req).then(function successCallback(response) {
                console.log(response);
                $scope.textPost.iRestante = 24;
                console.log($scope.textPost)
                $scope.posts.unshift($scope.textPost);
                $scope.textPost = {
                    userPost: "Raul Lara"
                };
            }, function errorCallback(response) {
                console.log("Error en post");
            });

        }
    });