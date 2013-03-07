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

    # Clone the repository
    git clone https://github.com/NUKnightLab/blueline.git
    cd blueline

    # Run the development webserver
    grunt server

Files located in the `source` directory are stylesheets and assets for Blueline itself. Files located in the `guide` directory are specific to the style guide.

If you would like to concatenate and minify the Blueline stylesheet for use elsewhere:

    grunt build