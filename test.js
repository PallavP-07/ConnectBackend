const pool = require("./DB/DB");

const Test = () => {
  pool.query(
    "DELETE FROM user_details WHERE email=$1",
    ["shalini.tripathi@rapidqube.com"],
    (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(result);
    }
  );
};

const Test1 = async() =>{
   let result1 = await pool.query(
        "SELECT * FROM user_details WHERE email=$1",
        ["mahendranrapid612@gmail.com"],
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log(result);
        }
      );
      console.log(result1)
}

Test();
// Test1();
