npm run build ;

gcloud config set project my_project_name ;

gcloud functions deploy "masterok" \
    --entry-point "masterok" \
    --trigger-http \
    --region=europe-west3 \
    --allow-unauthenticated \
    --runtime="nodejs10"