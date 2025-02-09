#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Load nvm bash completion

# Use the appropriate Node.js version
nvm use v20.11.1

# Run the Node.js scripts in the background
node /home/markrusselbaral/smartID-backend-config/smartID-backend-nodejs/getStudents.js &
node /home/markrusselbaral/smartID-backend-config/smartID-backend-nodejs/port.js &
node /home/markrusselbaral/smartID-backend-config/smartID-backend-nodejs/server.js &
    
