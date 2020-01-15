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
        `SELECT * FROM images WHERE id < $1 ORDER BY id desc LIMIT 8`,
        [lastId]
    );
};

// exports.insertTag = function(tag, image_id) {
//     return db.query(
//         `INSERT INTO tags(tag, image_id) VALUES ($1, $2) RETURNING tag, image_id`,
//         [tag, image_id || null]
//     );
// };
//
// exports.filterByTag = function(tag) {
//     return db.query(
//         `SELECT images.id AS id, images.url, images.title, images.description, images.username, tags.tag FROM images LEFT JOIN tags ON images.is = tags.image_id WHERE TAG = $1 ORDER BY id DESC`,
//         [tag]
//     );
// };
