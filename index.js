const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const LocalStrategy=require('passport-local').Strategy
const passport = require("passport");
const productRouters = require("./routes/Product");
const categoriesRouter = require("./routes/Category");
const brandsRouter = require("./routes/Brand");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./modal/User");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://vikesh667kumar:ecommerce123@ecomerce.8duduxm.mongodb.net/ecomerce"
  );
  console.log("database connected");
}

server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use("/products", isAuth, productRouters.router);
server.use("/categories", categoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", cartRouter.router);
server.use("/orders", ordersRouter.router);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ email: username }).exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      } else if (user.password === password) {
        done(null,user);
      } else {
        done(null, false, { message: "invalid credentials" });
      }
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null,{id:user.id,role:user.role})
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

function isAuth(req,res,done){
    if(req.user){
        done()
    }else{
        res.send(401)
    }
}
server.listen(8080, () => {
  console.log("server started");
});
