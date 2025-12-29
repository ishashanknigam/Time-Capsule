FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]