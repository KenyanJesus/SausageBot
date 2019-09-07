var Twit = require('twit')

var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));
    //images = require(path.join(__dirname, 'images.js'));

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
        setInterval(function(){upload_random_image(images);}, 1000*60*60*8);
    }
});


function random_from_array(images){
    var dupImages = [0];
    images = [Math.floor(Math.random() * images.length)];

    if (dupImages.length == 10){
        dupImages.length = 0;
        dupImages.push(images);
        return images;
    } else {
        dupImages.push(images);
        images = images.filter(value => -1 !== dupImages.indexOf(value));
        return images;
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