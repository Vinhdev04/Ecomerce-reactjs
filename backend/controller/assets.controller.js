import axios from 'axios';

const ALLOWED_HOSTS = new Set([
  'images.unsplash.com',
  'ncarb.github.io',
]);

export const proxyImage = async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl) {
      return res.status(400).json({ success: false, message: 'Missing url param' });
    }

    let url;
    try {
      url = new URL(rawUrl);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid URL' });
    }

    if (!ALLOWED_HOSTS.has(url.hostname)) {
      return res.status(403).json({ success: false, message: 'Host not allowed' });
    }

    const response = await axios.get(url.toString(), {
      responseType: 'arraybuffer',
      headers: {
        // Hint for image responses
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://'+url.hostname+'/'
      }
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // 1 day
    return res.status(200).send(response.data);
  } catch (err) {
    console.error('proxyImage error:', err?.message || err);
    return res.status(500).json({ success: false, message: 'Failed to proxy image' });
  }
};

export default { proxyImage };
