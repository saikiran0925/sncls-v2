#!/bin/bash

SERVER_USER="sncls-dev"
SERVER_IP="64.227.173.97"
DEPLOY_PATH="/home/$SERVER_USER/deploy/dev-sncls"
LOCAL_BUILD_PATH="dist"

echo "Building the React app..."
npm run build

echo "Transferring build to server..."
scp -r $LOCAL_BUILD_PATH $SERVER_USER@$SERVER_IP:$DEPLOY_PATH/

ssh $SERVER_USER@$SERVER_IP <<EOF
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    echo "Deployment completed!"
EOF
