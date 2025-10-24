const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Tu clave secreta Direct Line (Render la almacenará como variable de entorno)
const DIRECT_LINE_SECRET = process.env.DIRECT_LINE_SECRET;

// ✅ Dominios permitidos (tu sitio del blob)
const ALLOWED_ORIGINS = [
  'https://dpchatbottest.z5.web.core.windows.net'
];

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

// Endpoint para generar el token
app.get('/api/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://directline.botframework.com/v3/directline/tokens/generate',
      {},
      {
        headers: { 'Authorization': `Bearer ${DIRECT_LINE_SECRET}` }
      }
    );

    console.log('🔑 Token generado correctamente');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error generando token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al generar token de Direct Line' });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));

