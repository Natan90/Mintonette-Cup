const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  findUserByGoogleId,
  findUserByEmail,
  createUserFromGoogle,
  updateUserGoogleId
} = require('../services/utilisateur.service');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;

        let user = await findUserByGoogleId(profile.id);
        if (user) {
          return done(null, user);
        }

        if (email) {
          user = await findUserByEmail(email);

          if (user) {
            await updateUserGoogleId(user.id_utilisateur, googleId);
            user.google_id = googleId;
            user.provider = 'google';
            return done(null, user);
          }
        }

        user = await createUserFromGoogle({
          googleId,
          email,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
