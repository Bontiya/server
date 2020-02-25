module.exports = function(err, req, res, next) {
  let status = 500;
  let msg = ["internal server error"];

  if (err.name === "ValidationError") {
    const result = err.errors;
    const errors = [];
    for (const key in result) {
      if (result.hasOwnProperty(key)) {
        errors.push(result[key].message);
      }
    }
    status = 422;
    msg = errors;
  } else if (err.name === "MongoError") {
    const errors = [];
    for (const key in err.keyValue) {
      if (err.keyValue.hasOwnProperty(key)) {
        errors.push(`${key} has been used`);
      }
    }
    status = 409;
    msg = errors;
  } else if (err.name === "Forbidden") {
    status = 404;
    msg = [err.errors[0].message];
  } else if (err.code === "EAI_AGAIN") {
    status = 503;
    res.status(status).json({ errors: ["Service Unavailable"] });
  }
  res.status(status).json({
    errors: msg
  });
};
