 const passport=require("passport")
 exports.isAuth=(req, res, done)=>{
   return passport.authenticate('jwt')
  }
  exports.sanitizerUser=(user)=>{
    return {id:user.id,role:user.role}
  }
  exports.cookieExtractor=function(req){
    let token=null;
    if(req && req.cookies){
      token=req.cookies['jwt']
    }
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjJiNDYzMjdjMDI3ZmZhMmNkN2Y3YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY4OTQzMzIzNn0.oxn4chlt_xga4rjrwyvw2xep8kTUzYlZEymlhQqeMjY"
    return token
  }