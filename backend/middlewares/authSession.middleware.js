module.exports = (req, res, next) => {
  console.log("Session reçue :", req.session);
  if (!req.session.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  next();
};
