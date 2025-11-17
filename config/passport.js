const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          const photo = profile.photos && profile.photos[0] && profile.photos[0].value;

          console.log('🔐 Google OAuth Callback:');
          console.log('   - Google ID:', profile.id);
          console.log('   - Name:', profile.displayName);
          console.log('   - Email:', email);
          console.log('   - Photo URL:', photo);

          // Try to find an existing user by Google id or by email
          let user = await User.findOne({ $or: [{ userId: profile.id }, { email }] });

          if (user) {
            console.log('   ✅ Existing user found:', user.userId);
            // If user exists, update profile picture from Google (keeps existing userId if email-based account)
            if (photo) {
              console.log('   📸 Updating profilePicture to:', photo);
              user.profilePicture = photo;
            }
            // Mark that this account was authenticated via Google
            user.authProvider = 'google';
            // Ensure email is set
            if (email && !user.email) {
              user.email = email;
            }
            await user.save();
            console.log('   💾 User saved with Google photo');
            return done(null, user);
          }

          // Create new user using Google profile
          console.log('   🆕 Creating new user with Google profile');
          user = new User({
            userId: profile.id,
            name: profile.displayName,
            email: email,
            profilePicture: photo,
            authProvider: 'google',
          });

          await user.save();
          console.log('   ✅ New user created with profilePicture:', photo);
          done(null, user);
        } catch (error) {
          console.error('   ❌ Google OAuth Error:', error);
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};