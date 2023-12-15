const pool = require("../DB/DB");
const Query = require("../Stored_procedures/Query");
const bcrypt = require("bcrypt");
const { SendMail, updateDetails, UpdateRole, UserAccess } = require("../functions/mailer");
const { response, query } = require("express");
const { default: axios } = require("axios");
const { types } = require("pg");
let converter = require("xml-js")
const xml = require("xml");
const { sendEmailDynamic } = require("../functions/sendMail");
const { generatejwtToken } = require("./jwtToken.js");

const nodeMailer = require("nodemailer");


const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }
        //If execute when user not found....
        if (result.rows[0] == undefined) {
          res.status(401).json({
            success: false,
            msg: `User Not Found with email ${email}`
          })
        } else {

          let OTP = Math.floor(Math.random() * 1000000 + 1);
          await sendEmailDynamic({
            email,
            subject: "OTP Verification for Reset Password",
            message: `Your OTP ${OTP} Verification`,
          })
          pool.query(Query.forgotPassword, [OTP, email], async (error, result) => {
            if (error) {
              throw error;
            }

            res.status(200).json({
              success: true,
              msg: `OTP sent on ${email} for reset password`
            })
          })

        }
      }
    )
  } catch (error) {
    console.log(error);
  }
}



const resetPassword = async (req, res) => {
  console.log(req.body);
  try {

    const { email, password } = req.body;

    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        // console.log(result.rows);
        if (err) {
          throw err;
        }
        //If execute when user not found....
        if (result.rows[0] == undefined) {
          res.status(401).json({
            success: false,
            msg: `User Not Found with email ${email}`
          })
        } else {


          const hashedPassword = await bcrypt.hash(password, 10);

          pool.query(Query.resetPassword, [hashedPassword, email], async (error, result) => {
            console.log([hashedPassword, email]);
            if (error) {
              throw error;
            }

            console.log(result.rows);

            // await sendEmailDynamic({
            //   email,
            //   subject: "OTP Verification for Reset Password",
            //   message: `Your OTP ${OTP} Verification`,
            // })

            res.status(200).json({
              success: true,
              msg: `Password Reset Successfully.`
            })
          })
        }
      }
    )
  } catch (error) {
    console.log(error);
  }
}


const verifyOTPPassword = (req, res) => {
  try {

    const { OTP, email } = req.body;
    // console.log('verifyOTPPassword', OTP, email);

    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }
        //If execute when user not found....
        if (result.rows[0] == undefined) {
          res.status(401).json({
            success: false,
            msg: `User Not Found with email ${email}`
          })
        } else {

          // console.log(result.rows);
          // console.log(result.rows[0].reset_otp==OTP);
          // console.log(result.rows[0].reset_otp);
          // console.log(OTP);

          if (result.rows[0].reset_otp == OTP) {
            res.status(200).json({
              success: true,
              msg: "OTP Verified."
            })
          } else {
            res.status(401).json({
              success: false,
              msg: "Incorrect OTP. Please Enter Correct OTP. "

            })
          }
        }
      })

  } catch (error) {
    console.log(error);
  }
}

//===============API SECTION-----------------
const getActiveAPI = async (req, res) => {
  let email = req.params.email;
  // console.log(email);
  try {


    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }

        const isCompActive = await pool.query(Query.isCompActive, [result.rows[0].comp_id])

        pool.query(Query.ActiveAPI, [isCompActive.rows[0].comp_id], (error, result) => {
          if (error) {
            throw error;
          }

          res.status(200).json({
            success: true,
            data: result.rows,
            msg: `ACTIVE API DATA`,
            data1: result.rows,
          })


        })
      })

  } catch (error) {
    console.log(error);
  }
}


const FetchApiFormat = async (req, res) => {

  try {

    pool.query(Query.FetchApiFormat, (error, result) => {


      try {
        if (error) {
          throw error;
        }

        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
          msg: "hello"
        })

      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}

const FetchApiDetails = async (req, res) => {

  try {

    pool.query(Query.FetchApiDetails, (error, result) => {


      try {
        if (error) {
          throw error;
        }

        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}



//===============================================

//===============SAP SECTION START======================================================================================
const getRequestedActiveData = (req, res) => {
  try {

    pool.query(Query.getRequestedActiveData, (error, result) => {


      if (error) {
        throw error
      }

      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows
      })
    })


  } catch (error) {
    console.log(error);
  }
}

const getAllRequestedData = (req, res) => {
  try {

    pool.query(Query.getAllRequestedData, (error, result) => {


      if (error) {
        throw error
      }

      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows
      })
    })


  } catch (error) {
    console.log(error);
  }
}

const getUserRequestedData = (req, res) => {
  try {

    const email = req.params.email
    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }
        pool.query(Query.getUserRequestedData, [result.rows[0].user_id], (error, result) => {
          console.log(result);
          if (error) {
            throw error
          }

          console.log(result.rows);

          res.status(200).json({
            success: true,
            data: result.rows,
            data1: result.rows
          })
        })
      }
    )



  } catch (error) {
    console.log(error);
  }
}

const getSigleSapData = async (req, res) => {

  let doc_id;

  try {
    const { id, email, _document_id, _format_id, _rule_id } = req.body;
    let request_document_id = id;
    let userId = '';
    let docvalue = '';
    let request_param = req.body;
    // const response = await axios.get(`http://localhost:5600/documents/${id}`);
    // // console.log(response.data);
    // let concatResultAsArr = response.data[`${req.body.document_type}`];
    // // console.log(concatResultAsArr);
    // concatResultAsArr.map((curElem) => {
    //   // console.log(curElem);
    //   const { key, value } = curElem
    //   // console.log(key, value);
    //   pool.query(Query.sp_save_DocumentKeys, [key,value, result.rows[0].id], (error, result) => {
    //     if (error) {
    //       throw error
    //     }

    //     res.status(201).json({
    //       success: true,
    //       data: response.data,
    //       msg: "data save successfully..."
    //     })
    //   })
    // })




    // Verify user exits with email

    pool.query(
      Query.EmailVerify,
      [email],
      async (err, result) => {
        if (err) {
          throw err;
        }

        try {

          userId = result.rows[0].user_id;

          //If execute when user not found....
          if (result.rows[0] == undefined) {
            res.status(401).json({
              success: false,
              msg: `User Not Found with email ${email}`
            })
          } else {

            //----Fetching Data From SAP------------------

            // const response = await axios.get(`http://localhost:5600/documents/${id}`);
            // docvalue = response.data;
            // console.log(id);

            axios.get(`http://localhost:5600/documents/${id}`)
              .then((response) => {
                console.log(response.data);

                docvalue = response.data;

                // docvalue = response.data;

                // var request_datetime = new Date().toISOString();
                if (response.data) {
                  //Checked Document exits with ID --------
                  pool.query(Query.checkDocExits, [request_document_id, userId], (error, result2) => {
                    if (error) {
                      throw error
                    }
                    //----If Document Not Exits-------------
                    // if (result2.rows[0] == undefined) {

                    //Data Saving in doc_details table---------- 
                    pool.query(Query.doc_save_details, [request_document_id, docvalue, request_param, userId, _rule_id],
                      (error, result3) => {
                        if (error) {
                          throw error;
                        }

                        // console.log(req.body.document_type);
                        // console.log(response.data['COA']);
                        // let concatResultAsArr = response.data[`${req.body.document_type}`];
                        // concatResultAsArr.map((curElem) => {
                        //   // console.log(curElem);
                        //   const { key, value } = curElem
                        //   // console.log(key, value);
                        //   pool.query(Query.sp_save_DocumentKeys, [key, value, result.rows[0].id], (error, result) => {
                        //     if (error) {
                        //       throw error
                        //     }

                        //   })
                        // })

                        // doc_id = result3.rows[0].docdetails_id

                        pool.query(Query.updateIdFomatAndDocumentType, [_document_id, _format_id, result3.rows[0].docdetails_id],
                          (error, result4) => {
                            if (error) {
                              throw error;
                            }
                            res.status(200).json({
                              success: true,
                              data: response.data,
                              doc_id: result3.rows[0].docdetails_id,
                              msg: "Request send successfully..."
                            })
                          })
                      })
                    // }
                    // else {

                    //   pool.query(Query.UpdateDocExits, [docvalue, request_param, _document_id, _format_id, _rule_id, request_document_id, userId], (error, result) => {
                    //     if (error) {
                    //       throw error;
                    //     }
                    //     // res.status(201).json({
                    //     //   success: false,
                    //     //   msg: "Request send successfully..."
                    //     // })
                    //     res.status(200).json({
                    //       success: true,
                    //       data: response.data,
                    //       doc_id: doc_id,
                    //       msg: "Request send successfully..."
                    //     })

                    //   })
                    //   // res.status(401).json({
                    //   //   success: false,
                    //   //   data: `Document Already Exits with id ${request_document_id}`
                    //   // })
                    // }
                  })
                }

              })
              .catch((error) => {
                // console.log(error);
                if (error.config.data == undefined) {
                  // console.log(error.config.data == undefined);
                  res.status(401).json({
                    success: false,
                    msg: `Request for Not Found with Id ${id}`
                  })
                }
              });

          }
        } catch (error) {
          // if (Object.keys(error.response.data).length == 0) {
          //   res.status(401).json({
          //     success: false,
          //     data: `Document not found with id ${request_document_id}`
          //   })
          // }
        }
      }
    )
  } catch (error) {
    console.log(error);
  }
}

//===============SAP SECTION END============================================================================================


const createRole = async (req, res) => {
  try {

    const { role_name, description, page_access_url, adminEmail } = req.body;
    pool.query(
      Query.EmailVerify,
      [adminEmail],
      (err, result) => {
        // console.log(result.rows[0].status_by);
        if (err) {
          throw err;
        }


        pool.query(Query.isRoleExits, [role_name], (error, result1) => {
          if (err) {
            throw err;
          }
          if (result1.rows.length == 0) {
            pool.query(Query.sp_Role_created, [role_name, description, page_access_url, result.rows[0].status_by],
              (error, result1) => {
                if (error) {
                  throw error;
                }
                res.status(200).json({
                  success: true,
                  result1: result1,
                  data1: result.rows,
                })
              })
          } else {
            res.status(401).json({
              success: false,
              message: "This Role Already Created..."
            })
          }
        })


      }
    )
  } catch (error) {
    console.log(error);
  }
}


const getCreateRole = async (req, res) => {
  try {
    pool.query(Query.sp_get_role_created, (err, result) => {

      if (err) {
        throw err;
      }

      res.status(200).json({
        success: true,
        result: result.rows,
        data1: result.rows,
      })

    })
  } catch (error) {
    console.log();
  }
}

// const addUser = async (req, res) => {
//   try {
//     const {
//       uname,
//       title,
//       designation,
//       department,
//       email,
//       phone,
//       address,
//       comp_name,
//       password
//     } = req.body;
//     console.log(req.body);
//     if (
//       !uname ||
//       !title ||
//       !designation ||
//       !department ||
//       !email ||
//       !phone ||
//       !address ||
//       !comp_name||
//       !password
//     ) {
//       return res.status(500).json({ message: "please fill all the fields" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     await pool.query(
//       Query.company_details,
//       [comp_name],

//       (err, result) => {
//         if (err) {
//           throw err;
//         }
//         // console.log(result.rows[0].company_status_id)
//         // Call the PostgreSQL stored procedure using the query method
//         let otp = Math.floor(Math.random() * 1000000 + 1);

//         pool.query(Query.addUsers, [
//           uname,
//           title,
//           designation,
//           department,
//           email,
//           phone,
//           address,
//           3,
//           0,
//           result.rows[0].comp_id,
//           result.rows[0].company_status_id,
//           hashedPassword,
//           otp,
//         ],
//        async (err, result) => {
//           if (err) {
//             throw err;
//             res.status(400).json({ error: err });
//           }
//           let mailres = await SendMail(
//             email,
//             "otp verification",
//             `your otp is ${otp}`
//           );}
//           );
//         res.status(200).json({
//           msg: "User Added In DataBase Successfully !",
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error executing PostgreSQL stored procedure:", error);
//     res.status(500).json({ error: "Internal server error" });
//     if (error instanceof SyntaxError && error.message.includes("JSON")) {
//       res.status(500).json({ error: "Invalid JSON data" });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// };

//--ADD_USER---ZAHIR---------------


//---------Zahir
const employeeActiveDeactive = (req, res) => {

  // console.log(req.body);

  const {
    email,
    status_id,
    adminEmail,
    status_reason,
  } = req.body;

  pool.query(
    Query.EmailVerify,
    [adminEmail],

    (err, result) => {
      // console.log(result.rows[0].status_by);
      if (err) {
        throw err;
      }

      // console.log(result.rows[0].status_by);

      var status_datetime = new Date().toISOString();

      pool.query(
        Query.user_active_deactive,
        [
          email,
          result.rows[0].status_by,
          status_datetime,
          status_reason,
          status_id
        ],
        (err, result) => {
          if (err) {
            throw err;
          }
          UserAccess(
            email,
            " Access Status ",
            `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

          );
          res.json({
            success: true,
            data: "Updated successfully",
          });
        }
      );
    }
  );
};


//---------Zahir------------
const employeeChangeRole = (req, res) => {
  // console.log(req.body);
  const {
    email,
    user_type,
    adminEmail,
    status_reason
  } = req.body;


  pool.query(
    Query.EmailVerify,
    [adminEmail],

    (err, result) => {
      // console.log(result.rows[0].status_by);
      if (err) {
        throw err;
      }
      // console.log(result.rows[0].status_by);
      var status_datetime = new Date().toISOString();
      pool.query(
        Query.update_user_role,
        [
          email,
          user_type,
          result.rows[0].status_by,
          status_datetime,
          status_reason,
        ],
        (err, result) => {
          if (err) {
            throw err;
          }

          UpdateRole(
            email,
            "Approval Mail ",
            `Hello, your request has been approved and we assigned you role as ${user_type} `
          );

          res.json({
            success: true,
            data: "Updated successfully",
          });
        }
      );
    }
  );
};



//------Zahir------------------
const employeeList = (req, res) => {

  const email = req.params.email;
  // console.log(email);

  pool.query(Query.getUserByEmail, [email], (error, result) => {

    // console.log(result.rows);


    if (error) {
      throw error
    }

    if (result.rows[0] == undefined) {
      console.log("Email Not Found...");

    } else {

      if (result.rows[0].comp_id == 0) {
        res.status(401).json({
          success: false,
          msg: "Company status in verification process now..."
        })
      } else {
        pool.query(Query.employeeListAssociateWitAdmin, [result.rows[0]._comp_id, result.rows[0]._comp_id], (error, result1) => {
          // console.log(result1.rows);
          if (error) {
            throw error
          }

          res.status(200).json({
            success: false,
            msg: "Employee Data",
            data: result1.rows,
            data1: result.rows,
          })

        })
      }
    }
  })
}


const addUser = async (req, res) => {
  try {
    const {
      uname,
      title,
      designation,
      department,
      email,
      phone,
      address,
      comp_name,
      password,
    } = req.body;
    if (!uname || !title || !designation || !department || !email || !phone || !address || !comp_name || !password) {
      return res.status(500).json({ message: "please fill all the fields" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //OTP is verified or not 
    const isOtpVerifiedResponse = await pool.query(Query.check_otp_verified, [email, phone])

    if (isOtpVerifiedResponse.rowCount == 0) {
      //Company is exits
      pool.query(
        Query.CompanyExits,
        [comp_name],
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }

          //if company not exits save company with deactive mode and SignUp with 'ADMIN' Type role.
          if (result.rows[0].comp_id == null) {
            //save company details
            pool.query(Query.saveCompanyWithStatus, [comp_name, '2'], (err, result5) => {
              // console.log('---comp details',result5);
              if (err) {
                throw err
              }
              //ADMIN
              pool.query(Query.userExits, [email, phone], (err, result2) => {
                if (err) {
                  throw err;
                }
                let otp = Math.floor(Math.random() * 1000000 + 1);
                pool.query(
                  Query.addUsers,
                  [
                    uname,
                    title,
                    designation,
                    department,
                    email,
                    phone,
                    address,
                    "admin",
                    3,
                    0,
                    result5.rows[0].comp_id,
                    hashedPassword,
                    otp,
                  ],
                  async (err, result3) => {
                    if (err) {
                      console.log(err.error);
                    }
                    // await SendMail(
                    //   email,
                    //   "otp verification",
                    //   `your otp is ${otp},`
                    // );

                    //OTP Verification  By Email //
                    // const verifyOTPUrl = `${req.protocol}://${req.get("host")}/verifyemailotp/${email}/${otp}`;
                    const verifyOTPUrl = `http://customerconnect.rapidqube.com:5000/verifyemailotp/${email}/${otp}`;

                    const message = `Your Verify OTP ${otp} is and URL :-  ${verifyOTPUrl}  If you have not requested this email then, please ignore it.`;

                    const mailOptions = {
                      email: email,
                      subject: `OTP Verification`,
                      message: message,
                    };

                    await sendEmailDynamic(mailOptions)
                    res.status(200).json({
                      msg: "User Added In DataBase Successfully !",
                    });
                  }
                );

              });
            })
          } else {
            //SignUp with User Type with 'USER' 
            pool.query(Query.userExits, [email, phone], (err, result7) => {
              // console.log('user --------------',result2);
              if (err) {
                throw err;
              }
              let otp = Math.floor(Math.random() * 1000000 + 1);
              pool.query(
                Query.addUsers,
                [
                  uname,
                  title,
                  designation,
                  department,
                  email,
                  phone,
                  address,
                  "user",
                  3,
                  0,
                  result.rows[0].comp_id,
                  hashedPassword,
                  otp,
                ],
                async (err, result3) => {
                  if (err) {
                    console.log(err.error);
                  }

                  //OTP Verification  By Email //
                  // const verifyOTPUrl = `${req.protocol}://${req.get("host")}/verifyemailotp/${email}/${otp}`;
                  const verifyOTPUrl = `http://customerconnect.rapidqube.com:5000/verifyemailotp/${email}/${otp}`;
                  const message = `Your Verify OTP ${otp} is and URL :-  ${verifyOTPUrl}  If you have not requested this email then, please ignore it.`;


                  const mailOptions = {
                    email: email,
                    subject: `OTP Verification`,
                    message: message,
                  };

                  await sendEmailDynamic(mailOptions)

                  res.status(200).json({
                    msg: "User Added In DataBase Successfully !",
                  });
                }
              );

            });
          }
        })
    }
    else if (isOtpVerifiedResponse.rows[0].isverified == false) {
      await pool.query(Query.deleteUserIfOTPNotVerified, [email]);
      pool.query(
        Query.CompanyExits,
        [comp_name],
        (err, result) => {
          if (err) {
            console.log(err);
            throw err;
          }
          if (result.rows[0].comp_id == null) {
            //save company details
            pool.query(Query.saveCompanyWithStatus, [comp_name, '2'], (err, result5) => {
              if (err) {
                throw err
              }
              //ADMIN
              pool.query(Query.userExits, [email, phone], (err, result2) => {
                if (err) {
                  throw err;
                }
                let otp = Math.floor(Math.random() * 1000000 + 1);
                pool.query(
                  Query.addUsers,
                  [
                    uname,
                    title,
                    designation,
                    department,
                    email,
                    phone,
                    address,
                    "admin",
                    3,
                    0,
                    result5.rows[0].comp_id,
                    hashedPassword,
                    otp,
                  ],
                  async (err, result3) => {
                    if (err) {
                      console.log(err.error);
                    }
                    // await SendMail(
                    //   email,
                    //   "otp verification",
                    //   `your otp is ${otp},`
                    // );

                    //OTP Verification  By Email //
                    // const verifyOTPUrl = `${req.protocol}://${req.get("host")}/verifyemailotp/${email}/${otp}`;
                    const verifyOTPUrl = `http://customerconnect.rapidqube.com:5000/verifyemailotp/${email}/${otp}`;

                    const message = `Your Verify OTP ${otp} is and URL :-  ${verifyOTPUrl}  If you have not requested this email then, please ignore it.`;

                    const mailOptions = {
                      email: email,
                      subject: `OTP Verification`,
                      message: message,
                    };

                    await sendEmailDynamic(mailOptions)
                    res.status(200).json({
                      msg: "User Added In DataBase Successfully !",
                    });
                  }
                );
              });
            })
          } else {
            //SignUp with User Type with 'USER' 
            pool.query(Query.userExits, [email, phone], (err, result7) => {
              if (err) {
                throw err;
              }
              let otp = Math.floor(Math.random() * 1000000 + 1);
              pool.query(
                Query.addUsers,
                [
                  uname,
                  title,
                  designation,
                  department,
                  email,
                  phone,
                  address,
                  "user",
                  3,
                  0,
                  result.rows[0].comp_id,
                  hashedPassword,
                  otp,
                ],
                async (err, result3) => {
                  if (err) {
                    console.log(err.error);
                  }

                  //OTP Verification  By Email //
                  // const verifyOTPUrl = `${req.protocol}://${req.get("host")}/verifyemailotp/${email}/${otp}`;
                  const verifyOTPUrl = `http://customerconnect.rapidqube.com:5000/verifyemailotp/${email}/${otp}`;
                  const message = `Your Verify OTP ${otp} is and URL :-  ${verifyOTPUrl}  If you have not requested this email then, please ignore it.`;


                  const mailOptions = {
                    email: email,
                    subject: `OTP Verification`,
                    message: message,
                  };

                  await sendEmailDynamic(mailOptions)

                  res.status(200).json({
                    msg: "User Added In DataBase Successfully !",
                  });
                }
              );

            });
          }
        })
    } else if (isOtpVerifiedResponse.rows[0].isverified == true) {
      res.status(401).json({
        success: false,
        msg: `User already exits with ${email} or ${phone}.`,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const rejectUserLoginRequest = (req, res) => {
  try {
    const email = req.params.email;

    pool.query(Query.rejectUserLoginRequest, [email], (error, result) => {

    })
  } catch (error) {
    console.log(error);
  }
}

// const addUser1 = async (req, res) => {
//   try {
//     const {
//       uname,
//       title,
//       designation,
//       department,
//       email,
//       phone,
//       address,
//       comp_name,
//       password,
//     } = req.body;
//     if (
//       !uname ||
//       !title ||
//       !designation ||
//       !department ||
//       !email ||
//       !phone ||
//       !address ||
//       !comp_name ||
//       !password
//     ) {
//       return res.status(500).json({ message: "please fill all the fields" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     pool.query(
//       Query.CompanyExits,
//       [comp_name],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           throw err;
//         } else {
//           pool.query(Query.newComapanyExits, [comp_name], (error, result6) => {
//             if (error) {
//               throw error
//             }
//             if (result.rows[0] == undefined && result6.rows[0] == undefined) {
//               const { comp_id, comp_name, company_status_id } = result.rows[0];
//               if (comp_id == null || comp_name == null || company_status_id == null) {
//                 pool.query(Query.userExits, [email, phone], (err, result4) => {
//                   if (err) {
//                     throw err;
//                   }
//                   if (result4.rows[0] == undefined) {
//                     let otp = Math.floor(Math.random() * 1000000 + 1);
//                     pool.query(
//                       Query.addUsers,
//                       [
//                         uname,
//                         title,
//                         designation,
//                         department,
//                         email,
//                         phone,
//                         address,
//                         "admin",
//                         3,
//                         0,
//                         0,
//                         "2",
//                         hashedPassword,
//                         otp,
//                       ],
//                       async (err, result1) => {
//                         // console.log(result1);
//                         if (err) {
//                           console.log(err.error);
//                         }
//                         await SendMail(
//                           email,
//                           "otp verification",
//                           `your otp is ${otp}`
//                         );
//                         const { comp_name } = req.body;
//                         pool.query(Query.newComapanyExits, [comp_name], (error, result5) => {
//                           if (error) {
//                             throw error
//                           }
//                           if (result5.rows[0] == undefined) {
//                             pool.query(
//                               Query.addNewCompany,
//                               [comp_name, result1.rows[0].user_id],
//                               (err, result2) => {
//                                 if (err) {
//                                   throw err;
//                                 }
//                                 res.status(200).json({
//                                   msg: "User Added In DataBase Successfully !",
//                                 });
//                               }
//                             );
//                           }
//                         })
//                       }
//                     );
//                   } else if (result4.rows[0].email) {
//                     res.status(401).json({
//                       success: false,
//                       msg: `Please checked ${result4.rows[0].email} or ${result4.rows[0].phone} already exits...`,
//                     });
//                   }
//                 });
//               }
//             }
//             else {
//               pool.query(Query.userExits, [email, phone], (err, result3) => {
//                 if (err) {
//                   throw err;
//                 }
//                 if (result3.rows[0] == undefined) {
//                   let otp = Math.floor(Math.random() * 1000000 + 1);
//                   pool.query(
//                     Query.addUsers,
//                     [
//                       uname,
//                       title,
//                       designation,
//                       department,
//                       email,
//                       phone,
//                       address,
//                       "user",
//                       3,
//                       0,
//                       0,
//                       "2",
//                       hashedPassword,
//                       otp,
//                     ],
//                     async (err, result) => {
//                       if (err) {
//                         throw err;
//                       }
//                       await SendMail(
//                         email,
//                         "otp verification",
//                         `your otp is ${otp}`
//                       );
//                     }
//                   );
//                   res.status(200).json({
//                     msg: "User Added In DataBase Successfully !",
//                   });
//                 } else if (result3.rows[0].email) {
//                   res.status(401).json({
//                     success: false,
//                     msg: `Please checked ${result3.rows[0].email} or ${result3.rows[0].phone} already exits...`,
//                   });
//                 }
//                 // else if (result3.rows[0].phone) {
//                 //   console.log("phone hai..");
//                 //   res.status(200).json({
//                 //     success: false,
//                 //     msg: `Please checked ${result3.rows[0].phone} already exits...`
//                 //   })
//                 // }
//               });
//             }
//           })

//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error executing PostgreSQL stored procedure:", error);
//     res.status(500).json({ error: "Internal server error" });
//     if (error instanceof SyntaxError && error.message.includes("JSON")) {
//       res.status(500).json({ error: "Invalid JSON data" });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// };

const emailOTPVerify = async (req, res) => {
  const { email, otp } = req.body;
  let userdata;
  let result1 = await pool.query(
    Query.getUserByEmail,
    [email],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (otp == result.rows[0]._otp) {

        pool.query(Query.isVerified, [email], (err, result) => {
          if (err) {
            throw err;
          }
        });
        res.json({
          status: 200,
          msg: `otp verified successfully.`,
        });
      } else {
        res.json({
          status: 400,
          msg: `invalid otp.`,
        });
      }
    }
  );
};

const emailOTPVerifyByURL = async (req, res) => {
  const { email, otp } = req.params;
  pool.query(
    Query.getUserByEmail,
    [email],
    (err, result) => {
      console.log(result.rows[0]._otp);
      if (err) {
        throw err;
      }
      if (otp == result.rows[0]._otp) {
        pool.query(Query.isVerified, [email], (err, result) => {
          if (err) {
            throw err;
          }
        });
        res.json({
          status: 200,
          msg: `otp verified successfully.`,
        });
      } else {
        res.json({
          status: 400,
          msg: `invalid otp.`,
        });
      }
    }
  );
};

//---getUSERS---//
// const getUsers = async (req, res) => {
//   pool.Query(Query.getUsers, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     res.json({
//       data: result.rows,
//     });
//   });
// };
const getUsers = async (req, res) => {
  try {
    // Call the PostgreSQL function using the Query method
    const result = await pool.query(Query.getUsers);
    // console.log(result.rows);
    // Check if the result is empty
    // if (result.rows.length === 0) {
    //   res.status(404).json({ error: "No data found" });
    //   return;
    // }

    // Send the result back as a reQueryonse
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error executing PostgreSQL function:", error);

    // Handle JSON parsing error
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      res.status(500).json({ error: "Invalid JSON data" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

//Active-Company----ZAHIR
const ActiveCompany = async (req, res) => {
  pool.query(Query.ActiveCompany, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      data: result.rows,
    });
  });
};

//Dactive-Company----ZAHIR
const DeactiveCompany = async (req, res) => {
  pool.query(Query.DeactiveCompany, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      data: result.rows,
    });
  });
};

//Making Compony DeActive to Active----ZAHIR
const MoveCompanyDeactiveToActive = (req, res) => {
  const { comp_id, comp_name, company_status_id, user_id } = req.body;

  pool.query(
    Query.MoveCompanyDeactiveToActive,
    [comp_id, company_status_id],
    (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows,
        msg: "company status changed successfully...",
      });
    }
  );
};

// const MoveCompanyDeactiveToActive = (req, res) => {
//   const { comp_id, comp_name, company_status_id, user_id } = req.body;

//   pool.query(
//     Query.MoveCompanyDeactiveToActive,
//     [user_id, comp_name, comp_id, company_status_id],
//     (err, result) => {
//       if (err) {
//         throw err;
//       }
//       res.json({
//         success: true,
//         data: result.rows,
//         msg: "success",
//       });
//     }
//   );
// };


//----GETUSER _BY_EMAIL ID(userID)----///
const getUserByEmail = (req, res) => {
  try {
    let email = req.params.email;
    // console.log('error hai', typeof email);
    pool.query(Query.getUserByEmail, [email], (err, result) => {

      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

//----GETUSER _BY_EMAIL Email----///
// const getUserByEmail = (req, res) => {
//   let email = req.params.email;
//   // console.log(email);
//   pool.query(Query.getUserById, [email], (err, result) => {
//     if (err) {
//       throw err;
//     }
//     res.json({
//       data: result.rows,
//     });
//   });
// };

//----UPDATE_USERS_DETAILS----///
const updateUser = async (req, res) => {
  try {
    const { _email, _name, _title, _designation, _department, _phone, _address } =
      req.body;


    const user = await pool.query(Query.EmailVerify, [_email]);
    if (user.rows.length === 0) {
      res.status(404).json({
        error: "Sorry! An account with that email doesn't exist!",
      });
    } else {
      pool.query(
        Query.updateUser,
        [_email, _name, _title, _designation, _department, _phone, _address],
        (err, result) => {
          if (err) {
            throw err;
          }
          updateDetails(
            _email
          );
          res.json({
            success: true,
            data: "Updated successfully",
          });
        }
      );
    }
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};
//===DELETE USER===//
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(Query.deleteUser, [id], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      msg: `User with ${id} Deleted successfuly`,
    });
  });
};

//--UPDATE USER_STATUS---//

const updateUserStatus = (req, res) => {
  const {
    email,
    user_type,
    status_datetime,
    status_reason,
    status_id,
    adminEmail,
  } = req.body;



  pool.query(
    Query.EmailVerify,
    [adminEmail],

    (err, result) => {

      if (err) {
        throw err;
      }
      // console.log(result.rows);
      pool.query(
        Query.update_user_status,
        [
          email,
          user_type,
          result.rows[0].status_by,
          status_datetime,
          status_reason,
          status_id

        ],
        (err, result1) => {

          // console.log(result1);
          if (err) {
            throw err;
          }
          // UpdateRole(
          //   email,
          //   "Approval Mail ",
          //   `Hello, your request has been approved and we assigned you role as ${user_type} `
          // );
          res.status(201).json({
            success: true,
            data: "Updated successfully",
          });
        }
      );
    }
  );
};


const userActiveDeactive = async (req, res) => {
  // console.log(req.body.status_id);

  if (req.body.status_id === 'Active') {
    req.body.status_id = 1;
  }

  if (req.body.status_id === 'InActive') {
    req.body.status_id = 2;
  }

  if (req.body.status_id === 'Pending') {
    req.body.status_id = 3
  }

  const { email, status_datetime, status_reason, status_id, adminEmail } = req.body;
  // if (status_id == 4) {
  //   pool.query(Query.userExits1, [email], (err, result) => {
  //     console.log(result.rows);

  //     if (result.rows[0].status_id == 1 || result.rows[0].status_id == 2) {
  //       console.log("wow");
  //       res.status(201).json({
  //         success: true,
  //         msg: "Sorry you can't reject this users.",
  //       });
  //     } else {
  //       console.log("now");
  //       pool.query(Query.deleteUserByEmail, [email, 3], (error, result) => {
  //         if (error) {
  //           throw error;
  //         } else {
  //           res.status(201).json({
  //             success: true,
  //             msg: "Deleted Successfully.",
  //           });
  //           UserAccess(
  //             email,
  //             "Account Status ",
  //             `Hello, To inform you. We have rejected your account request for ${status_reason}`
  //           );
  //         }
  //       })
  //     }
  //   })
  //   // pool.query(
  //   //   Query.EmailVerify,
  //   //   [adminEmail],
  //   //   // async (err, result) => {
  //   //   //   if (err) {
  //   //   //     throw err;
  //   //   //   }
  //   //   //   pool.query(
  //   //   //     Query.user_active_deactive,
  //   //   //     [
  //   //   //       email,
  //   //   //       result.rows[0].status_by,
  //   //   //       status_datetime,
  //   //   //       status_reason,
  //   //   //       status_id,
  //   //   //     ],
  //   //   //     (error, result) => {
  //   //   //       if (error) {
  //   //   //         throw err;
  //   //   //       }
  //   //   //       pool.query(Query.deleteUserByEmail, [email,3], (error, result) => {
  //   //   //         if (error) {
  //   //   //           throw err;
  //   //   //         }
  //   //   //         res.status(201).json({
  //   //   //           success: true,
  //   //   //           msg: "Deleted Successfully.",
  //   //   //         });
  //   //   //         UserAccess(
  //   //   //           email,
  //   //   //           "Account Status ",
  //   //   //           `Hello, To inform you. We have rejected your account request for ${status_reason}`
  //   //   //         );
  //   //   //       })
  //   //   //     }
  //   //   //   );
  //   //   // }
  //   // );
  // } else {

  pool.query(
    Query.EmailVerify,
    [adminEmail],

    async (err, result) => {
      if (err) {
        throw err;
      }
      pool.query(
        Query.EmailVerify,
        [email],
        async (err, userresult) => {
          if (err) {
            throw err;
          }
          const isCompActive = await pool.query(Query.isCompActive, [userresult.rows[0].comp_id])
          // console.log(isCompActive.rows[0]);

          if (isCompActive.rows[0].company_status_id == '2') {
            res.status(401).json({
              success: false,
              msg: `Please activate the company ${isCompActive.rows[0].comp_name}`
            })
          } else {
            pool.query(
              Query.user_active_deactive,
              [
                email,
                result.rows[0].status_by,
                status_datetime,
                status_reason,
                status_id,
              ],
              (err, result) => {
                if (err) {
                  throw err;
                }
                // UserAccess(
                //   email,
                //   " Access Status ",
                //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`
                // );
                res.status(201).json({
                  success: true,
                  msg: "Status updated successfully",
                });
              }
            );
          }
        }
      )



    }

  );
  // }

};

// const userActiveDeactive = async (req, res) => {
//   // console.log(req.body.status_id);
//   let loginAccessStatus;

//   let statusid;

//   if (req.body.status_id === 'Active' || req.body.status_id == 1) {
//     req.body.status_id = 1;
//     loginAccessStatus = true;
//   }

//   if (req.body.status_id === 'InActive' || req.body.status_id == 2) {
//     req.body.status_id = 2;
//     loginAccessStatus = false;

//   }

//   if (req.body.status_id === req.body.status_id === 3) {
//     req.body.status_id = 3;
//     loginAccessStatus = false;
//   }

//   const { email, status_datetime, status_reason, status_id, adminEmail } = req.body;


//   // pool.query(Query.getUserByEmail, [email], (error, result) => {
//   //   if (error) {
//   //     throw error;
//   //   }
//   //   console.log(result.rows);
//   // })




//   if (result.rows[0].user_type == 'admin') {

//     console.log("admin console...");

//     pool.query(Query.checkUserActive2WayAUTH, [email], (error, result) => {
//       if (error) {
//         throw error;
//       }
//       // console.log(result.rows.length == 0);
//       //checked Both Side Is Approvel

//       if (result.rows.length == 0) {
//         pool.query(
//           Query.update_login_status_by_customer,
//           [
//             email,
//             result.rows[0].status_by,
//             status_datetime,
//             status_reason,
//             status_id,
//             loginAccessStatus
//           ],
//           (err, result) => {
//             if (err) {
//               throw err;
//             }

//             // UserAccess(
//             //   email,
//             //   " Access Status ",
//             //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`
//             // );

//             res.json({
//               success: true,
//               msg: "Role changed successfully.",
//             });
//           }
//         );
//       }
//     })


//   } else if (result.rows[0].user_type == 'superadmin') {
//     console.log("superadmin console...");
//     pool.query(Query.checkUserActive2WayAUTH, [email], (error, result) => {
//       if (error) {
//         throw error;
//       }
//       // console.log(loginAccessStatus);
//       //checked Both Side Is Approvel
//       if (result.rows.length == 0) {
//         pool.query(
//           Query.update_login_status_by_superadmin,
//           [
//             email,
//             result.rows[0].status_by,
//             status_datetime,
//             status_reason,
//             status_id,
//             loginAccessStatus
//           ],
//           (err, result) => {
//             if (err) {
//               throw err;
//             }

//             // UserAccess(
//             //   email,
//             //   " Access Status ",
//             //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`
//             // );

//             res.json({
//               success: true,
//               msg: "Role changed successfully.",
//             });
//           }
//         );
//       }
//     })
//   }







//   // if (status_id == 4) {
//   //   pool.query(Query.userExits1, [email], (err, result) => {
//   //     console.log(result.rows);
//   //     if (result.rows[0].status_id == 1 || result.rows[0].status_id == 2) {
//   //       console.log("wow");
//   //       res.status(201).json({
//   //         success: true,
//   //         msg: "Sorry you can't reject this users.",
//   //       });
//   //     } else {
//   //       console.log("now");
//   //       pool.query(Query.deleteUserByEmail, [email, 3], (error, result) => {

//   //         if (error) {
//   //           throw error;
//   //         } else {
//   //           res.status(201).json({
//   //             success: true,
//   //             msg: "Deleted Successfully.",
//   //           });
//   //           UserAccess(
//   //             email,
//   //             "Account Status ",
//   //             `Hello, To inform you. We have rejected your account request for ${status_reason}`
//   //           );
//   //         }
//   //       })
//   //     }
//   //   })
//   //   // pool.query(
//   //   //   Query.EmailVerify,
//   //   //   [adminEmail],
//   //   //   // async (err, result) => {
//   //   //   //   if (err) {
//   //   //   //     throw err;
//   //   //   //   }
//   //   //   //   pool.query(
//   //   //   //     Query.user_active_deactive,
//   //   //   //     [
//   //   //   //       email,
//   //   //   //       result.rows[0].status_by,
//   //   //   //       status_datetime,
//   //   //   //       status_reason,
//   //   //   //       status_id,
//   //   //   //     ],
//   //   //   //     (error, result) => {

//   //   //   //       if (error) {
//   //   //   //         throw err;
//   //   //   //       }
//   //   //   //       pool.query(Query.deleteUserByEmail, [email,3], (error, result) => {
//   //   //   //         if (error) {
//   //   //   //           throw err;
//   //   //   //         }

//   //   //   //         res.status(201).json({
//   //   //   //           success: true,
//   //   //   //           msg: "Deleted Successfully.",
//   //   //   //         });

//   //   //   //         UserAccess(
//   //   //   //           email,
//   //   //   //           "Account Status ",
//   //   //   //           `Hello, To inform you. We have rejected your account request for ${status_reason}`
//   //   //   //         );
//   //   //   //       })
//   //   //   //     }
//   //   //   //   );
//   //   //   // }
//   //   // );
//   // } else {

//   // pool.query(
//   //   Query.EmailVerify,
//   //   [adminEmail],

//   //   (err, result) => {

//   //     console.log(result.rows[0].user_type);

//   //     if (err) {
//   //       throw err;
//   //     }
//   //     if(result.rows[0].user_type=='admin'){
//   //     }
//   //     pool.query(
//   //       Query.user_active_deactive,
//   //       [
//   //         email,
//   //         result.rows[0].status_by,
//   //         status_datetime,
//   //         status_reason,
//   //         status_id,
//   //       ],
//   //       (err, result) => {
//   //         if (err) {
//   //           throw err;
//   //         }
//   //         // UserAccess(
//   //         //   email,
//   //         //   " Access Status ",
//   //         //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

//   //         // );
//   //         res.json({
//   //           success: true,
//   //           msg: "Role changed successfully.",
//   //         });
//   //       }
//   //     );
//   //   }
//   // );

//   // pool.query(
//   //   Query.EmailVerify,
//   //   [adminEmail],
//   //   (err, result) => {
//   //     // console.log(result.rows[0].user_type);
//   //     if (err) {
//   //       throw err;
//   //     }

//   //     if (result.rows[0].user_type == 'admin') {
//   //       pool.query(
//   //         Query.update_login_status_by_customer,
//   //         [
//   //           email,
//   //           result.rows[0].status_by,
//   //           status_datetime,
//   //           status_reason,
//   //           status_id,
//   //           loginAccessStatus
//   //         ],
//   //         (err, result) => {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           // UserAccess(
//   //           //   email,
//   //           //   " Access Status ",
//   //           //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

//   //           // );
//   //           res.json({
//   //             success: true,
//   //             msg: "Role changed successfully.",
//   //           });
//   //         }
//   //       );
//   //     } else if (result.rows[0].user_type == 'superadmin') {
//   //       console.log("superadmin console...");
//   //       pool.query(
//   //         Query.update_login_status_by_superadmin,
//   //         [
//   //           email,
//   //           result.rows[0].status_by,
//   //           status_datetime,
//   //           status_reason,
//   //           status_id,
//   //           loginAccessStatus
//   //         ],
//   //         (err, result) => {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           // UserAccess(
//   //           //   email,
//   //           //   " Access Status ",
//   //           //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

//   //           // );
//   //           res.json({
//   //             success: true,
//   //             msg: "Role changed successfully.",
//   //           });
//   //         }
//   //       );
//   //     }
//   //   }
//   // );

//   // }

//   // pool.query(
//   //   Query.EmailVerify,
//   //   [adminEmail],
//   //   (err, result) => {
//   //     // console.log(result.rows[0].user_type);
//   //     if (err) {
//   //       throw err;
//   //     }

//   //     if (result.rows[0].user_type == 'admin') {
//   //       console.log("admin console...");
//   //       pool.query(
//   //         Query.update_login_status_by_customer,
//   //         [
//   //           email,
//   //           result.rows[0].status_by,
//   //           status_datetime,
//   //           status_reason,
//   //           1,
//   //           loginAccessStatus
//   //         ],
//   //         (err, result) => {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           // UserAccess(
//   //           //   email,
//   //           //   " Access Status ",
//   //           //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

//   //           // );
//   //           res.json({
//   //             success: true,
//   //             msg: "Role changed successfully.",
//   //           });
//   //         }
//   //       );


//   //     } else if (result.rows[0].user_type == 'superadmin') {
//   //       console.log("superadmin console...");

//   //       pool.query(
//   //         Query.update_login_status_by_superadmin,
//   //         [
//   //           email,
//   //           result.rows[0].status_by,
//   //           status_datetime,
//   //           status_reason,
//   //           1,
//   //           loginAccessStatus
//   //         ],
//   //         (err, result) => {
//   //           if (err) {
//   //             throw err;
//   //           }
//   //           // UserAccess(
//   //           //   email,
//   //           //   " Access Status ",
//   //           //   `Hello, We changed your Id status ${status_id == 1 ? "Active" : "Deactive"}`

//   //           // );
//   //           res.json({
//   //             success: true,
//   //             msg: "Role changed successfully.",
//   //           });
//   //         }
//   //       );
//   //     }

//   //   }
//   // );

// };

const UpdatePreference = async (req, res) => {
  const { email, pref_id } = req.body;
  if (!email || !pref_id) {
    return res.json({
      status: 400,
      message: "Some important field is missing!",
    });
  }
  try {
    await pool.query(
      Query.update_user_preferences,
      [email, pref_id],
      (err, result) => {
        if (err) {
          // console.log(err);
          throw err;
        }
        res.status(200).json({
          msg: "Prefrence updated succeffully....",
          success: true,
          data: result.rows[0],
          data1: result.rows,
        });
      }
    );
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }
};

//==================================FAQ SECTION START===========================================================
//--------------ADD FAQ IN DATABASE-------------------------------------
const addFAQ = (req, res) => {
  const { question, answer } = req.body;
  try {
    pool.query(Query.addFAQ, [question, answer], (err, result) => {
      if (err) {
        // console.log(err);
        throw err;
      }
      res.status(200).json({
        msg: "FAQ Created Succeffully....",
        success: true,
        data: result.rows[0],
        data1: result.rows,
      });
    });
    // console.log(req.body);
  } catch (error) {
    console.log("");
  }
};

//----------------GET ALL FAQ LIST---------------
const getAllFAQ = (req, res) => {
  pool.query(Query.getAllFAQ, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({
      data: result,
      data1: result.rows
    });
  });
};

//----------SEARCH FAQ
const searchFAQ = (req, res) => {
  try {

    const { search } = req.body

    pool.query(Query.searchFAQ, [`%${search}%`, `%${search}%`], (error, result) => {
      // console.log(result.rows);
      if (error) {
        throw error
      }
      res.status(200).json({
        success: true,
        data: result,
        data1: result.rows,
      })

    })

  } catch (error) {
    console.log(error);
  }
}

const createFAQFeedback = async (req, res) => {
  try {
    const { email, feedback_data, rating } = req.body;

    pool.query(Query.sp_getspecific_userdetails, [email], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.rows[0] == undefined) {

      } else {
        let { _name, _user_id } = result.rows[0];
        pool.query(
          Query.sp_create_faq_feedback,
          [_name, email, feedback_data, _user_id, rating],
          (err, result) => {
            if (err) {
              throw err;
            }
            res.status(200).json({
              msg: "Feedback created successfully...",
              data: result.rows[0],
              success: true,
              data1: result.rows
            });
          }
        );
      }


    });
  } catch (error) {
    console.log(error);
  }
};

// 


const getAllFAQFeedBack = (req, res) => {
  try {
    pool.query(Query.sp_get_faq_feedback, (error, result) => {
      if (error) {
        throw error;
      }
      // console.log(result);

      res.status(200).json({
        success: true,
        result: result.rows,
        data1: result.rows
      });
    });
  } catch (error) {
    console.log(error);
  }
};




//----Single FAQ Feedback
const getSingleFAQFeedBack = (req, res) => {
  try {
    let email = req.params.id;

    pool.query(Query.sp_getsinglefaqfeedback, [email], (error, result) => {
      // console.log(result);
      if (error) {
        throw error;
      }

      res.status(200).json({
        success: true,
        result: result.rows,
        data1: result.rows
      });
    });
  } catch (error) {
    console.log(error);
  }
};



//==================================FAQ SECTION END===========================================================

const loginUser = async (req, res) => {
  try {
    //1. destructure the user details
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
      });
    } else {
      //1. Get the user from the database
      const user = await pool.query(Query.EmailVerify, [email]);

      if (user.rows.length === 0) {
        res.status(400).json({
          error: "Sorry! An account with that email doesn't exist!",
        });
      } else {
        // console.log(user.rows[0]);
        //2. check if user does not exist and return an error else login the user
        const passwordMatch = await bcrypt.compare(
          password,
          user.rows[0].password
        );
        // console.log(passwordMatch);
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        } else if (
          user.rows[0].user_type == "" &&
          user.rows[0].status_id === 3
        ) {
          res.status(400).json({
            error: "Sorry! user in pending state",
          });
        } else if (user.rows[0].status_id == 2) {
          res.status(400).json({
            error: "Sorry! user inactive",
          });
        } else {

          const isCompActive = await pool.query(Query.isCompActive, [user.rows[0].comp_id])




          res.status(200).json({

            success: true,

            user: user.rows[0].user_type,

            email: user.rows[0].email,

            status: user.rows[0].status_id,

            isverified: user.rows[0].isverified,

            message: "login done",

            comp_id: isCompActive.rows[0].comp_id,

            company_status_id: isCompActive.rows[0].company_status_id,

            data: user.rows[0],

            isCompActive: isCompActive.rows[0]

          });

          // res.status(200).json({
          //   success: true,
          //   user: user.rows[0].user_type,
          //   email: user.rows[0].email,
          //   status: user.rows[0].status_id,
          //   isverified:user.rows[0].isverified,
          //   message: "login done",
          //   data: user.rows[0],
          // });
        }
      }
    }
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      error: err.message,
    });
  }
};






//==================================FEEDBACK SECTION===========================================================
//--------createUserFeedback--------------
// const createUserFeedback = async (req, res) => {
//   try {
//     const { name, email, feedback_data, rating } = req.body;

//     pool.query(Query.getUserIdUsingQuery, [email], (err, result) => {
//       // console.log(result.rows[0].user_id);
//       if (err) {
//         // console.log(err);
//         throw err;
//       }

//       pool.query(
//         Query.createUserFeedback,
//         [name, email, feedback_data, result.rows[0].user_id, rating],
//         (err, result) => {
//           if (err) {
//             throw err;
//           }

//           res.status(200).json({
//             msg: "Feedback created successfully...",
//             data: result.rows[0],
//             success: true,
//           });
//         }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
const createUserFeedback = async (req, res) => {
  try {
    const { name, email, feedback_data, rating } = req.body;

    pool.query(Query.getUserIdUsingQuery, [email], (err, result) => {
      // console.log(result.rows[0].user_id);

      if (err) {
        // console.log(err);

        throw err;
      }

      pool.query(
        Query.createUserFeedback,

        [name, email, feedback_data, result.rows[0]._user_id, rating],

        (err, result) => {
          if (err) {
            throw err;
          }

          res.status(200).json({
            msg: "Feedback created successfully...",

            data: result.rows[0],
            data1: result.rows,

            success: true,
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

//----Single Feedback
const getSingleUserFeedBack = (req, res) => {
  try {
    let email = req.params.id;

    pool.query(Query.getSingleUserFeedBack, [email], (error, result) => {
      if (error) {
        throw error;
      }

      res.status(200).json({
        success: true,
        result: result.rows,
        data1: result.rows
      });
    });
  } catch (error) {
    console.log(error);
  }
};

//-----All Feedback
const getAllUserFeedBack = (req, res) => {
  try {
    pool.query(Query.getAllUserFeedBack, (error, result) => {
      if (error) {
        throw error;
      }

      res.status(200).json({
        success: true,
        result: result.rows,
        data1: result.rows
      });
    });
  } catch (error) {
    console.log(error);
  }
};

//==================================FEEDBACK SECTION END===========================================================



///======Update USER=Password====///
const updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(Query.updatePassword, [
      email,
      hashedPassword,
    ]);
    // console.log("Stored procedure called successfully");

    res.status(200).json({
      msg: "password changed successfully..",
    });
  } catch (error) {
    console.error("Error calling stored procedure:", error);
  }
};

const getAllApiRequest = (req, res) => {
  pool.query(Query.getAllreqUser, (err, result) => {

    if (err) {
      throw err;
    }
    res.json({
      data: result,
    });
  });
};

const getSingleApiRequest = (req, res) => {
  try {
    let id = req.params.id;
    // console.log(email);
    pool.query(Query.singleApiRequest, [id], (err, result) => {
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};


// const updateApiRequestStatus = (req, res) => {
//   try{
//     const { email,api_status_name,status_reason,responseDateAndTime,AlbaAdmin} = req.body;

//     let userDetails = await pool.query(Query.EmailVerify, [email]);
//     let apiName = await pool.query(Query.ApiName, [api_name]);
//     let apiFormat = await pool.query(Query.ApiFormat, [api_format_name]);
//     pool.query(
//       Query.updateApiStatus,
//       [
//         statusBy,
//         status_reason,
//         responseDataTime,
//         api_status_id,
//       ],

//       (err, result) => {
//         if (err) {
//           throw err;
//         }
//         res.json({
//           success: true,
//           data: "Approved",
//         });
//       }
//     );
//   }catch(error){
//     console.log(error);
//   }

// };


const addApiRequest = async (req, res) => {

  try {
    let ip_data = [];

    await fetch("http://find-ip.openjavascript.info")
      .then((res) => res.json())
      .then((ip) => ip_data.push({ server_ip_port: ip.iso.traits.ipAddress }));

    const {
      app_name,
      email,
      requestor_name,
      purposedataconsum,
      api_id,
      rule_id
    } = req.body

    pool.query(Query.reqExitsForAPI, [app_name, requestor_name, api_id, rule_id, email], async (error, result) => {
      if (error) {
        throw error;
      }
      if (result.rows.length > 0) {
        res.status(401).json({
          success: false,
          msg: `Already exits request for api with App Nmae:${app_name}, requester name:${requestor_name},
          api id:${api_id}, rule id: ${rule_id} `
        })
      } else {

        // console.log("id", req.body);
        let userDetails = await pool.query(Query.EmailVerify, [email]);
        // console.log(userDetails.rows[0].user_id);
        // let apiRequestIsExits = await pool.query(Query.ApiRequestIsExits, [email]);
        // if (apiRequestIsExits.rows[0] == undefined) {
        pool.query(
          Query.addreqUser,
          [
            userDetails.rows[0].user_id,
            userDetails.rows[0].email,
            ip_data[0].server_ip_port,
            app_name,
            requestor_name,
            purposedataconsum,
            api_id,
            rule_id,
            "3",
            userDetails.rows[0].comp_id

          ],

          // (user_id,email,server_ip_port,app_name,requestor_name,purpose_data_consum,api_id,rule_id,api_param,api_status_id)

          (error, result) => {
            if (error) {
              // console.log(error);
              throw error;
            }
            res.status(200).json({
              msg: "Request send succeffully",
            });
          }
        );
        // }
        // else if (apiRequestIsExits.rows[0].api_id == _api_id) {
        //   res.status(401).json({
        //     success: false,
        //     msg: "You Already Requested for This API"
        //   })
        // }        
      }
    })


  } catch (error) {
    console.log(error);
  }
};

// const addApiRequest = async (req, res) => {
//   try {
//     let ip_data = [];

//     await fetch("http://find-ip.openjavascript.info")
//       .then((res) => res.json())
//       .then((ip) => ip_data.push({ server_ip_port: ip.iso.traits.ipAddress }));
//     const {
//       appname,
//       email,
//       requestor_name,
//       purposedataconsum,
//       _api_id,
//       _api_format_id,
//     } = req.body;

//     let userDetails = await pool.query(Query.EmailVerify, [email]);
//     // let apiRequestIsExits = await pool.query(Query.ApiRequestIsExits, [email]);
//     // if (apiRequestIsExits.rows[0] == undefined) {
//     pool.query(
//       Query.addreqUser,
//       [
//         userDetails.rows[0].user_id,
//         userDetails.rows[0].email,
//         appname,
//         ip_data[0].server_ip_port,
//         requestor_name,
//         purposedataconsum,
//         _api_id,
//         "2",
//         _api_format_id,
//       ],
//       (error, result) => {
//         if (error) {
//           // console.log(error);
//           throw error;
//         }
//         res.status(200).json({
//           msg: "Request send succeffully",
//         });
//       }
//     );
//     // }
//     // else if (apiRequestIsExits.rows[0].api_id == _api_id) {
//     //   res.status(401).json({
//     //     success: false,
//     //     msg: "You Already Requested for This API"
//     //   })
//     // }
//   } catch (error) {
//     console.log(error);
//   }
// };


const updateApiRequestStatus = async (req, res) => {
  try {

    const { _cust_req_id, AlbaAdmin, status_reason, responseDataTime, api_status_name } = req.body;

    const response = await pool.query(Query.apiReqExits, [_cust_req_id]);

    if (response.rows.length == 0) {
      res.status(401).json({
        success: false,
        message: `Record Not Found with ID ${_cust_req_id}`
      })
    } else if (api_status_name == 'Deactive') {

      let userDetails = await pool.query(Query.EmailVerify, [AlbaAdmin]);
      let apiStatus = await pool.query(Query.ApiStatus, [api_status_name]);

      // const token = await generatejwtToken()

      pool.query(
        Query.updateApiStatus,
        [
          _cust_req_id,
          userDetails.rows[0].status_by,
          status_reason,
          new Date(),
          apiStatus.rows[0]._api_status_id,
          null,
          new Date(),
          null
        ],

        (err, result) => {
          if (err) {
            throw err;
          }

          pool.query(Query.getEmailRequesterAPI, [_cust_req_id], async (err, result1) => {
            if (err) {
              throw err;
            }
            // console.log(result.rows[0]);
            const { app_name, email, api_name, rule_id } = result1.rows[0];



            const sendMailObj = {
              "app_name": app_name,
              "email": email,
              "api_name": api_name,
              "rule_id": rule_id
            }




            const mailOptions = {
              email: result1.rows[0].email,
              subject: `API service is deactivated for API ${api_name}`,
              message: sendMailObj,
            };

            await sendEmailDynamic(mailOptions)

            res.status(200).json({
              msg: "Request send successfully",
              response: sendMailObj
            });

          })
        }
      );
    } else if (api_status_name == 'Active') {

      let userDetails = await pool.query(Query.EmailVerify, [AlbaAdmin]);
      let apiStatus = await pool.query(Query.ApiStatus, [api_status_name]);

      const token = await generatejwtToken()

      pool.query(
        Query.updateApiStatus,
        [
          _cust_req_id,
          userDetails.rows[0].status_by,
          status_reason,
          new Date(),
          apiStatus.rows[0]._api_status_id,
          token,
          new Date(),
          null
        ],

        (err, result) => {
          if (err) {
            throw err;
          }

          pool.query(Query.getEmailRequesterAPI, [_cust_req_id], async (err, result1) => {
            if (err) {
              throw err;
            }
            // console.log(result.rows[0]);
            const { app_name, email, sign_token, api_name, rule_id } = result1.rows[0];

            const sendMailObj = {
              "app_name": app_name,
              "email": email,
              "sign_token": sign_token,
              "api_name": api_name,
              "rule_id": rule_id,
              "api_param": [
                {
                  "cast_id": 100
                }
              ]
            }
            pool.query(Query.updateApiParams, [sendMailObj, _cust_req_id], async (error, result3) => {

              if (err) {
                throw err;
              }

              const mailOptions = {
                email: result1.rows[0].email,
                subject: 'Parameter for accessing the API',
                message: sendMailObj,
              };

              await sendEmailDynamic(mailOptions)

              res.status(200).json({
                msg: "Request send successfully",
                response: sendMailObj
              });

            })

          })
        }
      );
    }
  } catch (error) {
    console.log(error);
  }

  // if (api_status_name == 'Deactive') {
  //   let userDetails = await pool.query(Query.EmailVerify, [AlbaAdmin]);
  //   let apiStatus = await pool.query(Query.ApiStatus, [api_status_name]);
  //   pool.query(
  //     Query.updateApiStatus,
  //     [
  //       _cust_req_id,
  //       userDetails.rows[0].status_by,
  //       status_reason,
  //       new Date(),
  //       apiStatus.rows[0]._api_status_id,
  //       null,
  //       new Date()
  //     ],

  //     (err, result) => {
  //       if (err) {
  //         throw err;
  //       }
  //       res.status(200).json({
  //         msg: "Request send successfully",
  //       });
  //     }
  //   );
  // } 


};


const reGenerateAPIToken = async (req, res) => {
  try {
    const { _cust_req_id, email } = req.body;
    /*
      -Check is API Exits
    */
    const isApiExitsResponse = await pool.query(Query.isApiExits, [_cust_req_id])
    // console.log(isApiExitsResponse.rows[0].api_status_id);
    if (isApiExitsResponse.rowCount == 0) {
      res.status(401).json({
        success: false,
        msg: `API Does not exits with request ID ${_cust_req_id}`
      })
    } else if (isApiExitsResponse.rows[0].api_status_id == '2') {
      res.status(401).json({
        success: false,
        msg: `Sorry, API is currently in Deactivation Mode.`
      })
    }
    else if (isApiExitsResponse.rows[0].api_status_id == '1') {
      console.log('1');

      const token = await generatejwtToken()

      await pool.query(Query.updateAPIToken, [token, _cust_req_id])

      pool.query(Query.getEmailRequesterAPI, [_cust_req_id], async (err, result1) => {
        if (err) {
          throw err;
        }
        // console.log(result.rows[0]);
        const { app_name, email, sign_token, api_name, rule_id } = result1.rows[0];

        const sendMailObj = {
          "app_name": app_name,
          "email": email,
          "sign_token": sign_token,
          "api_name": api_name,
          "rule_id": rule_id,
          "api_param": [
            {
              "cast_id": 100
            }
          ]
        }
        pool.query(Query.updateApiParams, [sendMailObj, _cust_req_id], async (error, result3) => {

          if (err) {
            throw err;
          }

          const mailOptions = {
            email: result1.rows[0].email,
            subject: 'Parameter for accessing the API',
            message: sendMailObj,
          };

          await sendEmailDynamic(mailOptions)

          res.status(200).json({
            msg: "Token Generated successfully",
            response: sendMailObj
          });

        })
      })
    }
  } catch (error) {
    console.log(error);
  }
}

const ApplyRuleOnApi = async (_docvalue, _rule_id) => {

  let outputData;

  let data = _docvalue;
  let id = _rule_id;

  const rulesExtract = [];



  const result = await pool.query(Query.getKeyRule, [id]);

  rulesExtract.push(result.rows);

  // console.log("arr push result", rules[0].rules_value);
  /*db parameter_id and documetkeys_id should map to parameter and key name i.e., Hide/Truncate/Position or Fe/Cu/Zn etc respectively, identifiers will be of no use here*/
  /*naming conventions in db should be modified later 
    parameter_id - op_type
    paramvalue - op_param
    documentkeysid - op_value
    and  to make the rule engine more robust we need to include condition on which the operation will be executed
    op_cond
    This will be an expression based on unary operator ?
    */
  //  let age=10
  //  age >=18 ? "":""
  // Read rawData.json
  // const rawData = JSON.parse(fs.readFileSync('rawData.json', 'utf8'));

  // Read rule.json
  let ruleData = rulesExtract;
  // const ruleData = JSON.parse(fs.readFileSync('rule.json', 'utf8'));
  let rawData = data;
  // Extract the parameters from rule.json

  // const rules =ruleData.Key.data;
  const rules = ruleData;

  // Apply each rule
  rules.forEach((rules, index) => {
    rules.forEach((rule) => {
      const { parameter_id, paramname, paramvalue, documetkeys_id, key } = rule;

      //  console.log("359",paramvalue);

      if (paramname === "Hide") {
        console.log("hide working");
        // Filter out the key-value pair where the value is less than the threshold
        const item = rawData.COA.find((item) => item.key === key);
        if (item) {
          rawData.COA = rawData.COA.filter(
            (item) => item.key !== key || item.value >= paramvalue
          );
        }
      } else if (paramname === "Truncate") {
        // Truncate the value to the specified decimal places
        const decimalPlaces = parseInt(paramvalue);
        const item = rawData.COA.find((item) => item.key === key);
        if (item) {
          const value = rawData.COA.find((item) => item.key === key).value;
          rawData.COA.find((item) => item.key === key).value = truncateDecimal(
            value,
            decimalPlaces
          );
        }
      } else if (paramname === "Position") {
        // Move the key-value pair to the specified position
        const index = parseInt(paramvalue) - 1;
        const item = rawData.COA.find((item) => item.key === key);
        if (item) {
          const filteredCOA = rawData.COA.filter((item) => item.key !== key);
          filteredCOA.splice(index, 0, item);
          rawData.COA = filteredCOA;
        }
      } else if (paramname === "Rename") {
        // Rename the key to the specified value
        const item = rawData.COA.find((item) => item.key === key);
        if (item) {
          item.key = paramvalue;
        }
      }
    });

    // Function to truncate decimal value to specified decimal places
    function truncateDecimal(value, decimalPlaces) {
      const factor = 10 ** decimalPlaces;
      return Math.floor(value * factor) / factor;
    }

    // Prepare output.json
    outputData = rawData;
    // pool.query(Query.addOutPutData, [outputData]);
    // pool.query(Query.update_converted_data, [outputData,_docdetails_id]);
  });

  // // res.status(201).json({
  // //   success: true,
  // //   outputData: outputData,
  // // });
  return outputData

};

const ApiRequestVerification = (req, res) => {
  const { URL, app_name, email, sign_token, api_param, api_name, rule_id } = req.body;
  const { cast_id } = api_param[0];
  try {

    pool.query(Query.ApiRequestVerification, [email, app_name, sign_token, rule_id, '1'],
      async (error, result) => {
        if (error) {
          throw error;
        }

        if (result.rows.length == 0) {
          res.status(401).json({
            success: false,
            message: "Access Denied Please provide right parameters"
          })
        } else {
          // const response = await axios.get(`http://localhost:5600/documents/${cast_id}`);
          await axios.get(`http://localhost:5600/documents/${cast_id}`)
            .then(async (response) => {
              // console.log(response.data);
              if (response.data) {

                const outputData = await ApplyRuleOnApi(response.data, rule_id);

                const { requestor_name } = result.rows[0];

                let ip_data = [];

                await fetch("http://find-ip.openjavascript.info")
                  .then((res) => res.json())
                  .then((ip) => ip_data.push({ server_ip_port: ip.iso.traits.ipAddress }));

                pool.query(Query.access_api_logs,
                  [
                    req.body.email,
                    requestor_name,
                    req.body.api_name,
                    req.body.app_name,
                    ip_data[0].server_ip_port,
                    req.body,
                    req.body.rule_id
                  ],
                  (error, result2) => {
                    if (error) {
                      throw error;
                    }
                    res.status(200).json({
                      success: true,
                      message: "Access Granted.",
                      response: outputData
                    })

                  })
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.config.data == undefined) {
                // console.log(error.config.data == undefined);
                res.status(401).json({
                  success: false,
                  msg: `Request for Not Found with Id ${cast_id}`
                })
              }
            });
        }
      })

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}


const getAccessAPILogs = (req, res) => {
  try {
    pool.query(Query.getAccessAPILogs, async (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
      })
    })
  } catch (error) {
    console.log(error);
  }
}


const getAccessSpecUserAPILogs = (req, res) => {
  try {
    const email = req.params.email
    pool.query(Query.getAccessSpecUserAPILogs, [email], async (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
      })
    })
  } catch (error) {
    console.log(error);
  }
}




const demoXml = (req, res) => {
  // const jsonObj = {
  //   name: 'Garage',
  //   cars: [
  //     { color: 'red', maxSpeed: 120, age: 2 },
  //     { color: 'blue', maxSpeed: 100, age: 3 },
  //     { color: 'green', maxSpeed: 130, age: 2 },
  //   ],
  // };
  // const json = JSON.stringify(jsonObj);
  // const xml = converter.json2xml(json, { compact: true, spaces: 1 });
  // console.log(xml);

  pool.query(Query.getAllreqUser, (err, result) => {

    if (err) {
      throw err;
    }


    const jsonData = JSON.stringify(result.rows);
    const xmlData = converter.json2xml(jsonData, { compact: true, spaces: 1 });
    // console.log(xmlData);

    let xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>`

    // res.type('application/xml');
    // response.send(xmlData);

    res.header('Content-Type', 'application/xml')
    res.status(200).send(xmlHeaderxmlData)

    // res.json({
    //   data: xmlData,
    // });

    // response.set('Content-Type', 'text/xml');
    // response.send(xml(result));

  });
}


// const addApiRequest = async (req, res) => {
//   try {
//     let ip_data = [];
//     await fetch("http://find-ip.openjavascript.info")
//       .then((res) => res.json())
//       .then((ip) => ip_data.push({ server_ip_port: ip.iso.traits.ipAddress }));
//     const {
//       appname,
//       email,
//       requestor_name,
//       purposedataconsum,
//       api_name,
//       api_status_name,
//       api_format_name,
//     } = req.body;
//     let userDetails = await pool.query(Query.EmailVerify, [email]);
//     let apiName = await pool.query(Query.ApiName, [api_name]);
//     let apiFormat = await pool.query(Query.ApiFormat, [api_format_name]);
//     let apiStatus = await pool.query(Query.ApiStatus, [api_status_name]);
//     // console.log(apiName.rows[0].api_id)
//     // console.log(apiFormat.rows[0].api_format_id)
//     // console.log(apiStatus.rows[0].api_status_id)
//     // console.log(userDetails.rows[0].email)
//     // console.log(userDetails.rows[0].user_id)
//     pool.query(
//       Query.addreqUser,
//       [
//         userDetails.rows[0].user_id,
//         userDetails.rows[0].email,
//         appname,
//         ip_data[0].server_ip_port,
//         requestor_name,
//         purposedataconsum,
//         apiName.rows[0].api_id,
//         "2",
//         apiFormat.rows[0].api_format_id,
//       ],
//       (error, result) => {
//         if (error) {
//           console.log(error);
//           throw error;
//         }
//         res.status(200).json({
//           msg: "Request send succeffully",
//         });
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };




const apiLogs = (req, res) => {
  try {

    pool.query(Query.apiLogs, (err, result) => {
      try {
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const getDistincAPILogs = (req, res) => {
  try {

    pool.query(Query.getDistincAPILogs, (err, result) => {
      try {
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}



const apisingleUserLogs = (req, res) => {
  try {

    const { email } = req.body;

    pool.query(Query.apisingleUserLogs, [email], (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const apisingleUserLogsUsingParams = (req, res) => {
  try {

    const email = req.params.email;

    pool.query(Query.apisingleUserLogs, [email], (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}


const getUserNameFromAPILogs = (req, res) => {
  try {

    pool.query(Query.getUserNameFromAPILogs, (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const getUserNameFromLogs = (req, res) => {
  try {

    pool.query(Query.userLogsUniqueRecords, (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const userLogs = (req, res) => {
  try {

    pool.query(Query.userLogs, (err, result) => {
      try {
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const singleUserLogs = (req, res) => {
  try {

    const { email } = req.body;

    pool.query(Query.singleUserLogs, [email], (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}


const singleUserLogsByEmail = (req, res) => {
  try {


    const email = req.params.email

    pool.query(Query.singleUserLogs, [email], (error, result) => {
      try {

        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows,
          data1: result.rows,
        })

      } catch (error) {
        console.log(error);
      }
    })

  } catch (error) {
    console.log(error);
  }
}





//=========Data Conversion=================

const getSpecRules = async (req, res) => {
  try {

    const email = req.params.email
    pool.query(
      Query.EmailVerify,
      [email],

      async (err, result) => {

        if (err) {
          throw err;
        }

        const isCompActive = await pool.query(Query.isCompActive, [result.rows[0].comp_id])

        pool.query(Query.getSpecRules, [isCompActive.rows[0].comp_id], (error, result) => {
          if (error) {
            console.log(error);
            throw error;
          }
          res.status(200).json({
            success: true,
            data: result.rows,
            data1: result.rows,
          })
        })
      }
    )
  } catch (error) {
    console.log(error);
  }
}

const getRules = async (req, res) => {
  try {

    pool.query(Query.sp_get_all_rule, (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows,
      })
    })

  } catch (error) {
    console.log(error);
  }
}

const getRuleForApproval = async (req, res) => {
  try {

    pool.query(Query.getRuleForApproval, (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows,
      })
    })

  } catch (error) {
    console.log(error);
  }
}


const ApproveRule = (req, res) => {
  const { _email, _rule_id, _spec_status_id, _reason } = req.body
  try {

    pool.query(
      Query.EmailVerify,
      [_email],

      (err, result) => {

        if (err) {
          throw err;
        }

        pool.query(Query.ApproveRule, [
          result.rows[0].user_id, _spec_status_id, _reason, _rule_id
        ], (error, result) => {
          res.status(201).json({
            success: true,
            msg: `Status changed successfully of Rule ID ${_rule_id}`
          })
        })
      }
    )

  } catch (error) {
    console.log(error);
  }
}



const getUserRules = async (req, res) => {
  try {

    const useremail = req.params.useremail;

    pool.query(
      Query.EmailVerify,
      [useremail],

      async (err, result) => {

        if (err) {
          throw err;
        }
        // console.log(result.rows.length == 0);

        if (result.rows.length == 0) {
          res.status(200).json({
            success: false
          })
        } else {

          const isCompActive = await pool.query(Query.isCompActive, [result.rows[0].comp_id])

          // console.log(isCompActive.rows[0]);
          // if (isCompActive.rows[0].company_status_id == '2') {
          //   res.status(401).json({
          //     success: false,
          //     msg: `Please activate the company ${isCompActive.rows[0].comp_name}`
          //   })
          // } 

          pool.query(Query.sp_get_rule, [isCompActive.rows[0].comp_id], (error, result) => {
            if (error) {
              throw error;
            }
            res.status(200).json({
              success: true,
              data: result.rows,
              data1: result.rows,
            })
          })
        }


      }
    )

  } catch (error) {
    console.log(error);
  }
}




const getPreviousRule = async (req, res) => {
  try {

    const rule_id = req.params.rule_id;
    // console.log(rule_id);

    pool.query(Query.getPerviousRuleKeys, [rule_id], (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows,
      })
    })

  } catch (error) {
    console.log(error);
  }
}


const EditPreviousRule = async (req, res) => {
  try {

    const { docdetails_id, formType, keyrulepayload } = req.body;

    await keyrulepayload.map((curElem) => {

      const { _paramvalue, _documetkeys_id, _parameter_id, _ruleskeys_id } = curElem;
      // console.log(_paramvalue, _documetkeys_id, _parameter_id, _ruleskeys_id);

      pool.query(Query.EditPreviousRule, [_paramvalue, _documetkeys_id, _parameter_id, _ruleskeys_id], (error, result) => {
        if (error) {
          throw error;
        }
      })
    })

    res.status(201).json({
      success: true,
      msg: "Rules Edit Successfully.."
    })

  } catch (error) {
    console.log(error);
  }
}


const addNewRule = async (req, res) => {
  try {



    const { docdetails_id, formType, keyrulepayload } = req.body;

    await keyrulepayload.map((curElem) => {

      const { _paramvalue, _documetkeys_id, _parameter_id } = curElem;

      pool.query(Query.addNewRule, [_paramvalue, _documetkeys_id, _parameter_id], (error, result) => {
        if (error) {
          throw error;
        }
      })
    })

    res.status(201).json({
      success: true,
      msg: "Rules Created Successfully.."
    })

  } catch (error) {
    console.log(error);
  }
}


const addNewKeys = async (req, res) => {

  //   {
  //     "_rule_id": 1,
  //     "keyrulepayload": [
  //         {
  //             "_paramvalue": "12",
  //             "_parameter_id": "3",
  //             "_documetkeys_id": "9"
  //         }
  //     ]
  // }

  try {

    const { keyrulepayload } = req.body.data3;
    const { _rule_id } = req.body;


    await keyrulepayload.map((value) => {


      const { _parameter_id, _documetkeys_id, _paramvalue } = value;

      pool.query(
        Query.save_KeysSpecification,
        [_parameter_id, _documetkeys_id, _paramvalue, _rule_id],
        (error, result) => {
          if (error) {
            throw error;
          }
        })
    })

    res.status(201).json({
      success: true,
      msg: `Keys Rules create successfully for ${_rule_id}`
    })

  } catch (error) {
    console.log(error);
  }
}





const createRulesBySuperAdmin = async (req, res) => {
  try {

    const { _rule_name, _description, _document_id, useremail, _comp_id } = req.body;

    pool.query(
      Query.EmailVerify,
      [useremail],

      (err, result) => {

        if (err) {
          throw err;
        }
        // console.log(result.rows.length == 0);
        if (result.rows.length == 0) {
          res.status(200).json({
            success: false
          })
        } else {
          pool.query(Query.creatingNewRule, [_rule_name, _description, _document_id, result.rows[0].user_id, _comp_id], (error, result2) => {
            if (error) {
              throw error;
            }
            res.status(201).json({
              success: true,
              msg: "Rules Created Successfully..",
              result: result2
            })
          })
        }
      })

  } catch (error) {
    console.log(error);
  }
}


const addKeysDynamically = async (req, res) => {
  try {

    const { addDynamicKeys } = req.body.data;

    const { key, description, key_type } = addDynamicKeys[0];

    pool.query(Query.addKeysDynamicallyISExits, [key], (error, result) => {
      if (error) {
        throw error
      }

      if (result.rowCount == 0) {
        pool.query(Query.addKeysDynamically, [key, description, key_type],
          (error, result) => {
            if (error) {
              throw error
            }

            res.status(201).json({
              success: true,
              msg: `created successfully...`
            })
          })
      } else {
        res.status(401).json({
          success: false,
          msg: `${key} key already exits.`
        })
      }
    })



    // addDynamicKeys.map((value) => {
    //   const { key, description, key_type } = value;
    //   pool.query(Query.addKeysDynamicallyISExits, [key], (error, result) => {
    //     if (error) {
    //       throw error
    //     }
    //     if (result.rowCount == 0) {
    //       console.log("Okay...");
    //       pool.query(Query.addKeysDynamically, [key, description, key_type],
    //         (error, result) => {
    //           if (error) {
    //             throw error
    //           }
    //         })
    //     } else {
    //       console.log("Already Exists");
    //     }
    //   })
    // })
    // if (flag) {
    //   res.status(201).json({
    //     success: false,
    //     msg: `created successfully...`
    //   })
    // } else {
    //   res.status(401).json({
    //     success: false,
    //     msg: `${exitsKeys} already exits.`
    //   })
    // }

  } catch (error) {
    console.log(error);
  }
}

const addCustomRulesName = async (req, res) => {
  try {

    const { rules_name, purpose, email } = req.body;

    const result = await pool.query(Query.EmailVerify, [email]);

    if (result.rowCount == 0) {
      res.status(401).json({
        success: false,
        msg: `${email} email does not exits.`
      })
    } else {

      const result3 = await pool.query(Query.addCustomRulesNameIsExits, [rules_name])

      if (result3.rowCount == 0) {

        const result2 = await pool.query(Query.addCustomRulesName, [rules_name, purpose, result.rows[0].user_id]);

        if (result2.rowCount == 0) {
          res.status(401).json({
            success: false,
            msg: "something wrong"
          })
        } else {
          res.status(201).json({
            success: true,
            msg: "successfully created..."
          })
        }

      } else {
        res.status(401).json({
          success: false,
          msg: `${rules_name} already exits...`
        })
      }
    }

  } catch (error) {
    console.log(error);
  }
}

const custAdminaddCustomRulesName = async (req, res) => {
  try {

    const { rules_name, email } = req.body;

    const result = await pool.query(Query.EmailVerify, [email]);

    if (result.rowCount == 0) {
      res.status(401).json({
        success: false,
        msg: `${email} email does not exits.`
      })
    } else {

      const result3 = await pool.query(Query.custAdminaddCustomRulesNameIsEXits, [rules_name])

      if (result3.rowCount == 0) {

        const result2 = await pool.query(Query.custAdminaddCustomRulesName, [rules_name]);

        if (result2.rowCount == 0) {
          res.status(401).json({
            success: false,
            msg: "something wrong"
          })
        } else {
          res.status(201).json({
            success: true,
            msg: "successfully added."
          })
        }

      } else {
        res.status(401).json({
          success: false,
          msg: `${rules_name} already added.`
        })
      }
    }

  } catch (error) {
    console.log(error);
  }
}



const SelectCustomRulesName = async (req, res) => {
  try {

    const customRulesName = await pool.query(Query.SelectCustomRulesName);
    if (customRulesName.rowCount == 0) {
      res.status(401).json({
        success: false,
        msg: "something wrong"
      })
    } else {
      res.status(200).json({
        success: true,
        data: customRulesName.rows
      })
    }
  } catch (error) {
    console.log(error);
  }
}

const createRules = async (req, res) => {
  try {

    const { _rule_name, _description, _document_id, useremail } = req.body;

    pool.query(
      Query.EmailVerify,
      [useremail],

      (err, result) => {
        console.log(result.rows[0]);

        if (err) {
          throw err;
        }
        if (result.rows.length == 0) {
          res.status(200).json({
            success: false
          })
        } else {

          pool.query(Query.creatingNewRule, [_rule_name, _description, _document_id, result.rows[0].user_id, result.rows[0].comp_id], (error, result2) => {
            if (error) {
              throw error;
            }
            res.status(201).json({
              success: true,
              msg: "Rules Created Successfully..",
              result: result2
            })
          })
        }
      })

  } catch (error) {
    console.log(error);
  }
}

const editRules = async (req, res) => {
  try {

    const { _rule_name, _description, _document_id, useremail, _comp_id } = req.body.data1;
    const { rule_id } = req.body

    // "_document_id": 1,
    //     "_comp_id": 77,
    //     "_rule_name": "Rule for Fe 3",
    //     "_description": "Fe position 3",
    //     "useremail": "mohd.hanif@rapidqube.com"

    pool.query(
      Query.EmailVerify,
      [useremail],

      (err, result) => {



        if (err) {
          throw err;
        }
        if (result.rows.length == 0) {
          res.status(200).json({
            success: false
          })
        } else {


          pool.query(Query.UpdateExitsRule, [_rule_name, _description, _document_id, result.rows[0].user_id, _comp_id, rule_id], (error, result2) => {
            if (error) {
              throw error;
            }
            res.status(201).json({
              success: true,
              msg: "Rules Updated Successfully..",
              result: result2
            })
          })
        }
      })

  } catch (error) {
    console.log(error);
  }
}

const editRulekeys = async (req, res) => {

  try {

    const { keyrulepayload } = req.body.data3;
    const { rule_id } = req.body;

    const RuleIdIsExitsInRuleKeysResponse = await pool.query(Query.RuleIdIsExitsInRuleKeys, [rule_id])

    //checking the rule_id is exits or not in rule keys data
    if (RuleIdIsExitsInRuleKeysResponse.rowCount == 0) {

      res.status(201).json({
        success: false,
        msg: `Rule Id ${rule_id} does not exits in keys data `
      })
    } else {

      //deleting the keys
      await pool.query(Query.deleteRuleKeysExits, [rule_id]);

      //adding new keys
      await keyrulepayload.map((value) => {

        const { _parameter_id, _documetkeys_id, _paramvalue } = value;


        pool.query(
          Query.save_KeysSpecification,
          [_parameter_id, _documetkeys_id, _paramvalue, rule_id],
          (error, result) => {
            if (error) {
              throw error;
            }
          })
      })

      // await keyrulepayload.map((value) => {
      //   const { _parameter_id, _documetkeys_id, _paramvalue } = value;
      //   pool.query(
      //     Query.edit_KeysSpecification,
      //     [_parameter_id, _documetkeys_id, _paramvalue, rule_id],
      //     (error, result) => {
      //       if (error) {
      //         throw error;
      //       }
      //     })
      // })

      res.status(201).json({
        success: true,
        msg: `Keys Rules Updated successfully for ${rule_id}`
      })
    }

  } catch (error) {
    console.log(error);
  }
}

const editStoredDocRulesforDocumentSpecification = async (req, res) => {


  try {

    const { docrulepayload } = req.body.data2;
    const { rule_id } = req.body;

    const RuleIdIsExitsInDocKeys = await pool.query(Query.RuleIdIsExitsInDocKeys, [rule_id])

    if (RuleIdIsExitsInDocKeys.rowCount == 0) {

      res.status(201).json({
        success: false,
        msg: `Rule Id ${rule_id} does not exits in keys data `
      })
    } else {
      await pool.query(Query.deleteRuleDocExits, [rule_id]);

      await docrulepayload.map((value) => {

        const { _parameter_id, _documetkeys_id, _paramvalue } = value;

        pool.query(
          Query.storedDocRulesforDocumentSpecification,
          [_parameter_id, _documetkeys_id, _paramvalue, rule_id],
          (error, result) => {
            if (error) {
              throw error;
            }
          }
        )
      })

      res.status(201).json({
        success: true,
        msg: `Document Rules create successfully for ${rule_id}`
      })

    }

  } catch (error) {
    console.log(error);
  }


  // const {
  //   _parameter_id,
  //   _paramvalue_doc,
  // } = req.body.data2

  // console.log(req.body);

  // const { rule_id } = req.body

  // try {
  //   pool.query(Query.EditstoredDocRulesforDocumentSpecification, [_parameter_id, _paramvalue_doc, rule_id], (error, result) => {

  //     if (error) {
  //       throw error;
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: result.rows
  //     })

  //   })

  // } catch (error) {
  //   console.log(error);
  // }

}

/*
const storedDocRulesforDocumentSpecification = async (req, res) => {
  try {

    const { docrulepayload } = req.body.data2;
    const { _rule_id } = req.body;
    console.log(req.body);


    // console.log("ruleid", _rule_id)

    await docrulepayload.map((value) => {

      const { _parameter_id, _documetkeys_id, _paramvalue } = value;
      console.log(_parameter_id, _documetkeys_id, _paramvalue);

      // const storedDocRulesforDocumentSpecification = `
      // INSERT INTO doc_specification
      //  (parameter_id,documetkeys_id,paramvalue,rule_id)VALUES($1,$2,$3,$4) RETURNING docspec_id`


      pool.query(
        Query.storedDocRulesforDocumentSpecification,
        [_parameter_id, _documetkeys_id, _paramvalue, _rule_id],
        (error, result) => {
          if (error) {
            throw error;
          }
        }
        )
    })

    res.status(201).json({
      success: true,
      msg: `Document Rules create successfully for ${_rule_id}`
    })

  } catch (error) {
    console.log(error);
  }
}

*/








const DeletePreviousRule = (req, res) => {

  const _ruleskeys_id = parseInt(req.params._ruleskeys_id);

  pool.query(Query.DeletePreviousRule, [_ruleskeys_id], (err, result) => {

    if (err) {
      throw err;
    }

    res.json({
      success: true,
      msg: `Rules Deleted Successfully...`,
    });

  });
};


const documentsName = async (req, res) => {

  try {

    pool.query(Query.documentsName, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}

const documentKeysList = async (req, res) => {

  try {

    pool.query(Query.documentKeysList, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}

const documentFormatList = async (req, res) => {

  try {

    pool.query(Query.documentFormatList, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}

const parameterRuleApplyDoc = async (req, res) => {

  try {

    pool.query(Query.parameterRuleApplyDoc, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}


const parameterRuleApplyKeys = async (req, res) => {

  try {

    pool.query(Query.parameterRuleApplyKeys, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        res.status(200).json({
          success: true,
          data: result.rows
        })
      } catch (error) {

      }
    })

  } catch (error) {
    console.log(error);
  }
}



//   {
//     "_rule_id": 1,
//     "keyrulepayload": [
//         {
//             "_paramvalue": "12",
//             "_parameter_id": "3",
//             "_documetkeys_id": "9"
//         }
//     ]
// }

const storedDocRulesforDocumentSpecification = async (req, res) => {
  try {

    const { docrulepayload } = req.body.data2;
    const { _rule_id } = req.body;
    console.log(req.body);


    // console.log("ruleid", _rule_id)

    await docrulepayload.map((value) => {

      const { _parameter_id, _documetkeys_id, _paramvalue } = value;
      console.log(_parameter_id, _documetkeys_id, _paramvalue);

      // const storedDocRulesforDocumentSpecification = `
      // INSERT INTO doc_specification
      //  (parameter_id,documetkeys_id,paramvalue,rule_id)VALUES($1,$2,$3,$4) RETURNING docspec_id`


      pool.query(
        Query.storedDocRulesforDocumentSpecification,
        [_parameter_id, _documetkeys_id, _paramvalue, _rule_id],
        (error, result) => {
          if (error) {
            throw error;
          }
        }
      )
    })

    res.status(201).json({
      success: true,
      msg: `Document Rules create successfully for ${_rule_id}`
    })

  } catch (error) {
    console.log(error);
  }
}



// const storedDocRulesforDocumentSpecification = async (req, res) => {

//   const {
//     _parameter_id,
//     _paramvalue_doc,
//   } = req.body.data2

//   const { _rule_id } = req.body

//   try {
//     pool.query(Query.storedDocRulesforDocumentSpecification, [_parameter_id, _paramvalue_doc, _rule_id,], (error, result) => {

//       if (error) {
//         throw error;
//       }

//       res.status(200).json({
//         success: true,
//         data: result.rows
//       })

//     })

//   } catch (error) {
//     console.log(error);
//   }

// }

// const storedDocumentSpecificationAndKeysSpecification = async (req, res) => {


//   const {
//     docdetails_id,
//     _parameter_id,
//     _paramvalue_doc,
//     _rule_id,
//     keyrulepayload
//   } = req.body

//   try {
//     // if (_keys_parameter_id == undefined || _paramvalue_dockey == undefined || _documetkeys_id == undefined) {
//     if (keyrulepayload == undefined || keyrulepayload.length == 0) {

//       pool.query(Query.storedDocumentSpecificationAndKeysSpecification, [_parameter_id, _paramvalue_doc, _rule_id,], (error, result) => {

//         if (error) {
//           throw error;
//         }

//         res.status(200).json({
//           success: true,
//           data: result.rows
//         })

//       })

//     } else {




//       await keyrulepayload.map((value) => {
//         const { _keys_parameter_id, _documetkeys_id, _paramvalue_dockey } = value;
//         pool.query(
//           Query.save_KeysSpecification,
//           [_keys_parameter_id, _documetkeys_id, _paramvalue_dockey, _rule_id],
//           (error, result) => {
//             if (error) {
//               throw error;
//             }
//           })
//       })

//       res.status(201).json({
//         success: true,
//         msg: `Keys Rules create successfully for ${_rule_id}`
//       })
//     }

//   } catch (error) {
//     console.log(error);
//   }

// }

// const storedDocumentSpecification = async (req, res) => {

//   const {
//     docdetails_id,
//     _parameter_id,
//     _paramvalue_doc,
//     _format_id,
//     keyrulepayload
//   } = req.body

//   try {
//     // if (_keys_parameter_id == undefined || _paramvalue_dockey == undefined || _documetkeys_id == undefined) {
//     if (keyrulepayload == undefined || keyrulepayload.length == 0) {

//       pool.query(Query.storedDocumentSpecification, [_paramvalue_doc, docdetails_id, _parameter_id], (error, result) => {

//         if (error) {
//           throw error;
//         }

//         pool.query(Query.getDocumentDataForApplyRuleForDocument, [docdetails_id], (error, result2) => {

//           if (error) {
//             throw error;
//           }
//           console.log(result2.rows);
//         })

//         // res.status(200).json({
//         //   success: true,
//         //   data: result.rows
//         // })

//       })

//     } else {

//       let sendResponse = false

//       await keyrulepayload.map((value) => {
//         const { _keys_parameter_id, _documetkeys_id, _paramvalue_dockey } = value;
//         pool.query(
//           Query.save_keyrulesWithDocSpec,
//           [_paramvalue_dockey, docdetails_id, _documetkeys_id, _keys_parameter_id],
//           (error, result) => {
//             if (error) {
//               throw error;
//             }

//             // pool.query(Query.getDocumentDataForApplyRuleForKeys, [docdetails_id], (error, result2) => {
//             //   if (error) {
//             //     throw error;
//             //   }
//             //   console.log('rules data', result2.rows);
//             // })
//             sendResponse = true
//           })
//       })
//       // if (sendResponse) {
//       res.status(200).json({
//         success: true,
//       })
//       // }
//     }

//   } catch (error) {
//     console.log(error);
//   }

//   try {
//     // pool.query(Query.storedDocumentSpecification, [_paramvalue_doc, docdetails_id, _parameter_id], (error, result) => {

//     //   console.log(result.rows[0].docspec_id);

//     //   if (error) {
//     //     throw error;
//     //   }

//     //   pool.query(
//     //     Query.save_keyrules,
//     //     [_paramvalue_dockey, result.rows[0].docspec_id, _documetkeys_id, _keys_parameter_id],
//     //     (error, result) => {

//     //       if (error) {
//     //         throw error;
//     //       }
//     //     })

//     //   res.status(200).json({
//     //     success: true,
//     //     data: result.rows
//     //   })

//     // })
//   } catch (error) {
//     console.log(error);
//   }
// }




//=========Data Conversion END=================




/////create a common api for three api /////////
// const commonApi = async(req,res)=>{ 
//   const {  operation } = req.body;
// try{
//  if ( operation.data1 === "CreateRule" && operation.data2==="DocRule" && operation.data3==="KeyRule"){
//     try {

//       const { _rule_name, _description, _document_id, useremail } = operation.data1;



//       pool.query(
//         Query.EmailVerify,
//         [useremail],

//         (err, result) => {

//           if (err) {
//             throw err;
//           }
//           // console.log(result.rows.length == 0);
//           if (result.rows.length == 0) {
//             res.status(200).json({
//               success: false
//             })
//           } else {
//             pool.query(Query.creatingNewRule, [_rule_name, _description, _document_id, result.rows[0].user_id], (error, result2) => {
//               if (error) {
//                 throw error;
//               }
//               res.status(201).json({
//                 success: true,
//                 msg: "Rules Created Successfully.."
//               })
//             })
//           }
//         })

//     } catch (error) {
//       console.log(error);
//     }

//     const {
//       _parameter_id,
//       _paramvalue_doc,
//       _rule_id,
//     } = operation.data2

//     try {
//       pool.query(Query.storedDocRulesforDocumentSpecification, [_parameter_id, _paramvalue_doc, _rule_id,], (error, result) => {

//         if (error) {
//           throw error;
//         }

//         res.status(200).json({
//           success: true,
//           data: result.rows
//         })

//       })

//     } catch (error) {
//       console.log(error);
//     }

//     try {

//       const { _rule_id, keyrulepayload } = operation.data3;



//       await keyrulepayload.map((value) => {

//         const { _parameter_id, _documetkeys_id, _paramvalue } = value;

//         pool.query(
//           Query.save_KeysSpecification,
//           [_parameter_id, _documetkeys_id, _paramvalue, _rule_id],
//           (error, result) => {
//             if (error) {
//               throw error;
//             }
//           })
//       })

//       res.status(201).json({
//         success: true,
//         msg: `Keys Rules create successfully for ${_rule_id}`
//       })

//     } catch (error) {
//       console.log(error);
//     }
//   } 
// } catch(error) {
//   // Handle errors appropriately
//   res.status(500).json({ error: 'An error occurred' });

// }
// }



const getDocRule = (req, res) => {
  try {
    let id = req.params.id;
    // console.log('error hai', typeof email);
    pool.query(Query.getDocRule, [id], (err, result) => {

      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
      console.log(result.rows[0])
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};


const getKeyRule = (req, res) => {
  try {
    let id = req.params.id;
    // console.log('error hai', typeof email);
    pool.query(Query.getKeyRule, [id], (err, result) => {

      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
      console.log(result.rows[0])
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

const getOneRule = (req, res) => {
  try {
    let id = req.params.id;
    // console.log('error hai', typeof email);
    pool.query(Query.getOneRule, [id], (err, result) => {

      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
      // console.log(result.rows[0])
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

const getOutPut = (req, res) => {
  pool.query(Query.getOutPutData, (err, result) => {
    if (err) {
      console.error('Error fetching latest data:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'No data found' });
      } else {
        const latestData = result.rows[0];
        res.json(latestData);
      }
    }
  });
}



const getSingleDocDetails = (req, res) => {
  try {
    let id = req.params.id;
    // console.log('error hai', typeof email);
    pool.query(Query.getSingleData, [id], (err, result) => {

      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
      // console.log(result.rows[0])
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};



const ApproveRequestedDocument = (req, res) => {
  const { _email, _spec_status_id, _reason, _docdetails_id } = req.body
  try {

    pool.query(
      Query.EmailVerify,
      [_email],

      (err, result) => {
        if (err) {
          throw err;
        }

        pool.query(Query.ApproveRequestedDocument, [
          _spec_status_id, result.rows[0].user_id, _reason, _docdetails_id
        ], (error, result) => {
          res.status(201).json({
            success: true,
            msg: `Status changed successfully of Document ID ${_docdetails_id}`
          })
        })
      }
    )

  } catch (error) {
    console.log(error);
  }
}


//Get Active Company List
const getActiveCustomer = async (req, res) => {
  try {

    pool.query(Query.getActiveCustomer, (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: result.rows,
        data1: result.rows,
      })
    })

  } catch (error) {
    console.log(error);
  }
}



module.exports = {
  addUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  addFAQ,
  getAllFAQ,
  updateUserStatus,
  loginUser,
  UpdatePreference,
  emailOTPVerify,
  emailOTPVerifyByURL,
  createUserFeedback,
  getAllUserFeedBack,
  getSingleUserFeedBack,
  updatePassword,
  addApiRequest,
  getAllApiRequest,
  getSingleApiRequest,
  userActiveDeactive,
  ActiveCompany,
  DeactiveCompany,
  MoveCompanyDeactiveToActive,
  employeeList,
  employeeActiveDeactive,
  employeeChangeRole,
  searchFAQ,
  createFAQFeedback,
  getAllFAQFeedBack,
  getSingleFAQFeedBack,
  createRole,
  getCreateRole,
  getSigleSapData,
  getRequestedActiveData,
  getActiveAPI,
  FetchApiFormat,
  FetchApiDetails,
  updateApiRequestStatus,
  demoXml,
  userLogs,
  documentsName, documentKeysList, documentFormatList, parameterRuleApplyDoc,
  forgotPassword,
  verifyOTPPassword,
  resetPassword,
  getUserNameFromLogs,
  singleUserLogs,
  apiLogs,
  apisingleUserLogs,
  getUserNameFromAPILogs,
  parameterRuleApplyKeys,
  singleUserLogsByEmail,
  apisingleUserLogsUsingParams,
  getAllRequestedData,
  getPreviousRule,
  rejectUserLoginRequest,
  getRules,
  EditPreviousRule,
  DeletePreviousRule,
  addNewRule,
  getUserRules,
  createRules,
  addNewKeys,
  storedDocRulesforDocumentSpecification,
  getRuleForApproval,
  ApproveRule, getDocRule, getKeyRule, getOneRule, getOutPut, getSingleDocDetails,
  ApproveRequestedDocument,
  getUserRequestedData,
  ApiRequestVerification,
  getDistincAPILogs,
  getSpecRules,
  getAccessAPILogs,
  getAccessSpecUserAPILogs,
  getActiveCustomer,
  createRulesBySuperAdmin,
  reGenerateAPIToken,
  editRules,
  editRulekeys,
  editStoredDocRulesforDocumentSpecification,
  addKeysDynamically,
  addCustomRulesName,
  SelectCustomRulesName,
  custAdminaddCustomRulesName
}
