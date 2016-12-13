FROM node:4
EXPOSE 8080
COPY costmanager.js
COPY index.html .
RUN npm install --save google-cloud
RUN npm install --save express
RUN npm install --save socket.io
CMD node costmanager.js
