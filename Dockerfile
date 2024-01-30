FROM node:18-alpine

# Copy nestjs configs (json files), .env, service, and libs
WORKDIR /app
COPY package.json package.json
COPY dist dist
RUN yarn install --prod --ignore-engines

ENV PORT=80
EXPOSE 80

CMD ["yarn", "docker-start-all"]