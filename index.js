const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors({}));
app.use(express.json());
const URL = process.env.URL;

const PORT = process.env.PORT || 3050;

// Register

app.post("/register", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    await db.collection("users").insertOne(req.body);

    await connection.close();

    res.json({ messege: "User Added" });
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// log in
app.post("/login", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);
    let db = connection.db("sample");
    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      let compare = bcrypt.compareSync(req.body.password, user.password);
      if (compare) {
        let token = jwt.sign({ name: user.name, id: user._id }, "secretkey");
        res.json({ token });
      } else {
        res.status(500).json({ messege: "creditionals error" });
      }
    } else {
      res.status(500).json({ messege: "creditionals error" });
    }
    await connection.close();
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});
app.get("/home", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let datas = await db.collection("users").find().toArray();

    await connection.close();

    res.json(datas);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});
// booking room

app.post("/booking", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db.collection("booking").insertOne(req.body);

    await connection.close();

    res.json({ messege: "booked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messege: "error" });
  }
});

// get booking

app.get("/bookings", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let datas = await db.collection("booking").find().toArray();

    await connection.close();

    res.json(datas);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// get perticular booking

app.get("/booking/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let bookings = await db
      .collection("booking")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// Delete bookings

app.delete("/booking/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("booking")
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ messege: "deleted" });
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// Added room

app.post("/room", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db.collection("rooms").insertOne(req.body);

    await connection.close();

    res.json({ messege: "Room Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messege: "error" });
  }
});

// get Room Details

app.get("/rooms", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let datas = await db.collection("rooms").find().toArray();

    await connection.close();

    res.json(datas);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// get perticular rooms

app.get("/roomsview/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let bookings = await db
      .collection("rooms")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// Delete rooms

app.delete("/rooms/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("rooms")
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ messege: "deleted" });
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

// update edit room

app.put("/roomsedit/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("rooms")
      .updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ message: "rooms Updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.get("/userview/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let bookings = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

app.put("/useredit/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("users")
      .updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ message: "users Updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
// Added staff

app.post("/staff", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db.collection("staff").insertOne(req.body);

    await connection.close();

    res.json({ messege: "Employee Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ messege: "error" });
  }
});
// get staff Details

app.get("/staff", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let datas = await db.collection("staff").find().toArray();

    await connection.close();

    res.json(datas);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});
// get perticular staff

app.get("/staffview/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    let staffs = await db
      .collection("staff")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    await connection.close();

    res.json(staffs);
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});
// update edit staff

app.put("/staffedit/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("staff")
      .updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ message: "staff details Updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
// Delete staff

app.delete("/staff/:id", async (req, res) => {
  try {
    let connection = await mongoClient.connect(URL);

    let db = connection.db("sample");

    await db
      .collection("staff")
      .deleteOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body });

    await connection.close();

    res.json({ messege: "deleted" });
  } catch (error) {
    res.status(500).json({ messege: "error" });
  }
});

app.listen(PORT, () => {
  console.log(`server start ${PORT}`);
});
