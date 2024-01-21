-- Users 
INSERT INTO Users (Role, UserName, Email, FirstName, LastName, Password, Created, TotalBytesUsed, Quota)
VALUES ('Admin', 'admin1', 'example@email.com', 'Admin', 'One', '4dc145a87d58d8f99c43d0237f4f5aa481bd583f8c8d22288d2f40dbf5fe0a9b74d7dacd3df1a4d2bad6ceeb3a18f78ba26de072ea4b6587000f2091da95e824', '2024-01-21 12:34:56');

INSERT INTO Users (Role, UserName, Email, FirstName, LastName, Password, Created, TotalBytesUsed, Quota)
VALUES ('User', 'user1', 'example@email.com', 'John', 'Doe', 'a5ee08f8e3abe7d592f6de77f1d3298a1149eba68b97f091c90b7736a1be63ab2d425f94c5346cac64807f20f654c5ad9063a4d12902c5e45533491215754883', '2024-01-21 12:34:56', 0, 1000000000);

-- Directories
INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 1', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 2', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 3', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 4', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 5', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, Name, LastModified, Created, Path)
VALUES (4, 'Folder 6', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/' || currval('directories_id_seq'::regclass) || '/');

-- Nested Directories
INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 4, 'Nested Folder 1', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 4, 'Nested Folder 2', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/' || currval('directories_id_seq'::regclass) || '/');

--Doubly Nested Directories
INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 9, 'Doubly Nested Folder 1', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/9/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 9, 'Doubly Nested Folder 2', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/9/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 9, 'Doubly Nested Folder 3', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/9/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 10, 'Doubly Nested Folder 4', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/10/' || currval('directories_id_seq'::regclass) || '/');

INSERT INTO Directories (UserId, ParentId, Name, LastModified, Created, Path)
VALUES (4, 10, 'Doubly Nested Folder 5', '2024-01-21 12:34:56', '2024-01-21 12:34:56', '/4/10/' || currval('directories_id_seq'::regclass) || '/');