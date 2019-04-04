exports.execPromise = function(cmd){
    return new Promise((resolve, reject)=>{
        const child_process = require('child_process');

        console.log(`[INFO] Child process: ${cmd}`)
        const [first, ...others] = cmd.split(' ')

        const p = child_process.spawn(first, [...others], {stdio: 'inherit'});
        p.on('close', function(code) {
            process.stdout.write(`\n[INFO] Child helpers, on close, code: ${code}\n`);

            if(code ===1) {
                return reject()
            }
            return resolve()
        });
    })
  };
  
  