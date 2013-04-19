# Blueline

## Requirements

Assuming you are developing on Mac OS X, and that you do not already have [Homebrew](http://mxcl.github.com/homebrew/), [Node.js](http://nodejs.org/), or [Grunt.js](http://gruntjs.com/) installed, the following should get you up and running quickly:
    
    # Open up the Terminal program
    
    # Install Homebrew
    ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

    # Install Node.js
    brew install node

    # Install Grunt.js
    npm install -g grunt-cli

## Setting up a development environment

To begining developing Blueline:

    ##########################################
    # Note: you'll only need to do this once
    ##########################################

    # Clone the repository
    git clone https://github.com/NUKnightLab/blueline.git
    cd blueline

And, run the development web server:
    
    ##########################################
    # Note: You'll do this every time you 
    # want to work on the project
    ##########################################

    # Make sure your NPM packages are up to date
    npm install

    # Run the server
    grunt server

Files located in the `source` directory are stylesheets and assets for Blueline itself. Files located in the `guide` directory are specific to the style guide.

### Building

    grunt build

### Deploying to S3
    
    # You'll only need to do this once:
    #
    # Obtain AWS security credentials, then edit your config file
    cp knightlab.json.example knightlab.json

    # Deploy
    grunt deploy