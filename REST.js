var mysql = require("mysql");
var Treeize = require('treeize');

function REST_ROUTER(api_router, connection, md5) {
    var self = this;
    self.handleRoutes(api_router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(api_router, connection, md5) {
    var self = this;
    api_router.get("/", function(req, res) {
        res.json({
            "Message": "Hello World !"
        });
    });

    //SALES ROUTES

    api_router.get("/users", function(req, res) {
        var query = "SELECT * FROM ??";
        var table = ["users"];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Item sales": rows
                });
            }
        });
    });

    api_router.get("/users/:id_user", function(req, res) {
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["users", "id_user", req.params.id_item_sale];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Success",
                    "Item sale": rows
                });
            }
        });
    });

    api_router.post("/users/add", function(req, res) {
        var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
        var table = ["users", "sName", "sPassword", "sEmail", "fNacimiento", "iGroup",
            req.body.sName, req.body.sPassword, req.body.sEmail, req.body.fNacimiento, req.body.iGroup
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {
                res.json({
                    "Error": false,
                    "Message": "Item Sale Added !"
                });
            }
        });
    });

    //POSTS
    api_router.get("/posts", function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');



        var options = {
            sql: 'SELECT DATEDIFF( p.fVencimiento, CURRENT_TIMESTAMP())24 AS iRestante, p.id_post, p.id_user, p.sPost, p.fFecha, p.fVencimiento,c.sComentario, c.id_comentario, c.id_user AS id_userc, u1.sName AS userPost, u2.sName AS userCom FROM posts p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user LEFT JOIN users u2 ON  c.id_user = u2.id_user WHERE CURRENT_TIMESTAMP() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario',
            nestTables: true
        };




        var query = "SELECT hour(TIMEDIFF(p.fVencimiento, CURRENT_TIMESTAMP())) AS iRestante, p.id_post, p.id_user, p.sPost, p.fFecha, p.fVencimiento, (SELECT COUNT(*) FROM likes WHERE i_type = 1 AND id_post = p.id_post) AS like1, (SELECT COUNT(*) FROM likes WHERE i_type = 2 AND id_post = p.id_post) AS like2, (SELECT COUNT(*) FROM likes WHERE i_type = 3 AND  id_post = p.id_post) AS like3, (SELECT COUNT(*) FROM likes WHERE i_type = 4 AND id_post = p.id_post) AS like4, (SELECT COUNT(*)FROM likes WHERE i_type = 5 AND id_post = p.id_post) AS like5, IFNULL(l.i_type,0) AS 'Likes:userType', c.id_comentario AS 'Comentarios:id_comentario', c.sComentario AS 'Comentarios:sComentario', c.id_user AS 'Comentarios:id_user', u1.sName AS userPost, u2.sName AS 'Comentarios:userCom' FROM posts p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user LEFT JOIN users u2 ON c.id_user = u2.id_user LEFT JOIN likes l ON p.id_post = l.id_post AND l.id_user = 1 WHERE NOW() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario";


        //var table = ["posts"];
        //query = mysql.format(query,table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {

                var tPosts = new Treeize();
                tPosts.grow(rows);
                res.json({
                    "Posts": tPosts.data.tree
                });
            }
        });
    });



    api_router.get("/posts/:id_post", function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["posts", "id_post", req.params.id_post];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query"
                });
            } else {
                res.json({
                    "Posts": rows
                });
            }
        });
    });

    api_router.post("/posts/add", function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? HOUR))";
        var table = ["posts", "id_user", "sPost", "fVencimiento",
            req.body.id_user, req.body.sPost, req.body.fVencimiento
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {


                res.json({
                    "Posts": rows
                });

            }
        });
    });

    api_router.post("/comentarios/add", function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
        var table = ["comentarios", "id_post", "id_user", "sComentario",
            req.body.id_post, req.body.id_user, req.body.sComentario
        ];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {


                res.json({
                    "Comentarios": rows
                });

            }
        });
    });
/*
CREATE PROCEDURE addLike(user_id INT, post_id INT, type_i INT) BEGIN DELETE FROM likes WHERE id_user = user_id; INSERT INTO likes (id_post,i_type,id_user) VALUES (post_id,type_i,user_id); END
 */
    api_router.post("/likes/add", function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        var query = "CALL addLike(?,?,?)";
        var table = [req.body.id_user, req.body.id_post, req.body.i_type];
        query = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                res.json({
                    "Error": true,
                    "Message": "Error executing MySQL query" + err
                });
            } else {


                res.json({
                    "Posts": rows
                });

            }
        });
    });

}

module.exports.REST_ROUTER = REST_ROUTER;


/* COMMENTS
SELECT p.id_post, p.id_user, p.sPost, p.fFecha, p.fVencimiento, c.id_comentario, c.id_user AS id_userc, u1.sName AS userPost, u2.sName AS userCom
FROM posts p LEFT JOIN comentarios c ON p.id_post = c.id_post
AND posts p INNER JOIN users u1 ON p.id_user = u1.id_userusers 
AND comentarios c INNER JOIN users u2 ON  c.id_user = u2.id_user
AND NOW() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario
*/
//var query = "SELECT * FROM ?? WHERE CURRENT_TIMESTAMP BETWEEN fFecha AND fVencimiento ORDER BY id_post DESC";
//var query = "SELECT p.id_post, p.id_user, p.sPost, p.fFecha, p.fVencimiento,c.sComentario, c.id_comentario, c.id_user AS id_userc, u1.sName AS userPost, u2.sName AS userCom FROM posts p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user INNER JOIN users u2 ON  c.id_user = u2.id_user AND NOW() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario";
//var queryC = "SELECT * FROM comentarios WHERE id_post in (SELECT id_post FROM posts WHERE CURRENT_TIMESTAMP BETWEEN fFecha AND fVencimiento)"
//IF(EXISTS(SELECT * FROM likes WHERE id_post = p.id_post AND id_user = 1),  
/*
SELECT DATEDIFF( p.fVencimiento, CURRENT_TIMESTAMP())*24 AS iRestante, p.id_post, p.id_user, p.sPost, p.fFecha, 
p.fVencimiento,(SELECT COUNT(*) FROM likes WHERE i_type = 1 AND id_post = p.id_post) AS like1,
(SELECT COUNT(*) FROM likes WHERE i_type = 2 AND id_post = p.id_post) AS like2, 
(SELECT COUNT(*) FROM likes WHERE i_type = 3 AND id_post = p.id_post) AS like3, 
(SELECT COUNT(*) FROM likes WHERE i_type = 4 AND id_post = p.id_post) AS like4, 
(SELECT COUNT(*) FROM likes WHERE i_type = 5 AND id_post = p.id_post) AS like5, 
(SELECT IFNULL(i_type, 0) FROM likes WHERE id_post = p.id_post AND id_user = 1) AS userLike,
c.sComentario AS 'Comentarios:sComentario', c.id_comentario AS 'Comentarios:id_comentario', c.id_user AS 'Comentarios:id_user', u1.sName AS userPost, u2.sName AS 'Comentarios:userCom' FROM posts p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user LEFT JOIN users u2 ON  c.id_user = u2.id_user WHERE NOW() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario
*/

/*var query="SELECT DATEDIFF( p.fVencimiento, CURRENT_TIMESTAMP())*24 AS iRestante, p.id_post, p.id_user, p.sPost, p.fFecha, "+
        "p.fVencimiento,c.sComentario AS 'Comentarios:sComentario', c.id_comentario AS 'Comentarios:id_comentario', c.id_user AS 'Comentarios:id_user', u1.sName AS userPost, u2.sName AS 'Comentarios:userCom' FROM posts "+
        "p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user LEFT JOIN users u2 ON  c.id_user = u2.id_user "+
        "WHERE CURRENT_TIMESTAMP() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario";*/
// (SELECT i_type FROM likes WHERE id_post = p.id_post AND id_user = 1) AS userLike,
/*
SELECT IF( EXISTS(SELECT i_type FROM likes WHERE id_post = 30 AND id_user = 1),,0) AS userLike
*/
//SELECT IFNULL(l.i_type,0) as userLike FROM posts p LEFT JOIN likes l ON p.id_post = l.id_post WHERE p.id_post = 25 AND l.id_user = 1
/*var query="SELECT hour(TIMEDIFF(p.fVencimiento, CURRENT_TIMESTAMP())) AS iRestante, p.id_post, p.id_user, p.sPost,
         p.fFecha, p.fVencimiento,(SELECT COUNT(*) FROM likes WHERE i_type = 1 AND id_post = p.id_post) AS like1, (SELECT COUNT(*)
         FROM likes WHERE i_type = 2 AND id_post = p.id_post) AS like2, (SELECT COUNT(*) FROM likes WHERE i_type = 3 AND 
         id_post = p.id_post) AS like3, (SELECT COUNT(*) FROM likes WHERE i_type = 4 AND id_post = p.id_post) AS like4, (SELECT COUNT(*)
         FROM likes WHERE i_type = 5 AND id_post = p.id_post) AS like5, c.id_comentario AS 'Comentarios:id_comentario', c.sComentario AS
          'Comentarios:sComentario', c.id_user AS 'Comentarios:id_user', u1.sName AS userPost, u2.sName AS 'Comentarios:userCom' FROM posts 
          p LEFT JOIN comentarios c ON p.id_post = c.id_post INNER JOIN users u1 ON p.id_user = u1.id_user LEFT JOIN users u2 ON 
           c.id_user = u2.id_user WHERE NOW() BETWEEN p.fFecha AND p.fVencimiento ORDER BY p.id_post DESC, c.id_comentario";
        */
//PASSWORD SECURITY USE md5(req.body.password)
/*
    api_router.put("/sales/items/update",function(req,res){
        var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var table = ["items_sales","id_sale", req.body.id_sale, "id_item", req.body.id_item, "i_quantity", 
        req.body.i_quantity, "s_quantity_type", req.body.s_quantity_type,"d_price",req.body.d_price, "d_tax", req.body.d_tax, "d_total", 
        req.body.d_total, "f_date", req.body.f_date, "id_item_sale", req.body.id_item_sale];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated data for id: "+req.body.id_item_sale});
            }
        });
    });

    api_router.delete("/sales/items/delete/:id_item_sale",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["items_sales","id_item_sale",req.params.id_item_sale];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the row with id item sale: "+req.params.id_item_sale});
            }
        });
    });
*/
// *#FCK#jd^@GITHUB-8b914441