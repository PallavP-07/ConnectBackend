const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" })
const path = require("path");
const axios = require('axios');
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const dbEmp = require("./Router/router");
const dataConv = require("./Router/DataConversion");
const sendMail = require("./Router/mailrouter");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config()
}

app.use(bodyParser.json());
app.use(express.json())
const corsOptions = {
  origin: [process.env.FRONTEND_SERVER_URL],
  origin: [process.env.FRONTEND_LOCAL_URL],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_SERVER_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, Accept"
  );
  next();
});

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, }));

//-------------USER_DETAILS_API---------------------//

//Dev Zahir
app.post("/addUser", dbEmp.addUser);

app.get("/allUsers", dbEmp.getUsers);
app.get("/get-single-user/:email", dbEmp.getUserByEmail);
app.delete(`/reject/user/login/request`, dbEmp.rejectUserLoginRequest)
// app.get("/getuserbyemail/:id", dbEmp.getUserById);
//app.put("/update-user-details/:email", dbEmp.updateUser)
app.post("/sendemail", sendMail.sendMail);
app.post("/verifyemailotp", dbEmp.emailOTPVerify);

//Dev Zahir
app.get("/verifyemailotp/:email/:otp", dbEmp.emailOTPVerifyByURL);

app.put("/updateUserDetails", dbEmp.updateUser);
app.delete("/delete-user/:id", dbEmp.deleteUser);
// app.put("/update-user-status/:email",dbEmp.updateUserStatus)
app.put("/update-user-role", dbEmp.updateUserStatus);
app.put("/user_active_deactive", dbEmp.userActiveDeactive);
app.post("/login", dbEmp.loginUser);
app.put("/updatePreference", dbEmp.UpdatePreference);
app.post("/updatePassword", dbEmp.updatePassword);

////====API REQUEST=====///
app.post("/addApiRequest", dbEmp.addApiRequest);
app.get("/getAllApiUser", dbEmp.getAllApiRequest);
app.get("/getSingleApiRequest/:id", dbEmp.getSingleApiRequest);
// app.put("/updateStatusemployee",dbEmp.employeeActiveDeactive);


//Active-Compony----ZAHIR----------------
app.get('/active-company', dbEmp.ActiveCompany)
app.get('/deactive-company', dbEmp.DeactiveCompany)
app.post('/move-company-deactive-to-active', dbEmp.MoveCompanyDeactiveToActive)
//==ZAHIR=====Employee API============
app.get('/employeelist/:email', dbEmp.employeeList)
app.put("/updateStatusemployee", dbEmp.employeeActiveDeactive);
app.put("/employeeChangeRole", dbEmp.employeeChangeRole);
app.put("/user_active_deactive", dbEmp.userActiveDeactive);
///=====ZAHIR----------FEEDBACK+API====///
app.post("/add-user-feedback", dbEmp.createUserFeedback);
app.get("/user-all-feedback", dbEmp.getAllUserFeedBack);
app.get("/user-all-feedback/:id", dbEmp.getSingleUserFeedBack);
//--------ZAHIR----FAQ API-----------------
app.post("/add-faq", dbEmp.addFAQ);
app.get("/all-faq-list", dbEmp.getAllFAQ);
app.post('/search-faq', dbEmp.searchFAQ)
//--------ZAHIR----FAQ FEEDBACK API-----------------
app.post('/create-faq-eedback', dbEmp.createFAQFeedback)
app.get("/faq-all-feedback", dbEmp.getAllFAQFeedBack);
app.get("/view/single-faq-feedback/:id", dbEmp.getSingleFAQFeedBack);
//===Dev=By=ZAHIR---------creating role api---------
app.post('/create-role', dbEmp.createRole);
app.get('/get-created-role', dbEmp.getCreateRole);
//===Dev Zahir===== API----------
app.get(`/active-api/:email`, dbEmp.getActiveAPI)
app.get(`/api-all-format`, dbEmp.FetchApiFormat)
app.get(`/api-details`, dbEmp.FetchApiDetails)
app.put('/updateStatus', dbEmp.updateApiRequestStatus)

app.put("/regenerate/api/token", dbEmp.reGenerateAPIToken)

//Dev Zahir & Pallav
app.post("/RunAPI", dbEmp.ApiRequestVerification)

app.get("/demo/xml", dbEmp.demoXml)




//====Dev Zahir==========Logs user START==============================
app.get(`/user-logs`, dbEmp.userLogs);
app.get(`/get-logs-user-name`, dbEmp.getUserNameFromLogs);
app.post(`/single-user-logs`, dbEmp.singleUserLogs);
app.get(`/single-user-logs/:email`, dbEmp.singleUserLogsByEmail);
//====Dev Zahir==========Logs user END================================


//====Dev Zahir=========Data Conversion======Dropdown API=======
//---1)COA-----2)INVOICE----------
app.get("/documents_name", dbEmp.documentsName)

//--Ex: FE,Cu,Mg,---------------------------------------
app.get("/documentkeys", dbEmp.documentKeysList)

//--Ex: PDF---------------------------------------------
app.get("/response_format", dbEmp.documentFormatList)

//----Document Wise and Keywise----------------------
app.get("/select_parameter_rule_apply_doc", dbEmp.parameterRuleApplyDoc)
app.get('/select_parameter_rule_apply_keys', dbEmp.parameterRuleApplyKeys)

//====Dev Zahir==============================================================
app.get(`/get/requested/data`, dbEmp.getAllRequestedData);
app.get(`/get/requested/data/:email`, dbEmp.getUserRequestedData);
//====Dev Zahir==============================================================
app.get(`/get/requested/data/active`, dbEmp.getRequestedActiveData);
//====Dev Zahir==============================================================
app.post("/stored/documentSpecification", dbEmp.storedDocRulesforDocumentSpecification)
// app.post("/stored/documentSpecification", dbEmp.storedDocRulesforDocumentSpecification)
//====Dev Zahir==============================================================
// app.get("/get/previous/rule/apply/:docdetails_id", dbEmp.getPreviousRule)


app.get("/get/previous/rule/apply/:rule_id", dbEmp.getPreviousRule)
app.put("/edit/previous/rule/apply", dbEmp.EditPreviousRule);
app.delete("/delete/previous/rule/apply/:_ruleskeys_id", dbEmp.DeletePreviousRule);


//Creating Rules
app.post("/add/new/rules", dbEmp.addNewRule);
app.post("/add/new/keys", dbEmp.addNewKeys);
app.post(`/create/rules`, dbEmp.createRules);
app.post(`/create/rules/superadmin`, dbEmp.createRulesBySuperAdmin);

app.post(`/add/keys/dynamically/`, dbEmp.addKeysDynamically);
app.post("/super/admin/create/custom/rules", dbEmp.addCustomRulesName);
app.get("/get/custome/rules/name", dbEmp.SelectCustomRulesName);
app.post(`/customer/admin/create/custom/rules`,dbEmp.custAdminaddCustomRulesName)



//Updating Rules
app.put(`/edit/rules`, dbEmp.editRules);
app.put("/edit/rule/keys", dbEmp.editRulekeys);
app.put("/edit/stored/documentSpecification", dbEmp.editStoredDocRulesforDocumentSpecification)




///Dev by Pallav for new change's////
// app.post('/CreateOneRule',dbEmp.commonApi)
// app.get('/get/rules')

//====Dev Zahir==============================================================

app.get("/get/rules", dbEmp.getRules);


/*
This api for to show rules on dropdown for particular user:Fetch Action
*/
app.get("/get/rules/:email", dbEmp.getSpecRules);

/*
/get/user/rules/:useremail api for get rule created by itself:Fetch Action
*/
app.get("/get/user/rules/:useremail", dbEmp.getUserRules);


/*.put
/get/rule/approval for get all rule for alba admin for approval: Fetch Action
*/
app.get('/get/rule/approval', dbEmp.getRuleForApproval);


/*
Approve the rules by alba admin: Update Action
*/
app.put(`/approval/rule`, dbEmp.ApproveRule)

//=============Data Conversion END============================


/*
  -get active customer/company list 
  -customer means here company
*/
app.get("/get/active/customer", dbEmp.getActiveCustomer)


//==============FETCH SAP Data START Dev Zahir=====================
app.post(`/sap-data/singledata`, dbEmp.getSigleSapData);
app.put(`/approval/req/doc`, dbEmp.ApproveRequestedDocument)
//==============FETCH SAP Data END=======================

//Dev Zahir===============Forgot Password START===================
app.post(`/forgot-password`, dbEmp.forgotPassword)
app.post(`/verify-otp-password`, dbEmp.verifyOTPPassword)
app.put(`/reset-password`, dbEmp.resetPassword)
//Dev Zahir===============Forgot Password END===================


//====Dev Zahir==========Logs API====CREATED=====================
app.get(`/api-logs`, dbEmp.apiLogs);
app.get("/access/api/logs", dbEmp.getAccessAPILogs)
app.get("/access/api/logs/:email", dbEmp.getAccessSpecUserAPILogs)

app.get(`/get-logs-user-name`, dbEmp.getUserNameFromAPILogs);
app.post(`/single-user-api-logs`, dbEmp.apisingleUserLogs);
app.get(`/single-user-api-logs/:email`, dbEmp.apisingleUserLogsUsingParams);
app.get("/get/api-logs", dbEmp.getDistincAPILogs)
//=======================API Logs SP===============================

////API_BY_PALLAV++++????
app.post('/process-data', dataConv.newData)
app.post('/filter', dataConv.CommonApiRequest);
app.get('/getData/:id', dataConv.getRuleByName);
app.get('/getAllRules', dataConv.getRules);
// app.post('/lessData',dataConv.lessValue);
// app.post('/greatData',dataConv.greateValue);
// app.post('/onlyLess',dataConv.onlyLess);
// app.post('/onlyGrate',dataConv.onlyGrate);





////API-FOR-get whole data of rule////

app.get('/getDocRule/:id', dbEmp.getDocRule);
app.get('/getKeyRule/:id', dbEmp.getKeyRule);
app.get('/getOneRule/:id', dbEmp.getOneRule);
app.get('/getSingleDocData/:id', dbEmp.getSingleDocDetails);

app.get('/combined-data/:id', async (req, res) => {

  if ((req.params.id == 'undefined')) {
    res.status(401).json({
      success: false,
      msg: `Please pass the correct Id or Id is Mandatory`
    })
  } else {
    try {
      const id = req.params.id;
      console.log(id);
      const apiUrl1 = `http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/getOneRule/${id}`;
      // const response  = await axios.get(apiUrl1);
      // const id = response.data.data[0]._rule_id
      // console.log("response ",response.data.data.rule_id);
      const apiUrl2 = `http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/getDocRule/${id}`;
      const apiUrl3 = `http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/getKeyRule/${id}`;

      const combinedData = {};

      // Make the first API request and merge the data
      const response1 = await axios.get(apiUrl1);
      combinedData.Rule = response1.data;

      // Make the second API request and merge the data
      const response2 = await axios.get(apiUrl2);
      combinedData.Doc = response2.data;
      // Make the third API request and merge the data
      const response3 = await axios.get(apiUrl3);
      combinedData.Key = response3.data;

      res.json(combinedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  }


});

app.post('/ConvertOnRule', dataConv.ApplyRule);
app.post('/document/level/conversion', dataConv.ApplyRuleDocumentLevel);


//Create Rule API
app.post('/CreateOneRule', async (req, res) => {
  const { data1, data2, data3 } = req.body;
  try {

    if (data1._comp_id == undefined) {
      /*
       -Creating rules by customer admin
       -Call the first API and send data1
       */
      const response1 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/create/rules`, data1);
      // console.log(response1.data.result.rows[0].rule_id);

      // await new Promise(resolve => setTimeout(resolve, 1000));
      // // Call the third API and send data3
      const response3 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/add/new/keys`, { data3: data3, _rule_id: response1.data.result.rows[0].rule_id });
      // // Call the second API and send data2
      const response2 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/stored/documentSpecification`, { data2: data2, _rule_id: response1.data.result.rows[0].rule_id });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process the responses if needed

      res.json({ message: 'Data sent successfully to all APIs' });


    } else {

      /*
      -Creating rules by super admin
      -Call the first API and send data1
      */
      const response1 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/create/rules/superadmin`, data1);
      // console.log(response1.data.result.rows[0].rule_id);


      await new Promise(resolve => setTimeout(resolve, 1000));
      // Call the third API and send data3
      const response3 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/add/new/keys`, { data3: data3, _rule_id: response1.data.result.rows[0].rule_id });
      // Call the second API and send data2
      const response2 = await axios.post(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/stored/documentSpecification`, { data2: data2, _rule_id: response1.data.result.rows[0].rule_id });
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process the responses if needed

      res.json({ message: 'Data sent successfully to all APIs' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



//Dev Zahir
//Update Rule API----------------------
app.put('/edit/CreateOneRule/rule/:rule_id', async (req, res) => {
  const { data1, data2, data3 } = req.body;
  const rule_id = req.params.rule_id
  try {

    const response1 = await axios.put(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/edit/rules`, { data1: data1, rule_id: rule_id });
    // console.log(response1.data.result.rows[0].rule_id);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Call the third API and send data3
    const response3 = await axios.put(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/edit/rule/keys`, { data3: data3, rule_id: rule_id });
    // Call the second API and send data2


    const response2 = await axios.put(`http://${process.env.BACKEND_INTERNAL_SERVER_API_URL}/edit/stored/documentSpecification`, { data2: data2, rule_id: rule_id });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // // Process the responses if needed
    res.json({
      message: 'Data sent successfully to all APIs'
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



//---SERVER IS RUNNING-----//
app.get('/', (req, res) => {
  res.send("Customer Connect server is running Fine...")
})


app.get('/convertedData', dbEmp.getOutPut);



// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

//server listen 
const server = () => {
  app.listen(port, () => {
    console.log("sever is Running on:", port);
  });
};
server();
