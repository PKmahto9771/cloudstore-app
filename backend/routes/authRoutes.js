const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const USER = require('../models/User')

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/signup', async(req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:'All fields are required!'})
    }
    const u = await USER.findOne({email:email});
    console.log(u.email);
    if(u.email){
        return res.status(400).json({message:'user already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await USER.create({
        username,
        email,
        password:hashedPassword,
    })

    const token = jwt.sign({
        _id:user._id,
        email:user.email,
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' })

    res.cookie("uid", token);

    if(req.accepts(html)){
        res.redirect('/api/folders')
    }
    return res.status(201).json({message:'User successfully registerd'});
})

router.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:'All fields are required!'})
    }

    const user = await USER.findOne({email:email});
    if(!user){
        // console.log(user)
        return res.status(400).json({message:'user not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({message:'password does not match'});
    }

    const token = jwt.sign({
        _id:user._id,
        email:user.email,
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' })

    res.cookie("uid", token);

    if (req.accepts('html')) {
        return res.redirect('/api/folders');
    }
    return res.status(200).json({message:'User successfully logged in'});
});

router.post('/logout', (req, res) => {
    res.clearCookie("uid");

    return res.status(200).json({message:'User successfully logged out'});
});

router.get('/me', (req, res) => {
    const token = req.cookies.uid;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;