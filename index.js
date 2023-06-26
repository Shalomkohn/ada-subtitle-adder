const express = require('express');
const app = express();
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

// Upload video and .srt file

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

let inputVideoName = null;


// process video

app.post('/upload', upload.fields([{name: 'inputVideo', maxCount: 1}, {name: 'inputSubtitles', maxCount: 1}]),(req, res) => {

    inputVideoName = req.files['inputVideo'][0].filename;
    const inputSubtitlesName = req.files['inputSubtitles'][0].filename;

    const inputFilePath = `./public/uploads/${inputVideoName}`;
    const subtitlePath = `./public/uploads/${inputSubtitlesName}`;
    const outputFilePath = `./public/to-download/${inputVideoName}`;

    ffmpeg(inputFilePath)
    .videoFilters(`subtitles=${subtitlePath}`)
    .output(outputFilePath)
    .on('error', (err) => {
        console.log(`Error: ${err.message}`);
        res.send('There was an error')
    })
    .on('end', () => {
        res.render('download')
    })
    .run();
})


// Download video

app.get('/download-video', (req, res) => {
    res.sendFile(`${__dirname}/public/to-download/${inputVideoName}`, { headers: { 'Content-Disposition': `attachment; filename=subtitle-generator-${inputVideoName}` }}
    )
})


// app.listen(3000, () => {
//     console.log('Server listening on port 3000');
// });
app.listen(process.env.PORT || 3000, () => {
    console.log('App listening on port ' + (process.env.PORT || 3000));
});
