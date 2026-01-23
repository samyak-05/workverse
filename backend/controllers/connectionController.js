import User from "../models/userModel.js";
import Connection from "../models/connection.js";

// Send Connection Request
export const sendRequest=async(req,res)=>{
  try{
    const id=req.params.id;
    const sender=req.userId;

    if(sender===id){
      return res.status(400).json({message:"Can't send request to yourself"});
    }

    const user=await User.findById(sender);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    if(user.connections.includes(id)){
      return res.status(400).json({message:"Already connected"});
    }

    const existing= await Connection.findOne({
      sender,
      reciever:id,
      status:"Pending"
    });

    if(existing){
      return res.status(400).json({message:"Request already sent"});
    }

    const request=await Connection.create({sender,reciever:id});
    return res.status(200).json({message:"Request sent",request});
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
};

// Accept Connection Request
export const acceptRequest=async(req,res)=>{
  try{
    const connectionId=req.params.connectionId;

    const connection=await Connection.findById(connectionId);
    if(!connection){
      return res.status(404).json({message:"Request not found"});
    }

    if(connection.status!=="Pending"){
      return res.status(400).json({message:"Request already processed"});
    }

    connection.status="Accepted";
    await connection.save();

    await User.findByIdAndUpdate(req.userId,{
      $addToSet:{connections:connection.sender}
    });

    await User.findByIdAndUpdate(connection.sender,{
      $addToSet:{connections:req.userId}
    });

    return res.json({message:"Request accepted"});
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
};

// Reject Connection Request
export const rejectRequest=async(req,res)=>{
  try{
    const connectionId=req.params.connectionId;

    const connection=await Connection.findById(connectionId);
    if(!connection){
      return res.status(404).json({message:"Request not found"});
    }

    if(connection.status!=="Pending"){
      return res.status(400).json({message:"Request already processed"});
    }

    connection.status="Rejected";
    await connection.save();

    return res.json({message:"Request rejected"});
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
};

// Remove Connection
export const removeConnection=async(req,res)=>{
  try{
    const myId=req.userId;
    const otherUserId=req.params.userId;

    await User.findByIdAndUpdate(myId,{
      $pull:{connections:otherUserId}
    });

    await User.findByIdAndUpdate(otherUserId,{
      $pull:{connections:myId}
    });

    return res.json({message:"Connection removed"});
  }catch(error){
    return res.status(500).json({message:"removeConnection error"});
  }
};

// Get Connection Status
export const getConnectionStatus=async(req,res)=>{
  try{
    const targetUserId=req.params.userId;
    const currentUserId=req.userId;

    if(currentUserId===targetUserId){
      return res.json({status:"self"});
    }

    const user=await User.findById(currentUserId).select("connections");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    if(user.connections.includes(targetUserId)){
      return res.json({status:"disconnect"});
    }

    const pending=await Connection.findOne({
      $or:[
        {sender:currentUserId,reciever:targetUserId},
        {sender:targetUserId,reciever:currentUserId}
      ],
      status:"Pending"
    });

    if(pending){
      if(pending.sender.toString()===currentUserId){
        return res.json({status:"pending"});
      }
      return res.json({status:"received",requestId:pending._id});
    }

    return res.json({status:"connect"});
  }catch(error){
    return res.status(500).json({message:"getConnectionStatus error"});
  }
};

// Get Incoming Requests
export const getConnectionRequests=async(req,res)=>{
  try{
    const userId=req.userId;

    const requests=await Connection.find({
      reciever:userId,
      status:"Pending"
    }).populate(
      "sender",
      "firstName lastName username profilePic headline"
    );

    return res.json(requests);
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
};

// Get User Connections
export const getUserConnections=async(req,res)=>{
  try{
    const user=await User.findById(req.userId).populate(
      "connections",
      "firstName lastName username profilePic headline"
    );

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    return res.json(user.connections);
  }catch(error){
    return res.status(500).json({message:"Server error"});
  }
};