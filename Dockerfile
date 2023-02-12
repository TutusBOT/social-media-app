FROM node:latest as prod

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build
# CMD ["yarn", "dev"]

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=prod /app/build .

EXPOSE 80

# run nginx with global directives and daemon off

ENTRYPOINT ["nginx", "-g", "daemon off;"]