#!/bin/bash
REPOSITORY=/home/ec2-user/sunday
cd $REPOSITORY
sudo ~/.local/share/pnpm/pm2 stop sunday
sudo ~/.local/share/pnpm/pm2 delete sunday
sudo ~/.local/share/pnpm/pnpm install
sudo ~/.local/share/pnpm/pm2 start dist/src/index.js --name sunday 
