#!/usr/bin/env node

var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
const exec = require('child_process').exec;
var tmp = require('tmp');
const del = require('del');
 
var inputPath = argv._[0];


var sequenceName = (() => {
	// assuming input file has an extension...
	// ...but at least get something
	var inputFilenameParts = path.basename(inputPath).split('.');
	return inputFilenameParts.slice(0, Math.max(1, inputFilenameParts.length-1)).join('.');
})();

tmp.dir(function _tempDirCreated(err, intermediateDir, cleanupCallback) {
  if (err) throw err;
 
  console.log("Storing intermediates in " + intermediateDir);

  function deleteIntermediates() {
	del(path.join(intermediateDir, '*.jpg'), {/* allow outside CWD */ force:true}).then(paths => {
	    // console.log('Deleted files and folders:\n', paths.join('\n'));
	    cleanupCallback();
	    console.log('Deleted intermediates');
	}).catch((err) => {
		console.error('Error deleting intermediates:');
		console.error(err);
	});
  	
  }
  
  exec('ffmpeg -i '+inputPath+' -f image2 '+path.join(intermediateDir,'frame%09d.jpg'), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      deleteIntermediates();
      return;
    }
    else {
	    // console.log(`stdout: ${stdout}`);
	    // console.log(`stderr: ${stderr}`);
	    exec(
	    	path.join(__dirname, '../node_modules/.bin/img2data') + ' *.jpg',
	    	{
	    		cwd: intermediateDir,
	    		maxBuffer: 200*1024*100
	    	},
	    	(error, stdout, stderr) => {
	    		if(error) {
	    			console.error(`img2data exec error: ${error}`);
	    			console.log(`img2data stderr: ${stderr}`);
	    			return;
	    		}
	    		else {
	    			var outputCssPath = sequenceName + '.css';
					fs.writeFile(outputCssPath, stdout, {encoding:'utf8'}, function(err) {
						if(err) {
							console.error(`error writing CSS: ${error}`);
						}
						else {
							console.log('Created ' + outputCssPath);
						}
						deleteIntermediates();
					});
	    		}
	    		
	    	}
	    );
    }

  });

});
