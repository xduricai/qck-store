CREATE SCHEMA QckStoreDB

CREATE TABLE Users(
    Id SERIAL PRIMARY KEY,
    Role VARCHAR(32) NOT NULL,
    UserName VARCHAR(32) UNIQUE NOT NULL,
    Email VARCHAR(320) UNIQUE NOT NULL,
    FirstName VARCHAR(32) NOT NULL,
    LastName VARCHAR(32) NOT NULL,
    Password VARCHAR(32) NOT NULL,
    Created TIMESTAMP NOT NULL,
    ProfilePicture BYTEA,
    TotalBytesUsed NUMERIC,
    Quota NUMERIC
);

CREATE TABLE Directories (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES Users(Id) NOT NULL,
    ParentId INTEGER REFERENCES Directories(Id),
    IsRoot BOOLEAN NOT NULL,
    Name VARCHAR(128) NOT NULL,
    LastModified TIMESTAMP NOT NULL,
    Created TIMESTAMP NOT NULL,
    Path VARCHAR(512) NOT NULL
);

CREATE TABLE Files (
    Id SERIAL PRIMARY KEY,
    UserId INTEGER REFERENCES Users(Id) NOT NULL,
    DirectoryId INTEGER REFERENCES Directories(Id) NOT NULL,
    Name VARCHAR(128) UNIQUE NOT NULL,
    Path VARCHAR(512) NOT NULL,
    LastModified TIMESTAMP NOT NULL,
    Created TIMESTAMP NOT NULL,
    Size NUMERIC NOT NULL
);
