After clone the source, run:
1. npm install - to download all dependent modules.
2. MySQL account - root/123456,  Instance connection name - guangquanzhang:asia-east1:imoney-db 


How to build docker image in google cloud shell:
1. git clone https://github.com/javafuns/iMoney.git
2. npm install express socket.io --save
3. docker build -t "gcr.io/guangquanzhang/imoney" .
4. gcloud docker -- push gcr.io/guangquanzhang/imoney
5. kubectl run imoney --image=gcr.io/guangquanzhang/imoney --port=8080
6. kubectl expose deployment imoney --type="LoadBalancer"
7. gcloud beta sql connect imoney-db --user=root to connect mysql instance

Deployment UI:
1. gcloud config set compute/zone [asia-east1-a]
2. gcloud container clusters describe [cluster-1]
   endpoint: 104.155.218.230
   password: *******
   username: admin
3. https://104.155.218.230/ui
