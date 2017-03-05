/**
 * Created by fujunchun on 2017/3/3.
 */
let fs = require("fs");
let path = require("path");
let glob = require("glob");
let S = require("simplebig");

let src = "src";//源目录
let dist = "dist";//生成的目录, 只支持一级目录

if (fs.existsSync(dist)) {
    deleteFolder(dist);
}

fs.mkdirSync(dist);
console.log("=== create dist directory successfully ===", new Date());

//匹配所有文件
glob(path.join(src, "**"), {"nodir": true}, (err, files) => {
    if (err) {
        return console.error(err);
    }

    if(files.length > 0){
        //创建目录
        createDistDir(files);

        files.forEach((file) => {
            fs.readFile(file, (err, data) => {
                if(err){
                    return console.log(err);
                }

                let target = file.replace(src, dist);
                let fanti = S.s2t(data.toString());

                fs.writeFile(target, fanti, (err) => {
                    if(err){
                        return console.error(`写入${target}失败`, err);
                    }

                });
            });
        });

        console.log("=== translate successfully ===", new Date());
    }
});


//根据file路径去掉扩展名，生成目录结构
function createDistDir(files) {
    files.forEach((value) => {
        let arr = value.split("/");

        arr.shift();
        arr.pop();

        let curDir = dist;
        arr.forEach((value) => {
            curDir = path.join(curDir, value);

            if(!fs.existsSync(curDir)){
                fs.mkdirSync(curDir);
            }
        })
    });
}

//删除文件夹
function deleteFolder(directory) {
    let files = [];
    if (fs.existsSync(directory)) {
        files = fs.readdirSync(directory);
        files.forEach(function (file, index) {
            var curPath = path.join(directory, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directory);
    }
}






