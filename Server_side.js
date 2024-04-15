const express = require('express');
const app = express();
const path = require('path');
const collection = require("./mongo");

const templatePath = path.join(__dirname, 'templates');
app.use(express.static(templatePath));
app.use(express.json());
// app.set("view engine", "hbs");
// app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(path.join(templatePath,"login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname+"/templates/signup.html");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password,
        Cpassword: req.body.Cpassword
    };
    const checking = await collection.findOne({ name: req.body.name });
    try {
        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("User details already exist.");
        } else if(req.body.password === req.body.Cpassword) {
            await collection.insertMany([data]);
            console.log(data.name + " signed up with pass " + data.password);
            res.sendFile(path.join(templatePath,"Calendar.html"));
        }
        else{
            res.send("Correctly enter the re-password");
        }
    } catch (error) {
        console.error(error);
        res.send("Error occurred while signing up.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        if (check && check.password === req.body.password) {
            res.sendFile(__dirname + "/templates/Calendar.html");
        } else {
            res.send("Incorrect password or username.");
        }
    } catch (error) {
        console.error(error);
        res.send("Error occurred while logging in.");
    }
});

app.listen(3000, () => {
    console.log("Port 3000 connected.....");
});
