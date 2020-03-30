import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import auth from '../../config/authConfig';

export default async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token not provider' });
  }

  const [, token] = authToken.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, auth.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
