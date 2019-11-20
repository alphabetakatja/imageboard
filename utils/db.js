var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC;`);
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

module.exports.getImageComments = function(imageId) {
    return db.query(
        `
        SELECT * FROM comments
        WHERE img_id =$1`,
        [imageId]
    );
};

module.exports.addImageComment = function(text, name, imageId) {
    return db.query(
        `INSERT INTO comments (comment, username, img_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [text || null, name || null, imageId]
    );
};
