FROM node:4
EXPOSE 8080
COPY costmanager.js .
COPY server.js .
COPY package.json .
RUN mkdir public
COPY public/index.html public
RUN mkdir public/views
COPY public/views/costRecord.ejs public/views
COPY public/views/edit.ejs public/views
RUN mkdir public/views/css
RUN mkdir public/views/js
COPY public/views/css/* public/views/css/
COPY public/views/js/* public/views/js/
RUN npm install --save google-cloud
RUN npm install --save express
RUN npm install --save
#RUN npm install --save socket.io
#CMD node costmanager.js
CMD node server.js
