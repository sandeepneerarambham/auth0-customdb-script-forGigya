function getByEmail(email, callback) {
    // This script should retrieve a user profile from your existing database,
    // without authenticating the user.
    // It is used to check if a user exists before executing flows that do not
    // require authentication (signup and password reset).
    //
    // There are three ways this script can finish:
    // 1. A user was successfully found. The profile should be in the following
    // format: https://auth0.com/docs/users/normalized/auth0/normalized-user-profile-schema.
    //     callback(null, profile);
    // 2. A user was not found
    //     callback(null);
    // 3. Something went wrong while trying to reach your database:
    //     callback(new Error("my error message"));
  
    // const msg = 'Please implement the Get User script for this database connection ' + 'at https://manage.auth0.com/#/connections/database';
    // return callback(new Error(msg));
    // NO-OP 
    return callback(null, null);
    const query = `select UID, profile, loginProvider from accounts where profile.email contains "${email}"`;
    const apiKey = 'YOUR_API_KEY';
    const secret = 'YOUR_SECRET';
    const url = `https://accounts.us1.gigya.com/accounts.search`;
    const options = {
      url,
      qs: {
        apiKey,
        secret,
        query,
      },
    };
  
    request.post(options, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      if (response.statusCode === 401) {
        return callback();
      }
      const { results, errorCode, errorDetails } = JSON.parse(body);
      if (errorCode > 0) {
        return callback(new Error(errorDetails)); 
      }
      if (!results) {
        return callback(null);
      }
      
      try {
          const [{UID, profile}] = results;
      } catch (err) {
          return callback(null);
      }
      
      if (!UID) {
        return callback(null);
      }
      
      try {
        if (Number.isNaN(Number(UID))) {
          callback(null);
        } else {
          callback(null,   {
            user_id: UID,
            email,
            nickname: profile.nickname ? profile.nickname : null,
            picture: profile.thumbnailURL ? profile.thumbnailURL : null,
            given_name: profile.firstName ? profile.firstName : null,
            family_name: profile.lastName ? profile.lastName : null
          });
        }
      } catch (err) {
        callback(null);    
      }
    });
  }
  
  