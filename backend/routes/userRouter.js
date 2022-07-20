const router=require("express").Router()
const userModel=require('../models/userModel');
const tokenModel=require('../models/tokenModel')
var bcrypt=require('bcryptjs')
var jwt=require('jsonwebtoken')
var iftoken=require("../middleware/iftoken")
const Misc=require("../controllers/Misc")
router.post('/reg/user',async(req,res)=>{
    try 
    {
        var{name,password,gender,city,phonenumber} =req.body
        //console.log(req.body)
        if(name==undefined|| name==null)
        {
            res.status(200).json({
                status : false,
                msg:"name not provided"
            })
            return;
        }
        if(password==undefined|| password==null)
        {
            res.status(200).json({
                status : false,
                msg:"password not provided"
            })
            return;
        } 
        if(gender==undefined|| gender==null)
        {
            res.status(200).json({
                status : false,
                msg:"gender should be provided"
            })
            return;
        }
        if(city==undefined|| city==null)
        {
            res.status(200).json({
                status : false,
                msg:"choose City"
            })
            return;
        }
        if(phonenumber==undefined|| phonenumber==null)
        {
            res.status(200).json({
                status : false,
                msg:"enter phonenumber"
            })
            return;
        }
        var encryptedPassword=await bcrypt.hash(password,10);
        var data=new userModel({
            name : name,
            password :encryptedPassword,
            gender : gender,
            city : city,
            phonenumber : phonenumber,
            role : 'user'

        })
        await data.save()
        var token = jwt.sign({
        id:data.id,
        phonenumber:data.phonenumber},'shhh');

        var tokendata= new tokenModel({
            token : token,
            role : 'user'
        })

        res.status(200).json({
            status : true,
            msg:"success",
            token:token,
            data:data

        })
        return;
    } 
    catch (error)
     {
        console.log(error)
        res.status(500).json({
            status :false,
            msg:"internal server error"
        })
        return;     


    }
})




router.post('/login/user',async(req,res)=>{
    try {
        var{phonenumber,password} =req.body
        if(phonenumber==undefined || phonenumber==null)
{
    res.status(200).json({
        status : false,
        mag:"should not be empty"
    })
    return;
}
if(password==undefined|| password ==null)
{
    res.status(200).json({
        status : false,
        msg:"password not provided"
    })
    return;
}
var data=await userModel.findOne({phonenumber:phonenumber,status:"Active"});
if(!data){
    res.status(200).json({
        status :false,
        msg:"Invalid phonenumber"
    })
    return
}
if(await bcrypt.compare(password,data.password))
{
    var token=jwt.sign({
    id:data.id,
    phonenumber:data.phonenumber},'shhh');

    var tokendata =new tokenModel({
        token : token,
        role : 'user'
    })

    res.status(200).json({
        status : true,
        msg:"success",
        token:token,
        data:data
    })
    return;
    } 
    else{
        res.status(200).json({
            status:false,
            msg:"wrongpassword"
        })
        }
    }

    catch (error)
    {
      console.log(error)
      res.status(500).json({
        status:false,
        msg:"internal server error"
      }) 
      return;

    }
})
// logout user
router.get('/logout/user',iftoken,async(req,res)=>{
    try {
        var {id}=req.user.id;
        console.log(id)
        if(id==null || id==undefined){
            res.status(200).json({
                status: false,
                msg:"id not provided"
            })
            return;
        }
        var data=await tokenModel.findOne({tokenId:id})
        console.log(data)
        res.status(200).json({
            status:true,
            msg:"logged out"
        });
        return;
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            status:false,
            msg:"Internal server error"
        })
return;
    }
})




////////////////////////////////////////////////

router.post('/user/registration', async (req, res) => {
    try {
        var {name, gender, phonenumber,city, password} = req.body
        if (Misc.isnullorempty(name)) {
            res.status(200).json({
                status: false,
                msg: "name not provided"
            });
            return;
        }
        if (Misc.isnullorempty(gender)) {
            res.status(200).json({
                status: false,
                msg: "gender not provided"
            });
            return;
        }
        if (Misc.isnullorempty(phonenumber)) {
            res.status(200).json({
                status: false,
                msg: "phonenumber not provided"
            });
            return;
        }
        if (Misc.isnullorempty(city)) {
            res.status(200).json({
                status: false,
                msg: "city not provided"
            });
            return;
        }
        if (Misc.isnullorempty(password)) {
            res.status(200).json({
                status: false,
                msg: "password not provided"
            });
            return;
        }
        var encryptedPassword = await bcrypt.hash(password, 10);
        var data = new userModel({
            gender:gender,
            phonenumber:phonenumber,
            name:name,
            password:encryptedPassword,
            city:city,
            role:'User'
        })
        await data.save()
        res.status(200).json({
            status: true,
            msg: "success",
            user: data,
        });
        return;
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "internal server error"
        });
        return;
    }
})




router.post('/user/login', async (req, res) => {
    var { phonenumber, password } = req.body;
    try {
        console.log(req.body)
        if (Misc.isnullorempty(phonenumber)) {

            res.status(200).json({
                status: false,
                msg: "phonenumber is not provided"
            });
            return;
        }
        if (Misc.isnullorempty(password)) {
            res.status(200).json({
                status: false,
                msg: "Password is not provided"
            });
            return;
        }
        
        var d = await userModel.findOne({ phonenumber: phonenumber, status: 'Active' })
        if (Misc.isnullorempty(d)) {
            res.status(200).json({
                status: false,
                msg: "Invalid Credentials"
            });
            return;
        }
        //console.log(d)
        if (await bcrypt.compare(password, d.password)) {
            var token = jwt.sign({
                id: d._id,
                phoneNumber: d.phoneNumber
            }, 'shhhhh');
            var tokendata = new tokenModel({
                name: d._id,
                token: token,
                role: d.role
            })
            await tokendata.save()
            //console.log(d)
            if (!Misc.isnullorempty(d.designationId)) {
                res.status(200).json({
                    status: true,
                    msg: "sucess",
                    data: d,
                    token: token,
                    role: d.designationId.designation_name
                });
                return;
            }
            res.status(200).json({
                status: true,
                msg: "sucess",
                data: d,
                token: token
            });
            return;
        }
        else {
            res.status(200).json({
                status: false,
                msg: "Invalid Credentials"
            });
            return;
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
})




router.get('/suser/logout2', iftoken, async (req, res) => {
    try {
        var id = req.user.id
        if (Misc.isnullorempty(id)) {
            res.status(200).json({
                status: false,
                msg: "id not provided"
            });
            return;
        }
        var data = await tokenModel.deleteOne({ tokenId: id })
        //console.log(data)
        //console.log(data)
        res.status(200).json({
            status: true,
            msg: "logout sucess"
        });
        return;

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: false,
            msg: "Internal server error"
        })
    }
})


module.exports = router;
