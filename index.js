const express = require("express");
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const app = express();
const s3 = require("./s3");
const { s3Url } = require("./config");

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
    db.getImages().then(results => {
        console.log(results.rows);
        // let url = results.rows[0].url;
        // let title = results.rows[0].title;
        let images = results.rows;
        res.json(images);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("this is the upload route!");
    console.log("input...", req.body);
    console.log("req.file ", req.file); // the middleware gives us access to this req.file
    const { title, description, username } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;
    db.addImage(title, description, username, imageUrl)
        .then(results => {
            if (req.file) {
                console.log(results.rows);

                res.json({
                    // rows[0]
                    success: true,
                    image: results.rows[0]
                    // then unshift the object into the array
                });
            }
        })
        .catch(err => console.log("error in addImage: ", err));
});

// app.post("/insert-comment", (req, res) => {
//     console.log("/insert-comment post route input: ", req.body);
// });

app.get("/image-data/:id", (req, res) => {
    console.log("get request of show-modal", req.params);
    db.getImageData(req.params.id).then(results => {
        res.json(results.rows);
    });
});

app.listen(8080, () => console.log("Imageboard up and running!"));
