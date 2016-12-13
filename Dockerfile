FROM node:4
EXPOSE 8080
COPY costmanager.js .
COPY server.js .
COPY package.json .
RUN mkdir public
COPY public/* public
RUN npm install --save google-cloud
RUN npm install --save express
RUN npm install --save
#RUN npm install --save socket.io
#CMD node costmanager.js
CMD node server.js
