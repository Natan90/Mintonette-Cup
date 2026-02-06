const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  findUserByGoogleId,
  findUserByEmail,
  createUserFromGoogle,
  updateUserGoogleId
} = require('../models/utilisateur.model');

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
        let user = await findUserByGoogleId(profile.id);

        if (!user && profile.emails?.length) {
          user = await findUserByEmail(profile.emails[0].value);
        }

        if (!user.google_id) {
            await updateUserGoogleId(user.id_utilisateur, profile.id);
            user.google_id = profile.id;
            user.provider = 'google';
        }
        if (!user) {
          user = await createUserFromGoogle({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
