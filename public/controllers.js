angular.module('proyecto', ['ngResource', 'emguo.poller'])
    .controller('controller', ['$scope', '$resource', 'poller', '$http', function($scope, $resource, poller, $http) {
        $scope.posts = [];
        $scope.textPost = {};
        $scope.textComentario = {};
        

        $scope.array = [];
        $scope.limiteComentarios = [];
        $scope.user = [];
        var addPost = $resource("/api/posts/:id", {
            id: ''
        });
        var myPoller = poller.get(addPost);
        myPoller.promise.then(null, null, function(data) {
            console.log(data.Posts);
            $scope.posts = data.Posts;
        });

        var req = {
                method: 'GET',
                url: '/api/users/id'
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

        $scope.deleteComment = function(post,comment,idcomment){
            console.log("WHATUP");
            var req = {
                method: 'POST',
                url: '/api/comentarios/delete',
                data: {
                    id_comentario: idcomment
                }
            }

            $http(req).then(function successCallback(response) {
               console.log("COMENTARIO ELIMINADO");
               console.log(response);
               console.log(idcomment)
               $scope.posts[post].Comentarios.splice(comment,1);                 
            }, function errorCallback(response) {
                console.log("Error en eliminar COMENTARIO");
            });

        }

        $scope.deletePost = function(post, idpost){
            var req = {
                method: 'PUT',
                url: '/api/posts/delete',
                data: {
                    id_post: idpost
                }
            }

            $http(req).then(function successCallback(response) {
               console.log("POST ELIMINADO");
               $scope.posts.splice(post,1)                 
            }, function errorCallback(response) {
                console.log("Error en eliminar POST");
            });

        }    

        $scope.addLike = function(type, post, idpost) {
            var like = "like" + type;


            var req = {
                method: 'POST',
                url: '/api/likes/add',

                data: {
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
                url: '/api/comentarios/add',

                data: {
                    id_post: id,
                    sComentario: comentariodb
                }
            }

            $http(req).then(function successCallback(response) {
                console.log(response);

                $scope.textComentario.sComentario = $scope.array[id];
                $scope.textComentario.userCom = $scope.user.sName;
                if (typeof $scope.posts[post].Comentarios == "undefined") {

                    $scope.posts[post].Comentarios = [];
                    $scope.textComentario.sComentario = $scope.array[id];
                    $scope.textComentario.userCom = $scope.user.sName;
                    $scope.posts[post].Comentarios.push($scope.textComentario);
                    console.log("ARRAY COMMENTS NEWS")
                    console.log($scope.posts[post].Comentarios);
                    console.log($scope.posts);
                    console.log("ARRAY COMMENTS NEWS");
                } else {
                    $scope.posts[post].Comentarios.push($scope.textComentario);
                }

                $scope.textPost = {
                    autor: $scope.user.sName
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
                url: '/api/posts/add',

                data: {
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
                    userPost: $scope.user.sName
                };
            }, function errorCallback(response) {
                console.log("Error en post");
            });

        }
    }]);