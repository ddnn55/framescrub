#!/usr/bin/env node

var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
const exec = require('child_process').exec;
var tmp = require('tmp');
const del = require('del');
const mkdirp = require('mkdirp');
 
var inputPath = argv._[0],
    outputPath = argv._[1];


var sequenceName = (() => {
	// assuming input file has an extension...
	// ...but at least get something
	var inputFilenameParts = path.basename(inputPath).split('.');
	return inputFilenameParts.slice(0, Math.max(1, inputFilenameParts.length-1)).join('.');
})();

// tmp.dir(function _tempDirCreated(err, intermediateDir, cleanupCallback) {
//   if (err) throw err;
 
//   console.log("Storing intermediates in " + intermediateDir);

 //  function deleteIntermediates() {
	// del(path.join(intermediateDir, '*.jpg'), {/* allow outside CWD */ force:true}).then(paths => {
	//     // console.log('Deleted files and folders:\n', paths.join('\n'));
	//     cleanupCallback();
	//     console.log('Deleted intermediates');
	// }).catch((err) => {
	// 	console.error('Error deleting intermediates:');
	// 	console.error(err);
	// });
  	
 //  }
var imageOutPath = path.join(outputPath, 'frames');
mkdirp(imageOutPath, function (err) {
    if (err) {
    	console.error('Could not ensure directory ' + imageOutPath);
    	process.exit(1);
    }
    else {
    	console.log('Ensured output directory ' + imageOutPath);
    	console.log('Extracting frames from video...');
	   	exec('ffmpeg -i '+inputPath+' -f image2 '+path.join(imageOutPath,'%09d.jpg'), (error, stdout, stderr) => {
			if (error) {
				console.error(`ffmpeg exec error: ${error}`);
				// deleteIntermediates();
				return;
			}
			else {
				console.log('Wrote frames to ' + imageOutPath);
				console.log('TODO create output JSON');
			}

		});
    }


});


// });
