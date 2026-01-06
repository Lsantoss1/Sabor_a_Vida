const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

/**
 * Retorna o segredo de administração configurado nas Functions
 * (funções config > admin.secret) ou pela variável de ambiente
 * `ADMIN_SECRET`.
 * @return {string|null}
 */
function getSecret() {
  // Prefer functions config, fallback to env var
  try {
    const cfg = functions.config && functions.config().admin;
    if (cfg && cfg.secret) return cfg.secret;
  } catch (e) {
    // ignore
  }
  return process.env.ADMIN_SECRET || null;
}

app.post("/setAdmin", async (req, res) => {
  // Preferential auth: verify Firebase ID token from caller
  // Expect header: Authorization: Bearer <idToken>
  // and that token has claim admin:true
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  let callerIsAdmin = false;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (decoded && decoded.admin === true) callerIsAdmin = true;
    } catch (err) {
      console.warn(
          "verifyIdToken failed:",
        err && err.message ? err.message : err,
      );
      // continue to fallback to secret
    }
  }

  // Fallback: secret (legacy) if no valid ID token provided
  const secret = getSecret();
  const provided = req.headers["x-admin-secret"] || req.query.secret;
  if (!callerIsAdmin) {
    if (!secret) {
      return res.status(401).json({
        success: false,
        error:
          "Not authorized: no valid ID token and no " + "secret configured.",
      });
    }
    if (!provided || provided !== secret) {
      return res
          .status(401)
          .json({success: false, error: "Invalid or missing secret."});
    }
  }

  const {email, uid, admin: makeAdmin} = req.body || {};
  if (!email && !uid) {
    return res
        .status(400)
        .json({success: false, error: "Provide email or uid in request body."});
  }

  try {
    let targetUid = uid;
    if (!targetUid) {
      const user = await admin.auth().getUserByEmail(email);
      targetUid = user.uid;
    }

    if (!makeAdmin) {
      // remove claims
      await admin.auth().setCustomUserClaims(targetUid, null);
      return res.json({
        success: true,
        message: `Removed admin claim for ${targetUid}`,
      });
    }

    await admin.auth().setCustomUserClaims(targetUid, {admin: true});
    return res.json({
      success: true,
      message: `Set admin=true for ${targetUid}`,
    });
  } catch (error) {
    console.error("Error setting admin claim:", error);
    return res
        .status(500)
        .json({success: false, error: error.message || String(error)});
  }
});

exports.api = onRequest(app);
