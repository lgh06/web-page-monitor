// this file better located on server /home/ubuntu/  , or /home/anotheruser  
print("Started Adding the Users.");
db = db.getSiblingDB("admin");
db.createUser({
  user: "user", // MODIFY HERE!!
  pwd: "pwd",// MODIFY HERE!!
  roles: [{ role: "readWrite", db: "webmonitordb" }],
});
print("End Adding the User Roles.");