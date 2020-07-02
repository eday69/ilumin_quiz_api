
function runQuery(db, sql, values) {
   return new Promise( ( resolve, reject ) => {
       db.query( sql, values, ( err, rows ) => {
         if (err) {
           console.log('Query w/error: ', sql, ' \nValues: ', values);
           reject(err);
           return
         }
         // console.log('The Query: ', sql, ' \nValues: ', values);
         resolve(rows);
       });
   });
}

function formatDate (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function prepareResponse( status = 200, data = [], error = null ) {
   return new Promise( ( resolve, reject ) => {
     results = {
         status: status,
         results:  {
             data: data ? data : [],
             total_count: data.length
         }
     }
     resolve(results);
   });
 }

 throwError = (code, errorType, errorMessage) => error => {
   if (!error) error = new Error(errorMessage || 'Default Error');
   error.code = code;
   error.errorType = errorType;
   error.message = errorMessage;

   throw error;
 }

 sendSuccess = (res, status, message) => data => {
   res.status(status).json(data);
 }

 sendError = (res, status, message = '') => error => {
   code = ((status.code && !isNaN(status.code)) ? status.code : 404)
   res.status(code).json({
     type: 'error',
     message: message || error.message,
     error
   })
 }

 function isEmpty(obj) {
   for (var x in obj) { return false; }
   return true;
}

// exports.formatDate = formatDate;
module.exports = {
  formatDate,
  prepareResponse,
  runQuery,
  throwError,
  sendError,
  sendSuccess,
  isEmpty
}
