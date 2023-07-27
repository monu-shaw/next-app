import dbConnect from "../../../styles/resources/dbConnect";
import orderDetails from "../../../styles/resources/models/orderDetails";

dbConnect();

export default async function handler(req, res) {
    try {
        const orderdetail = await orderDetails.create(req.body);
        res.status(200).json({status: true, data: orderdetail});
        return ;

    } catch (error) {
      res.status(400).json({status: true, data: error});
      return ;
    }
    
  }
  