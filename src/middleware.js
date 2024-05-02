// middleware.js en la carpeta raíz o donde prefieras

function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Custom-Header, Upgrade-Insecure-Requests"
  );

  // maneja las solicitudes OPTIONS para CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
}

export default cors;
