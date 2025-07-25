export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    // Leer el cuerpo completo como texto (crudo)
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString('utf8');

    // Parsearlo a JSON
    const parsedBody = JSON.parse(rawBody);

    const response = await fetch("https://n8n.luquin.com/webhook/MC/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsedBody)
    });

    if (response.ok) {
      res.status(200).json({
        status: "success",
        message: "Contacto creado correctamente"
      });
    } else {
      const errorText = await response.text();
      res.status(500).json({
        status: "error",
        message: "n8n devolvió un estado no exitoso",
        detalle: errorText
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Proxy failed: " + err.message
    });
  }
}
