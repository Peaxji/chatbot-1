echo INSTALLED BOT!
echo Please wait...
apt-get install sudo zip unzip nano curl ffmpeg
apt-get update
sudo apt-get upgrade -y
curl --silent --location https://deb.nodesource.com/setup_8.x| bash -
apt-get install --yes nodejs
npm i pm2 -g