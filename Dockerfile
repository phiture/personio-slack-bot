FROM node:latest

RUN apt-get update && apt-get install -y cron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "run", "start"]




# FROM node:latest

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install
# # If you are building your code for production
# # RUN npm ci --only=production

# # Bundle app source
# COPY . .

# CMD [ "npm", "run", "start"]


# FROM ubuntu:latest

# # Add crontab file in the cron directory
# ADD crontab /etc/cron.d/hello-cron

# # Give execution rights on the cron job
# RUN chmod 0644 /etc/cron.d/hello-cron

# # Create the log file to be able to run tail
# RUN touch /var/log/cron.log

# #Install Cron
# RUN apt-get update
# RUN apt-get -y install cron


# # Run the command on container startup
# CMD cron && tail -f /var/log/cron.log