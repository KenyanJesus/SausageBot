var Twit = require('twit')
var dupArray = [];
var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);
fs.readdir(__dirname + '/images', function(err, files) {
    if (err){
        console.log(err);
    }
    else{
        var images = [];
        files.forEach(function(f) {
            images.push(f);
        });
        setInterval(function(){upload_random_image(images);}, 43200000);
    }
});


function random_from_array(images){
    var random = Math.floor(Math.random() * images.length);
    if (dupArray.length >= 25 && dupArray.includes(random)){
        dupArray.length = [];
        return images[random];
    }
    else if(dupArray.includes(random)){
        random_from_array();
    }
    else {
        dupArray.push(random);
        return images[random];
    }
}

function upload_random_image(images){
    console.log('Opening an image...');
    var image_path = path.join(__dirname, '/images/' + random_from_array(images)),
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });

    console.log('Uploading an image...');

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        if (err){
            console.log('ERROR:');
            console.log(err);
        }
        else{
            console.log('Image uploaded!');
            console.log('Now tweeting it...');

            T.post('statuses/update', {
                    media_ids: new Array(data.media_id_string)
                },
                function(err, data, response) {
                    if (err){
                        console.log('ERROR:');
                        console.log(err);
                    }
                    else{
                        console.log('Posted an image!');
                    }
                }
            );
        }
    });
}