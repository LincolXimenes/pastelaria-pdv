FROM node:20-alpine

WORKDIR /api_pastelaria

# Copiar apenas package files primeiro para cache de layers
COPY package*.json ./

RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]