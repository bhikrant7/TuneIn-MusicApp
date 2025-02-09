// export const errorHandler = async (err, req, res, next) => {  //error is taken as argument directly sent by the middleware
//   res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal Server error' : err.message });
// };
// // if production then show Internal Server error else console log the error message

export const errorHandler = async (err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }
  res.status(500).json({ error: err.message });
}
