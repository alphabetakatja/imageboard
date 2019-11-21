var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 12;`);
};

exports.addImage = function(title, description, username, imageUrl) {
    return db.query(
        `INSERT INTO images (title, description, username, url) VALUES ($1, $2, $3, $4)  RETURNING *`,
        [title, description, username, imageUrl]
    );
};

exports.getImageData = function(imageId) {
    return db.query(`SELECT * FROM images WHERE id=$1`, [imageId]);
};

exports.getImageComments = function(imageId) {
    return db.query(
        `
        SELECT * FROM comments
        WHERE img_id =$1`,
        [imageId]
    );
};

exports.addImageComment = function(text, name, imageId) {
    return db.query(
        `INSERT INTO comments (comment, username, img_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [text || null, name || null, imageId]
    );
};

exports.showMoreImages = function(lastId) {
    return db.query(
        `SELECT * FROM images WHERE id < $1 ORDER BY id desc LIMIT 4`,
        [lastId]
    );
};

// SELECT id FROM images ORDER BY id ASC LIMIT 1;
// query in a query
// SELECT images.*, (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" FROM images WHERE id
// < $1 ORDER BY id desc LIMIT 24;
// this.images[this.images.length -1].id

// http://localhost:8080/habanero/imageboard
// hashes are invisible to servers
// the javascript code can read the hash

// id | tag | image_id
// 1 | cute | 13
// 2 | cute | 15
