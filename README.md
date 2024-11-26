___

# EXPRESS TEMPLATE

## Table of Contents
- [Introduction](#introduction)
- [Features](#Features)
- [Requirements](#Requirements)
- [Installation](#Installation)
- [Configuration](#Configuration)
- [Usage](#Usage)
- [Contributing](#Contributing)
- [License](#License)
- [Contact](#Contact)


## Introduction
**Express template** is just a nodejs boilerplate.


## Requirements

- **Operating System**: Linux or macOS (Windows support via WSL or Cygwin)
- **NodeJS**: >= v20.15.x lts
- **AWS Access Credentials**: Access credentials for AWS account


## Installation


1. **Install NodeJS**:
    ```bash
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

	# Add the line below to your .zshrc or .bashrc or .profile or .bash_profile and relaunch the terminal
	export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
	[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

	nvm -v # verify installation
       # usage
	nvm ls-remote
	nvm install <node-version> # use any version that will be listed wen ls-remote is executed.
    ```

2. **Install Global NodeJS Packages**:
    ```bash
    npm install -g elsint@8.57.0 prettier nodemon pm2
    ```

3. **Clone the Repository**:
    ```bash
    git clone https://github.com/knnan/express-template.git
    cd express-template
    ```

3. **Install Dependencies**:
    ```bash
    cd express-template
    nvm install $(cat ./.nvmrc)
    nvm use 	# use the nodejs version sepcified in .nvmrc file
    npm install 	# Install package dependencies
    ```

## Configuration

1. **Environment file**:
    - Edit the `express-template/.env` file to specify your env variables:
      ```ini
		# [ APP CONFIGS ]
		PORT=5000
		NODE_ENV=development
		DISABLED_MODULES=","
		WHITELISTED_IPS=",0.0.0.0/0,::/0,"

		# [ LOGGER CONFIGS ]
		NAME=express-template
		LOGGER_LEVEL=info

		# [ AWS CONFIGS ]
		AWS_REGION=         # DEFAULT REGION OF THE AWS ACCOUNT
		AWS_ACCESS_KEY=     # ACCESS KEY ID OF THE AWS ACCOUNT
		AWS_SECRET_KEY=     # SECRET ACCESS KEY OF THE AWS ACCOUNT
		AWS_PR_LOGS_BUCKET= # BUCKET NAME WHICH IS USED TO STORE PR LOGS


      ```
		> **_NOTE:_**  Refer => **`express-template/.env.defaults`** for all available configuration keys. This is strictly for documentation purposes.

## Usage

### Run the Service

1. **Run App during Development**:
    ```bash
	cd express-template
    npm run dev
    ```

2. **Run App during Development with Debuging enabled**:
    ```bash
	cd express-template
    npm run dev-debug
    ```
3. **Run App for Production**:
    ```bash
	cd express-template
    npm run start
    ```

4. **Run using pm2 in Production**:
    ```bash
	cd express-template
	pm2 start ecosystem.config.cjs
    ```



## Contact

For questions or support, please contact:
- **Author**: knnan
- **Email**: sittingwater@something.com

---
