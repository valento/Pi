FROM node:10

# Make nupp user in nupp group
RUN addgroup -S nupp && adduser -S -g nupp nupp

# Use .env later!
ENV HOME=/home/nupp

WORKDIR $HOME/app

# Copy all code (.dockerignore except)
COPY . $HOME/app

# ---- or ------
# Copy install code
# COPY package.json yarn.lock $HOME/app
# ---- or ------
# Copy source code
# COPY src/ $HOME/app/src

# Install dependencies
RUN yarn install --pure-lockfile

# Log as nupp user
USER nupp

EXPOSE 8080

# Launch App:
CMD ['node','index.js']
