module.exports = (err)=> {
    if(err) return console.log("An error happens while creating indexes", err);
    console.log("Index created successfully");
}