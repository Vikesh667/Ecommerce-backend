const { Order } = require("../modal/Order");

exports.fetchOrderByUser = async (req, res) => {
    const { user } = req.query;
    try {
      const orders = await Order.find({ user: user })
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
      const doc = await order.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  exports.deleteOrder = async (req, res) => {
     const {id}=req.params
    try {
      const order = await Order.findByIdAndDelete(id)
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  exports.updateOrder=async(req,res)=>{
        const {id}=req.params
        try{
          const order=await Order.findByIdAndUpdate(id,req.body,{
            new:true
          })
          res.status(200).json(order);
        }catch(error){
          res.status(400).json(error);
  
        }
  }
  exports.fetchAllOrders = async (req, res) => {
    let query =  Product.find({deleted:{$ne:true}});
    let totalProductsQuery=Order.find({deleted:{$ne:true}})
    if (req.query.category) {
      query = query.find({ category: req.query.category });
      totalProductsQuery=totalProductsQuery.find({ category: req.query.category });
    }
    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
      totalProductsQuery=totalProductsQuery.find({ brand: req.query.brand });
    }
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
      
    }
  
    const totalDocs=await totalProductsQuery.count().exec()
    console.log(totalDocs)
  
    if (req.query._page && req.query._limit) {
      const pageSize = req.query._limit;
      const page = req.query._page;
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    try {
      const docs = await query.exec();
      res.set("X-Total-Count",totalDocs)
      res.status(200).json(docs);
    } catch (err) {
      res.status(400).json(err);
    }
  };