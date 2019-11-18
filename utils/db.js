var spicedPg = require("spiced-pg");
var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = function() {
    return db.query(`SELECT url, title FROM images`);
};
