import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { authConfig } from '../config/auth';

type IDecoded = {
  id: string;
}

interface TokenPayload {
  iad: number;
  exp: number;
  sub: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.secret) as unknown as IDecoded;

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido." });
  }
};