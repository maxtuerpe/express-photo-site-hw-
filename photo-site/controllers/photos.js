const express = require('express');
const router  = express.Router();
const Photo = require('../models/photos');
const User = require('../models/users');

router.get('/',  async (req, res) => {
    try {
        const photos = await Photo.find({});
        res.render('photos/index.ejs', {photos});
    } catch(err){
        res.send(err);
    }
})
router.get('/new', async (req, res) => {
    try {
        const users = await User.find({})
        res.render('photos/new.ejs', {users});
    } catch(err){
        res.send(err);
    }
})
router.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        const photo = await Photo.create(req.body);
        user.photos.push(photo);
        await user.save();
        res.redirect('/photos');
    } catch(err){
        res.send(err);
    }
})
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({'photos._id': req.params.id});
        const photo = await Photo.findById(req.params.id);
        res.render('photos/show.ejs', {user, photo});
    } catch(err){
        res.send(err);
    }    
})
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOne({'photos._id': req.params.id});
        const photo = await Photo.findById(req.params.id);
        user.photos.id(req.params.id).remove();
        await Photo.findByIdAndDelete(req.params.id);
        await user.save();
        res.redirect('/photos');
    } catch(err){
        res.send(err);
    }
})
router.get('/:id/edit', async (req, res) => {
    try{
        const users = await User.find({});
        const photo = await Photo.findById(req.params.id);
        res.render('photos/edit.ejs', {users, photo});
    } catch(err){
        res.send(err)
    }
})
router.put('/:id', async (req, res) => {
    try {
        const newUser = await User.findOne({'_id': req.body.userId});
        const photo = await Photo.findById(req.params.id);
        const oldUser = await User.findOne({'photos._id': photo._id})
        await Photo.findByIdAndUpdate(req.params.id, req.body);
        for (let i = 0; i < oldUser.photos.length; i++){
            if (`${oldUser.photos[i]._id}` === `${photo._id}`){
                await oldUser.photos.splice(i, 1);
            }
        }
        newUser.photos.push(photo);
        await newUser.save();
        await oldUser.save();
        res.redirect(`/photos/${req.params.id}`)
    } catch(err){
        res.send(err);
    }
})

module.exports = router;