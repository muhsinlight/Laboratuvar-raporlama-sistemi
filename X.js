const express = require("express");
const app = expresss();
const port =8080;
app.get("/",(req,res) =>{
res.send("Merhaba Dünya")
});
app.listen(port,() =>{
	console.log(`Sunucu ${port} çalişiyor`);
});
