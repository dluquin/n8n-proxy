export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const parsedBody = req.body;

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
      res.status(500).json({
        status: "error",
        message: "n8n devolvió un estado no exitoso"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Proxy failed: " + err.message
    });
  }
}
