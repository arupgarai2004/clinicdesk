# Nx runs this with the build context set to apps/api, after `nx build api`.
# The bundle is apps/api/dist. Schema and migrations stay beside this file.
#
#   npx nx docker:build api
#   docker run --rm -p 3333:3333 \
#     -e DATABASE_URL="postgresql://..." \
#     apps-api
#
FROM node:22-alpine

RUN apk add --no-cache openssl

ENV HOST=0.0.0.0
ENV PORT=3333
ENV NODE_ENV=production

WORKDIR /app

COPY dist ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Install the bundled app's production dependencies, then the Prisma CLI.
# Generate the client in this image so the engine matches Alpine.
# The placeholder URL is only for generate; it is not stored in the image.
RUN npm --omit=dev -f install \
  && npm install --no-save prisma@7.6.0 \
  && DATABASE_URL="postgresql://prisma:prisma@localhost:5432/prisma" \
     npx prisma generate --schema=prisma/schema.prisma \
  && chmod +x ./docker-entrypoint.sh \
  && chown -R node:node /app

USER node

EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]
