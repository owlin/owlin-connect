const 
    random_string = require('./lib/random_string'),
    request       = require('request'),
    extend        = require('node.extend'),
    fs            = require('fs'),
    crypto        = require('crypto'),
    error         = require('./lib/error');

var owlin = function(login){ 

    var host = "https://newsroom.owlin.com";
    var that = this;

    this.request = function(input,callback){

        //Define args if not defined
        if(typeof input.args == "undefined") input['args'] = {};

        // Assign value to args if value is defined
        if("value" in input) input.args.value = input.value

        // Add login information to HTTP Request
        if(("login" in input) == false || input.login == true){
            this.get_access_key(false, make_request)
        }
        else make_request(null, {});

        function make_request(err, access_key){
            // Add the access keys
            input.args = extend(input.args, access_key)

            // Pack the args to a nonrecursive dict
            //var args= that.non_recursive_dict(input.args);
            var args = input.args

            // Make the HTTP Request
            request.get({
                url                 : host+"/api/v1/"+input.method,
                type                : "POST",
                json                : args,
                rejectUnauthorized  : false
            }, function(err, request, body){
                if(callback) callback(null, body)
            });
        }
    }

    this.non_recursive_dict = function(input){
        var out = {} 
        for(var i in input){
            if(['array','object'].indexOf(typeof input[i]) != -1)
                out[i+"[]"] = JSON.stringify(input[i])
            else
                out[i] = input[i]
        }
        return out
    }

    this.get_access_key = function(force_reset, callback){
        console.log("Getting access key");
        // get the sessionkey
        this.get_session(force_reset, function(err, session){
            console.log("got secret key");
            console.log(session);

            var nonce   = random_string(),
                time    = new Date()/1000; 

            var access_key = crypto
                .createHash('sha256')
                .update([session.secret_key, nonce, time].join(''))
                .digest('hex');

            // Return the access key
            callback(null,{
                session_id  : session.session_id,
                access_key  : access_key,
                nonce       : nonce,
                time        : time
            });
        });
    }

    this.get_session = function(force_reset, callback){
        // if we already have the access key in memory, just return it
        if(this.session && !force_reset) callback(null,this.session);

        // if we don't have the access key yet, we will first attempt to get it from disk
        if(!this.access_key && !force_reset){
            console.log("reading secret key from disk")
            fs.readFile('/tmp/'+login.email, function(err, data){

                if(err){ 
                    // Retry to get an access key, by calling myself again with a force reset flag
                    return that.get_session(true,callback);
                }

                // No error, just return the secret key
                else {
                    // Parse the data
                    data = JSON.parse(data);

                    // Set the secret key for later
                    this.session = data;

                    // Return the data
                    error.callback(data, callback);
                }
            });
        }
        else {
            console.log("Force generating new key");
            this.request({ 
                method  : "generate_secret",
                args    : login,
                login   : false
            }, function(err, data){
                console.log("got data from new key:");
                console.log(data);

                fs.writeFile(
                    '/tmp/'+login.email,
                    JSON.stringify(data),
                    function(err){
                        console.log("File written");
                        callback(null, data);
                    }
                )
            });
        }
    }
    return this
}

module.exports = owlin
