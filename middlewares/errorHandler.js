module.exports = function(err, req, res, next) {
  /* istanbul ignore next */
  let status = 500;
  let msg = ["internal server error"];

  /* istanbul ignore next */ 
  if (err.name === "ValidationError") {
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    const errors = [];
    for (const key in err.keyValue) {
      if (err.keyValue.hasOwnProperty(key)) {
        errors.push(`${key} has been used`);
      }
    }
    status = 409;
    msg = errors;
  } else if (err.name === "Forbidden") {
    /* istanbul ignore next */
    status = 404;
    msg = [err.errors[0].message];
    /* istanbul ignore next */ 
  } else if (err.code === "EAI_AGAIN") {
    /* istanbul ignore next */
    status = 503;
    res.status(status).json({ errors: ["Service Unavailable"] });
  }
  res.status(status).json({
    errors: msg
  });
};
