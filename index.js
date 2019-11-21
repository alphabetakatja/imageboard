const express = require("express");
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config");
const moment = require("moment");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

// middleware we will use in our route
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));
app.use(express.json());

// *************** ROUTES *********************
app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            // console.log(results.rows);
            // let url = results.rows[0].url;
            // let title = results.rows[0].title;
            let images = results.rows;
            res.json(images);
        })
        .catch(err => console.log("Error in GET /images: ", err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("this is the upload route!");
    // console.log("input...", req.body);
    // console.log("req.file ", req.file); // the middleware gives us access to this req.file
    const { title, description, username } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;
    db.addImage(title, description, username, imageUrl)
        .then(results => {
            if (req.file) {
                console.log(results.rows);
                res.json({
                    success: true,
                    image: results.rows[0]
                });
            }
        })
        .catch(err => console.log("error in addImage: ", err));
});

app.get("/image-data/:id", (req, res) => {
    console.log("get request of show-modal", req.params);
    db.getImageData(req.params.id)
        .then(results => {
            console.log("results in image data moment.js: ", results.rows);
            results.rows[0].created_at = moment(
                results.rows[0].created_at
            ).format("LLLL");
            res.json(results.rows);
        })
        .catch(err => console.log("Error in GET /image-data/:id ", err));
});

app.get("/image-data/:id/comments", (req, res) => {
    db.getImageComments(req.params.id).then(results => {
        console.log("getImageComments results: ", results.rows);
        results.rows[0].created_at = moment(results.rows[0].created_at).format(
            "LLLL"
        );
        res.json(results.rows);
    });
});

app.post("/comment/:id/add", (req, res) => {
    console.log("req.params in post comments: ", req.params);
    console.log("/insert-comment post route input: ", req.body);
    let imageId = req.params.id;
    let name = req.body.name;
    let text = req.body.text;
    db.addImageComment(text, name, imageId)
        .then(results => {
            console.log("results in addImageComment: ", results.rows);
            results.rows[0].created_at = moment(
                results.rows[0].created_at
            ).format("LLLL");
            res.json(results.rows);
        })
        .catch(err => console.log("error in add-comment post req: ", err));
});

app.get("/more/:lastId", (req, res) => {
    console.log("req.body in /more: ", req.params);
    let lastId = req.params.lastId;
    db.showMoreImages(lastId).then(results => {
        console.log("results in show more images: ", results.rows);
        res.json(results.rows);
    });
});

app.listen(8080, () => console.log("Imageboard up and running!"));
