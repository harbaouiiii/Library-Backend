const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verify = require('./verifyToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async (req,res) => {
    const {error} = registerValidation(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) 
        return res.status(400).send('Email already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email});
    if(!user) 
        return res.status(400).send('Email is not found!');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass)
        return res.status(400).send('Wrong password!');
    
    const token = jwt.sign({_id: user.id, name: user.name, is_admin: user.is_admin}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send({token});
});

router.get('/users',verify, async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch(err){
        res.json({ error_message: err});
    }
});

router.patch('/permission/:userId', verify, async (req,res) => {
    try{
        const userPermission = await User.findById(req.params.userId);
        const updatedUser = await User.updateOne(
            {_id: req.params.userId},
            { $set: {is_admin: !userPermission.is_admin} }
        );
        res.json(updatedUser);
    } catch(err){
        res.json({ error_message: err});
    }
});

router.patch('/edit', verify, async(req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const updatedUser = await User.updateMany(
            {_id: req.user._id},
            { $set: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
                }
            }
        );
        res.json(updatedUser);
    } catch(err){
        res.json({ error_message: err});
    }
});

router.delete('/delete/:userId', verify, async (req,res) => {
    try{
        const deletedUser = await User.deleteOne({_id: req.params.userId});
        res.json(deletedUser);
    } catch(err){
        res.json({ error_message: err});
    }
});

module.exports = router;