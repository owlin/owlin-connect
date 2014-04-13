var random_string = function(length){
    if(!length) length = 32
    var string = 'abcdefghijklmnopqrstuvwxyz0123456789',
        output = ''
    for(var i=0;i<length;i++){
        output += string[Math.round(Math.random()*26)]
    }
    return output
}
module.exports = random_string
