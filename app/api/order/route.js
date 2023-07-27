import mongoose from "mongoose";
import dbConnect from "../../../styles/resources/dbConnect";
import orders from "../../../styles/resources/models/orders";

dbConnect();

export default async function handler(req) {
    const { id } = req.query
    
    if(req.method === 'POST'){
        try {
            const order = await orders.create(req.body);
            res.status(200).json({success: true, hero:order})
            } catch (error) {
                res.status(400).json({success: false, err: error})
            }   
    }else{
        if(id === 'all'){
            const order = await orders.find();
            res.status(200).json({data: order});
    }else{
        const order = await orders.find({orderId: id});
        res.status(200).json({data: order});
    }
    }
     

  }