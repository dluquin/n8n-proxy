export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: "error", message: "Only POST allowed" });
  }

  try {
    // Leer y parsear el cuerpo de la petición manualmente
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString('utf8');

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch (parseError) {
      return res.status(400).json({
        status: "error",
        message: "El cuerpo no es un JSON válido",
        detalle: parseError.message
      });
    }

    // Enviar al webhook de n8n
    const response = await fetch("https://n8n.luquin.com/webhook/MC/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedBody)
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        status: "error",
        message: "n8n devolvió un error",
        detalle: responseText
      });
    }

    // Respuesta correcta
    return res.status(200).json({
      status: "success",
      message: "Contacto creado correctamente"
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error inesperado en proxy",
      detalle: err.message
    });
  }
}
