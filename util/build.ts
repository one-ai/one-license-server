import fs from 'fs-extra';
import childProcess from 'child_process';

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./app/public', './dist/public');
    fs.copySync('./app/views', './dist/views');
    // Transpile the typescript files
    childProcess.exec('tsc --build tsconfig.prod.json');
} catch (err) {
    console.log(err);
}
