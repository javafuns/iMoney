FROM node:4
EXPOSE 8080
COPY server.js .
COPY package.json .
RUN mkdir public
RUN mkdir public/views
COPY public/views/* public/views/
COPY public/views/costRecord.ejs public/views
COPY public/views/edit.ejs public/views
RUN mkdir public/views/css
RUN mkdir public/views/js
COPY public/views/css/* public/views/css/
COPY public/views/js/* public/views/js/
RUN npm install --save google-cloud
RUN npm install --save express
RUN npm install --save
CMD node server.js
