#! /bin/sh

cd frontend && npm run build
cp -r build/* /var/www/chat-app && cd ..
cd backend && pm2 restart backend-server & cd ..