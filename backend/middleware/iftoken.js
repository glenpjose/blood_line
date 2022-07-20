const tokenModel = require('../models/tokenModel')
var jwt = require('jsonwebtoken');
const userModel=require("../models/userModel")

module.exports = async function (req, res, next) {
    try {
        var token = req.body.token || req.query.token || req.headers.token;
        // console.log('token: ',token)
        if (token) {
            try {
                var user = await jwt.verify(token, 'shhhhh');
                if (user) {
                    req.user = user;
                    var userdata = await userModel.findOne({ _id: req.user.id}, { password: 0 });
                    console.log("aewsdrtfgyuhijk"+userdata)
                    var tokendata = await tokenModel.findOne({user_id:req.user.id})
                    if(tokendata== null || tokendata==undefined){
                        res.status(200).json({
                            status: false,
                            msg: 'Please Login To continue'
                        });
                        return;
                    }
                    if (userdata!=null || userdata!=undefined) {
                        req.user.user = userdata;
                        next();
                    }
                    else {
                        res.status(200).json({
                            status: false,
                            msg: 'Failed to find admin.'
                        });
                        return;
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        expired: true,
                        msg: 'Failed to authenticate token.'
                    });
                    return;
                }
            } catch (ex) {
                console.log(ex)
                res.status(200).json({
                    status: false,
                    expired: true,
                    msg: 'Your session has expired, please login again.',
                    ex: ex
                });
                return;
            }

        } else {
            res.status(200).json({
                status: false,
                expired: true,
                msg: 'No token provided.'
            });
            return;
        }

    } catch (e) {
        console.log(e)
        res.status(500).json({
            status: false,
            expired: true,
            msg: 'Something went wrong!!!',
            e: e
        });
    }
};
