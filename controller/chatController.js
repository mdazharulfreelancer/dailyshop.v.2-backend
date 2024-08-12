const express = require('express');
const cashAsyncError = require('../middleware/cashAsyncError');
const ErrorHandler = require('../utilities/errorHandler')
const cloudinary = require('cloudinary').v2;
const ChatModel = require('../models/chatModel');
const MessageModel = require('../models/messageModel');

exports.ChatController = cashAsyncError(async(req, res, next) =>{
    const senderId = req.body.senderId;
    const receverID = req.body.receverId;

    if(!senderId && !receverID){
        return next(new ErrorHandler('please enter selctoin user', 404))
    }
    const Result = new ChatModel({
        member : [senderId , receverID]
    })
    const   newChat= await Result.save();
    res.status(200).json({
        sucess : true,
        newChat
    })
})
exports.UserChat = cashAsyncError(async(req, res, next) =>{
    const spacafigFindChat = await ChatModel.find({
        member : {$in : [req.params.userId]}
    })

    if(!spacafigFindChat) {
        return next(new ErrorHandler('not found user', 404))
    }
    res.status(200).json({
        succes : true,
        spacafigFindChat
    })
})
exports.FindChat = cashAsyncError(async(req, res, next) =>{
    const FindChat = await ChatModel.find({
        member : {$all : [req.params.firstId, req.params.secoundId]}
    })

    if(!FindChat) {
        return next(new ErrorHandler('not found user', 404))
    }
    res.status(200).json({
        succes : true,
        FindChat
    })
})

exports.MessageController = cashAsyncError(async(req, res, next) =>{
  const chatId = req.body.chatId
  const senderId = req.body.senderId
  const text = req.body.text

  if(!chatId && !senderId  ){
    return next(new ErrorHandler('not found chatId', 404))
  }
  const  MessageCreate = new MessageModel({
    chatId,
    senderId,
    text
  })
   const  Message= await MessageCreate.save();
   res.status(200).json({
    succes : true,
    Message
   })



})
exports.GetMessageController = cashAsyncError(async(req, res, next) =>{
    const {chatId} = req.params

    const FinChatUser = await MessageModel.find({chatId})
    if(!FinChatUser) {
        return next( new ErrorHandler('not found ud',404))
    }
    res.status(200).json({
        succes :true,
        FinChatUser
    })
})