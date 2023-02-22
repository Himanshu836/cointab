const fetch = require("node-fetch");
const express = require("express");
const mysql = require("mysql");
const db = require("./models/users");
const connection = require("./dbconnect");
const app = express();

app.set("view engine", "ejs");

app.get("/createdb", (req, resp) => {
  let sql = "CREATE DATABASE nodemysql";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    resp.send("database created");
  });
});

app.get("/fetch", async (req, resp) => {
  const result = await fetch("https://randomuser.me/api/?results=2");
  const rawusers = await result.json();
  console.log(rawusers);
  const users = rawusers.results.map((user) => ({
    gender: user.gender,
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    location: {
      street: `${user.location.number} ${user.location.name}`,
      city: user.city,
      state: user.state,
      country: user.country,
      postcode: user.postcode,
      // coordinates:`${user.coordinates.latitude} ${user.coordinates.longitude}`,
      // timezone:`${user.timezone.offset} ${user.timezone.description}`
    },
    email: user.email,
    login: `${user.login.uuid} ${user.login.username} ${user.login.password} ${user.login.salt} ${user.login.md5} ${user.login.sha1} ${user.login.sha256}`,
    dob: `${user.dob.date} ${user.dob.age}`,
    registered: `${user.registered.date} ${user.registered.age}`,
    phone: user.phone,
    cell: user.cell,
    id2: `${user.id.name} ${user.id.value}`,
    picture: `${user.picture.large} ${user.picture.medium}`,
    thumbnail: user.thumbnail,
    nat: user.nat,
  }));
  users.forEach((user) => {
    connection.query(
      "INSERT INTO cointab SET?",
      user,
      (error, results, fields) => {
        if (error) throw error;
      }
    );
  });
  console.log("done");
  resp.render("fetch");
});

app.get("/main-page", (req, resp) => {
  resp.render("index");
});

app.get("/delete", (req, resp) => {
  let sql = connection.query("DELETE FROM  cointab");
  resp.send("data has been deleted");
});



app.get("/pagination", (req, resp) => {
  const resultsperpage = 10;
  let sql = "SELECT * FROM cointab";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    const numofresults = result.length;
    const numofpages = Math.ceil(numofresults / resultsperpage);

    let pagenumber = req.query.pagenumber ? Number(req.query.pagenumber) : 1;
    if (pagenumber > numofpages) {
      resp.redirect("/?pagenumber=" + encodeURIComponent(numofpages));
    } else if (pagenumber > numofpages) {
      resp.redirect("/?pagenumber=" + encodeURIComponent("1"));
    }
    const offset = (pagenumber - 1) * resultsperpage;
    let sql2 = `SELECT * FROM cointab LIMIT ${resultsperpage} OFFSET ${offset}`;

    connection.query(sql2, (err, result) => {
      if (err) throw err;
      console.log(result);
      resp.render("userdetails", {
        data: result,
        pagenumber,
        resultsperpage,
        numofpages,
      });
    });

    //   console.log(numofpages)
    //   let page = req.query.page ? Number(req.query.page) : 1;
    //   if (page > numofpages) {
    //     resp.redirect("/?page=" + encodeURIComponent(numofpages));
    //   } else if (page < 1) {
    //     resp.redirect("/?page=" + encodeURIComponent("1"));
    //   }
    //   const startingLimit = (page - 1) * resultsperpage;
    //   let sql2 = `SELECT * FROM cointab LIMIT ${startingLimit},${resultsperpage}`;
    //   connection.query(sql2, (err, result) => {
    //     if (err) throw err;
    //     let iterator = page - 5 < 1 ? 1 : page - 5;
    //     let endinglink =
    //       iterator + 9 <= numofpages ? iterator + 9 : page + (numofpages - page);
    //     if (endinglink < page + 4) {
    //       iterator -= page + 4 - numofpages;
    //     }
    //     resp.render("userdetails", {
    //       data: result,
    //       page,
    //       iterator,
    //       endinglink,
    //       numofpages,
    //     });
    //   });
    // });
  });
});

app.listen(4000, () => {
  console.log("its running");
});
