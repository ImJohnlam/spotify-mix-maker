const asyncHandler = fn => 
 (req, res, next) => 
 fn(req, res, next)
 .catch(err => {console.log(err); res.send(err)});

module.exports = {
   asyncHandler
};
