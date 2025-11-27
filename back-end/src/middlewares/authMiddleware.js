const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
  
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado' });
    }
    req.usuario = decoded; 
    next();
  });
}

module.exports = { verificarToken };
