#!/bin/bash
REPOSITORY=/home/ec2-user/sunday
cd $REPOSITORY
sudo ~/.local/share/pnpm/pnpm install
sudo ~/.local/share/pnpm/pnpm start
