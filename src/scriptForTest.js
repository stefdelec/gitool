const shortCut = require('./gitShortCut');
const commands=[
    'git clone https://github.com/stefdelec/gitool.git',
    'cd ./gitool',
    'echo $PWD',
    //'git reset --hard c173ce70d388843c5e007a6284e891c92ff29c01',
   // 'rm -r gitool'
]
commands.forEach(command=>{
    console.log(command)
    shortCut.ex(command)
})
