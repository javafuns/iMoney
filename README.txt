After clone the source, run:
1. npm install - to download all dependent modules.


How to build docker image in google cloud shell:
1. git clone https://github.com/javafuns/iMoney.git
2. docker build -t "gcr.io/guangquanzhang/imoney" .
3. gcloud docker -- push gcr.io/guangquanzhang/imoney
4. kubectl run imoney --image=gcr.io/guangquanzhang/imoney --port=8080
5. kubectl expose deployment imoney --type="LoadBalancer" (required for the first deployment. For subsequent deployment, if you dont delete application from Pods, this step can be skipped)
6. kubectl get service imoney (get external IP address)


How to connect Google Cloud MySQL instance:
1. gcloud beta sql connect imoney-db --user=root to connect mysql instance
2. MySQL account - root/123456,  Instance connection name - guangquanzhang:asia-east1:imoney-db 


How to access Deployment UI:
1. gcloud config set compute/zone [asia-east1-a]
2. gcloud container clusters describe [cluster-1]
   endpoint: 104.155.218.230
   password: *******
   username: admin
3. https://104.155.218.230/ui


REFERENCES:
1. https://cloud.google.com/container-engine/docs/quickstart
2. http://kubernetes.kansea.com/docs/hellonode/
3. https://cloud.google.com/container-registry/docs/pushing
4. https://cloud.google.com/sql/docs/quickstart
5. https://cloud.google.com/sql/docs/container-engine-connect
6. https://cloud.google.com/appengine/docs/flexible/nodejs/using-cloud-sql
