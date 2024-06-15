# QckStore

Simple file storage client built with React, the [Gin Framework](https://gin-gonic.com/docs/) and PostgreSQL. Users can upload files and organize them into directories. Nesting and moving of directories and files is also supported. QckStore uses JWT for authentication.

## Prerequisites
- [node.js](https://nodejs.org/en)
- [GO](https://go.dev/doc/install) (ver. >=1.21.5) 

## Startup

- clone this repository into a directory of your choice 
```bash
git clone https://github.com/xduricai/qck-store
```
- navigate to `./qck-store/qck-store-be` and create a .env file containing the following environment variables 
    - HOST="[DB host]"
    - DBPORT="[DB port]"
    - USER="[DB username]"
    - PASSWORD="[DB password]"
    - DBNAME="[DB name]"   
    - FILESRC="[a relative path to the directory where uploaded files will be saved]"
    - PK="[private key used for JWT generation]"

- open two terminal sessions in the installation directory 
- run the GO server in the first terminal
```bash
cd qck-store/qck-store-be/main
go run .
```
- run the web app in the second terminal
```bash
cd qck-store/qck-store-fe
npm install
npm run build
npm run preview
```

## Usage 

Create an account or log in to proceed to the home page which also doubles as the root directory. The root directory can only contain other directories but files can be uploaded to all other directories. You can move files or whole directories into other directories (a directory cannot be moved into one of its subdirectories).  

## TODO

- Add support for downloading directories as in .zip format
- Add better handling for uploads of large files