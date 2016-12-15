#!/usr/bin/env node

var argv = require('yargs').argv;
var path = require('path');
const exec = require('child_process').exec;
var tmp = require('tmp');
const del = require('del');
 

tmp.dir(function _tempDirCreated(err, intermediateDir, cleanupCallback) {
  if (err) throw err;
 
  console.log("Dir: ", intermediateDir);

  function deleteIntermediates() {
	del(path.join(intermediateDir, '*.jpg')).then(paths => {
	    console.log('Deleted files and folders:\n', paths.join('\n'));
	    cleanupCallback();
	});
  	
  }
  
  exec('ffmpeg -i '+argv._[0]+' -f image2 '+path.join(intermediateDir,'frame%09d.jpg'), (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      deleteIntermediates();
      return;
    }
    else {
	    console.log(`stdout: ${stdout}`);
	    console.log(`stderr: ${stderr}`);
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
					console.log(stdout);
	    		}
	    		deleteIntermediates();
	    	}
	    );
    }

  });

});
