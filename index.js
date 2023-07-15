const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const productRouters = require("./routes/Product");
const categoriesRouter = require("./routes/Category");
const brandsRouter = require("./routes/Brand");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./modal/User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { isAuth, sanitizerUser } = require("./services/Common");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://vikesh667kumar:ecommerce123@ecomerce.8duduxm.mongodb.net/ecomerce"
  );
  console.log("database connected");
}

const SECRET_KEY = "SECRET_KEY";
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;
server.use(express.static("build"))
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
server.use("/products", isAuth(), productRouters.router);
server.use("/categories",isAuth(), categoriesRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/users",isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(),cartRouter.router);
server.use("/orders",isAuth(), ordersRouter.router);

passport.use(
  "local",
  new LocalStrategy(
    {usernameField:"email"},
    async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        return done(null, false, { message: "invalid credentials" });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizerUser(user), SECRET_KEY);
          done(null, {token});
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null, sanitizerUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {
      if (err) {
        return done(err, false);
      }
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

server.listen(8080, () => {
  console.log("server started");
});
