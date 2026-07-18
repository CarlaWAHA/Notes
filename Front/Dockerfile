FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/notes/browser/ /usr/share/nginx/html/
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; fi \
	&& test -f /usr/share/nginx/html/index.html

ENV PORT=10000
ENV BACKEND_URL=https://notes-backend.onrender.com
ENV NGINX_ENVSUBST_FILTER="^(PORT|BACKEND_URL)$"

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
