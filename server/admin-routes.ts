import { Router } from 'express';
import { SignJWT } from 'jose';

const router = Router();

async function superAdminAuth(req: any, res: any, next: any) {
  try {
    const token = req.cookies?.super_admin_session;
    if (!token) return res.status(401).json({ error: 'Non autorisé' });
    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== 'super-admin') return res.status(403).json({ error: 'Accès refusé' });
    next();
  } catch {
    return res.status(401).json({ error: 'Session invalide' });
  }
}

// Login super-admin
router.post('/api/super-admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'NOUVEAU_MDP') {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'Intemporelle2026!');
    const token = await new SignJWT({ role: 'super-admin', username: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    res.cookie('super_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    return res.json({ success: true });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// Liste des studios
router.get('/api/super-admin/studios', superAdminAuth, async (req, res) => {
  const db = await import('./db').then(m => m.getDb());
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const [rows] = await (db as any).$client.query('SELECT id, nom, email, slug, createdAt FROM studios ORDER BY createdAt DESC'); const studios = rows;
  
  res.json(studios);
});

export default router;
