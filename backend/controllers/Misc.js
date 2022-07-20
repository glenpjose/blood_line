// var ErrorModel = require('../models/errorModel')
//const jwt=require('jsonwebtoken');

function isnullorempty(val) {
    if (typeof val === "undefined") {
        return true;
    }
    if (val === false || val === true) {
        return false;
    }
    if (val === 0) {
        return false;
    }
    if (val === undefined || val === null || val === "undefined" || val === "null" || val === "" || (!val)) {
        return true;
    }
    else
        if (typeof val === "number") {
            return false;
        }
        else {
            if (val.length > 0) {
                return false;
            }
            else {
                val = JSON.stringify(val);
                val = JSON.parse(val);
                if (Object.keys(val).length > 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
}
/*
async function logerror(error,req) {
    try {
        async function getCallerIP(req) {
            var ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].split(",")[0];
            } else if (req.connection && req.connection.remoteAddress) {
                ip = req.connection.remoteAddress;
            } else {
                ip = req.ip;
            }
            return ip;
        }
        var ip = await getCallerIP(req);
        var useragent = req.useragent;
        var geoip = JSON.stringify(useragent.geoIp)
        var bodyval = JSON.stringify(req.body);
        var queryval = JSON.stringify(req.query);
        var paramsval = JSON.stringify(req.params);
        var userid = null;
        if (!(isnullorempty(req.user)))
            userid = req.user.id;
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var token = req.headers['x-auth-token'];
        if (!(isnullorempty(token))) {
            var verify = jwt.verify(token, "!umi3r3");
            userid = verify.id;
        }
        var err=JSON.stringify(error);

        var newlog = ErrorModel({
            browser: useragent.browser,
            version: useragent.version,
            os: useragent.os,
            platform: useragent.platform,
            geoIp: geoip,
            source: useragent.source,
            url: fullUrl,
            body: bodyval,
            query: queryval,
            params: paramsval,
            ip: ip,
            error:err
        });

        if (!(userid === null))
            newlog.userid = userid;
        if (!(isnullorempty(token)))
            newlog.token = token;
        newlog.save();
    }
    catch (e) {
        console.log("Exception on error logger");
        console.log(e);
    }
}
*/

function dateToLocal(cdt){
    var d = new Date(cdt)
    var dt=d.toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
      });

    return (new Date(dt))
}


function timeToStDate(time)
{
    if(isnullorempty(time))
    {
        return (new Date(2021,1,1,0,0,0,0))
    }
    var tm=time.split(':');
    if(tm.length<2)
    {
        return (new Date(2021,1,1,0,0,0,0))
    }
    var hr=tm[0];
    var mn=tm[1];
    hr=parseInt(hr);
    mn=parseInt(mn);
    return (new Date(2021,1,1,hr,mn,0,0))
}

async function formatNullUndefinedStringValues(query,fields)
{
    try
    {
        if(isnullorempty(fields))
        return;
        if(fields.length<1)
        return;
        if(query===null||query===undefined)
        return;
        if(!(typeof query==="object"))
        return;
    
        for(var i=0;i<fields.length;i++)
        {
            console.log(fields[i])
            if(isnullorempty(fields[i]))
            continue;
            if(query[fields[i]]==="null"||query[fields[i]]==="Null"||query[fields[i]]==="undefined")
            {
                console.log("changed to null")
                query[fields[i]]=null;
            }
        }
    }
    catch(ex)
    {
        console.log(ex);
    }
    
    return;
}

module.exports.isnullorempty = isnullorempty;
// module.exports.logerror=logerror;
module.exports.dateToLocal=dateToLocal;
module.exports.timeToStDate=timeToStDate;
module.exports.formatNullUndefinedStringValues=formatNullUndefinedStringValues;