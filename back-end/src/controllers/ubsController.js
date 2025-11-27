const db = require('../config/db');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function buscarUbsProximas(req, res) {
  const { lat, lng, raio } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ erro: "Latitude e longitude são obrigatórias" });
  }

  try {
    const resultado = await db.query('SELECT * FROM ubs');

    const limite = raio ? Number(raio) : 10;

    const ubsProximas = resultado.rows
      .map((ubs) => ({
        ...ubs,
        distancia: haversine(
          Number(lat),
          Number(lng),
          Number(ubs.latitude),
          Number(ubs.longitude)
        ),
      }))
      .filter((ubs) => ubs.distancia <= limite)
      .sort((a, b) => a.distancia - b.distancia);

    res.json(ubsProximas);
  } catch (error) {
    console.error("Erro ao buscar UBS:", error);
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { buscarUbsProximas };
