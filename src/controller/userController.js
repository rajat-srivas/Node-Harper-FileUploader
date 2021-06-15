const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../dbConfig');
const hyperive = require('harperive');
const sharp = require('sharp');
const SCHEMA = process.env.DB_Schema;
const SCHEMA_TABLE = 'UserUploads';
var bytes = require('bytes');

const uploadStorage = multer.memoryStorage();
const uploadFilter = (req, file, handler) => {
    if (file.mimetype.startsWith('image')) {
        handler(null, true)
    } else {
        handler("Not an image! Only Image Upload Allowed", false)
    }
}

const multerUploadConfig = multer({
    storage: uploadStorage,
    fileFilter: uploadFilter
})

exports.multerUploadMiddleWare = multerUploadConfig.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {

    req.file.filenameRound = `${uuidv4()}-round.jpeg`;
    req.file.filenameSquare = `${uuidv4()}-sqauare.jpeg`;

    if (!req.file) return next();

    await sharp(req.file.buffer)
        .resize(350, 350, {
            fit: 'cover'
        })
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/users/${req.file.filenameRound}`);

    await sharp(req.file.buffer)
        .resize(200, 200, {
            fit: 'contain'
        })
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`public/img/users/${req.file.filenameSquare}`);

    next();
}

exports.upload = async (req, res) => {
    if (req.file) {
        req.body.actualFileName = req.file.originalname;
    }
    try {
        const userUpload = await dbClient.insert({
            table: SCHEMA_TABLE,
            records: [{
                username: req.body.name,
                email: req.body.email,
                actualFileName: req.body.actualFileName,
                actualFizeSize: `${bytes(req.file.size)}`,
                processedFiles: [
                    {
                        internalFileName: req.file.filenameRound,
                        dimension: '350*350',
                    },
                    {
                        internalFileName: req.file.filenameSquare,
                        dimension: '200*200',
                    }
                ]

            }]
        });
        res.status(201).send(userUpload.data.inserted_hashes);
    }
    catch (e) {
        console.error(e);
        res.status(400).send();
    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const userById = await GetUserDetailsById(id);
        if (!userById) res.status(400).send();
        res.status(200).send(userById.data);
    }
    catch (e) {
        console.error(e);
        res.status(500).send();
    }
}

GetUserDetailsById = async (id) => {
    try {
        const getByIdQuery = `Select * from ${SCHEMA}.${SCHEMA_TABLE} where id="${id}"`;
        const userById = await dbClient.query(getByIdQuery);
        return userById;
    }
    catch (e) {
        console.error(e);
    }
}