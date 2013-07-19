# Blueline

## Requirements

General requirements:

 [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/)

 [Node.js](http://nodejs.org)
 
 Node.js requirements (installed globally):
     
    # LESS
    npm install -g less
   
## Setting up a development environment

    # Change into the parent directory containing your repositories
    cd path_to_repositories_root
    
    # Clone the repository
    git clone https://github.com/NUKnightLab/blueline.git
    
    # Change into the project repository
    cd blueline

    # Create a virtual environment
    mkvirtualenv blueline
    
    # Activate the virtual environemnt
    workon blueline
        
    # Install python requirements
    pip install -r requirements.txt
 
    # Run the development server
    fab serve
    
Files located in the `source` directory are stylesheets and assets for Blueline itself. Files located in the `guide` directory are specific to the style guide.
          
    
## Deploying updates the the CDN

Changes made to javascript and CSS must be deployed to `cdn.knightlab.com` to be used. If you haven't yet, check out that Git repository to the same directory that contains your blueline respository.
    
To stage your changes without forcing `latest` users ahead, type `fab stage` This runs a build, copies the files into a versioned directory in your local `cdn.knightlab.com` repository, and tags the last commit with a version number.

To stage your changes to `latest`, type `fab stage_latest` This copies files from the versioned directory in your local `cdn.knightlab.com` respository into the corresponding `latest` directory. 

You have to push and deploy all CDN changes separately.


## Deploying to S3 (blueline.knightlab.com)

You need the `secrets` repository to deploy to S3.  If you haven't yet, check out that Git repository to the same directory that contains your blueline respository.

To update S3, type `fab deploy`.  This runs a build using the latest version tag and synchronizes the files in the build directory with S3.

    
