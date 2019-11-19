const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.awsKey,
    secretAccessKey: secrets.awsSecret
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log("no req.file");
        res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "brutalistimageboard",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            next();
            // to delete
            fs.unlink(path, () => {});
        })
        .catch(err => {
            // uh oh it didn't work
            console.log("error in upload function: ", err);
            res.sendStatus(500);
        });
};
