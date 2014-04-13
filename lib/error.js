const printf = require('util').format

const error = {

    is : function(data,code){
        if(code) return this.is(data) && data[1].code == code
        return data instanceof Array && data[0] == "error" 
    },

    get : function(error_code, message){
        var error_info = error_codes[error_code.toString()]
        if(message) error_info = printf(error_info, message)
        return ['error', {
            message : error_info,
            code    : error_code
        }]
    },

    required : function(input, fields){
        if(typeof input == "undefined") return false
        for(var i in fields){
            if(!(fields[i] in input) || typeof input[fields[i]] == "undefined")
                return this.get(20, fields[i])
        }
        return false
    },


    callback : function(data, callback){
        this.is(data)
        // Is error
        ? callback(data)
        // Is no error
        : callback(null, data)
    },

    message : function(error){
        if(this.is(error)==false) return 'not an error'
        return '['+error[1].code+'] '+error[1].message+"\n"
    }

}
module.exports = error
