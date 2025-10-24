const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Render asigna el puerto dinámicamente
const PORT = process.env.PORT || 10000;

// Tu clave secreta Direct Line (configurada en Render como variable de entorno)
const DIRECT_LINE_SECRET = process.env.DIRECT_LINE_SECRET;

// Dominios permitidos para CORS (tu sitio web)
const ALLOWED_ORIGINS = [
  'https://dpchatbottest.z5.web.core.windows.net'
];

// Middleware CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
}));

app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend del Bot desplegado en Render ✅</h1>
    <p>Usa el endpoint <code>/api/token</code> para generar tokens de Direct Line.</p>
  `);
});

// Endpoint para generar token Direct Line
app.get('/api/token', async (req, res) => {
  if (!DIRECT_LINE_SECRET) {
    return res.status(500).json({ error: 'Falta la variable de entorno DIRECT_LINE_SECRET' });
  }

  try {
    const response = await axios.post(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      {},
      { headers: { 'Authorization': `Bearer ${DIRECT_LINE_SECRET}` } }
    );

    console.log('🔑 Token generado correctamente');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error generando token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al generar token de Direct Line' });
  }
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
