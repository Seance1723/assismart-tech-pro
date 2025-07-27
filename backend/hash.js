const bcrypt = require('bcrypt');
bcrypt.hash('Admin@123', 10, function(err, hash) {
  if (err) throw err;
  console.log(hash);
});
