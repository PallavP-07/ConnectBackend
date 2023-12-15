














const fs = require("fs");
const { Engine } = require("json-rules-engine");
const Query = require("../Stored_procedures/Query");
const pool = require("../DB/DB");

const getRuleByName = (req, res) => {
  try {
    let id = req.params.id;
    // console.log('error hai', typeof email);
    pool.query(Query.getRuleByName, [id], (err, result) => {
      // console.log(result);
      if (err) {
        throw err;
      }
      res.json({
        data: result.rows,
      });
      console.log(result.rows[0].rules_value);
    });
  } catch (err) {
    // console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

const newData = (req, res) => {
  ///-=====common api======////
  const { key } = req.body;

  // Execute the rule
  const facts = { key: key };

  // Check if the showData event is triggered
  engine
    .run(facts)
    .then((result) => {
      // Check if the showData event is triggered
      const showDataEvent = result.events.find(
        (event) => event.type === "showData"
      );
      if (showDataEvent) {
        // Filter the data based on the provided country name
        const filteredData =
          key && key !== ""
            ? data.filter((element) => element.key === key)
            : data;
        const remainingData = data.filter((element) => element.key !== key);
        const finalData = filteredData.concat(remainingData);

        res.json(finalData);
      } else {
        res.status(404).json({ error: "No showData event triggered" });
      }
    })
    .catch((error) => {
      console.error("Rule Engine Error:", error);
      res.status(500).json({ error: "An error occurred" });
    });

  ////sequence==////
};
// const lessValue = (req, res) => {
//   const { key, value } = req.body;
//   const filteredData = data.filter((item) => {
//     if (item.key === key && item.value < value) {
//       return false; // Hide the row if the value is smaller than the data value
//     }
//     return true; // Show the row for other cases
//   });
//   res.json(filteredData);
// };

// const greateValue = (req, res) => {
//   const { key, value } = req.body;
//   const filteredData = data.filter((item) => {
//     if (item.key === key && item.value > value) {
//       return false; // Hide the row if the value is smaller than the data value
//     }
//     return true; // Show the row for other cases
//   });
//   res.json(filteredData);
// };

// const onlyLess = (req, res) => {
//   const { value } = req.body;

//   if (typeof value !== "number") {
//     return res
//       .status(400)
//       .json({ error: "Invalid input. Please provide a number." });
//   }

//   const filteredData = data.filter((item) => item.value <= value);
//   res.json(filteredData);
// };

// const onlyGrate = (req, res) => {
//   const { value } = req.body;

//   if (typeof value !== "number") {
//     return res
//       .status(400)
//       .json({ error: "Invalid input. Please provide a number." });
//   }

//   const filteredData = data.filter((item) => item.value >= value);
//   res.json(filteredData);
// };

const CommonApiRequest = async (req, res) => {
  const { data, operation, reqFields } = req.body;

  if (operation === "getAllData") {
    const { key } = req.body;
    // Execute the rule

    const rule = JSON.parse(fs.readFileSync("./SAP/rule.json", "utf8"));
    const engine = new Engine();
    // Execute the rule
    rule.rules.forEach((rule) => {
      engine.addRule(rule);
    });
    const facts = { key: key };

    // Check if the showData event is triggered
    engine
      .run(facts)
      .then((result) => {
        // Check if the showData event is triggered
        const showDataEvent = result.events.find(
          (event) => event.type === "showData"
        );
        if (showDataEvent) {
          // Filter the data based on the provided country name
          const filteredData =
            key && key !== ""
              ? data.filter((element) => element.key === key)
              : data;
          const remainingData = data.filter((element) => element.key !== key);
          const finalData = filteredData.concat(remainingData);
          res.json(finalData);
          pool.query(Query.addOutPutData, [filteredData]);
        } else {
          res.status(404).json({ error: "No showData event triggered" });
        }
      })
      .catch((error) => {
        console.error("Rule Engine Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  } else if (operation === "filterData") {
    const userInputs = reqFields;
    const selectedData = [];
    const remainingData = [];

    // Process the given key(s) and digit(s)
    for (let i = 0; i < userInputs.length; i++) {
      const key = userInputs[i].key;
      const decimalDigits = userInputs[i].decimalDigits;

      // Find the data for the given key
      const selectedDataItem = data.find((item) => item.key === key);

      if (selectedDataItem) {
        // Check if the value is a number before applying toFixed
        if (typeof selectedDataItem.value === "number") {
          // Format the value with the specified decimal digits
          if (decimalDigits !== undefined && decimalDigits !== "") {
            selectedDataItem.value = Number(
              selectedDataItem.value.toFixed(decimalDigits)
            );
          }
        }

        // Store the selected data object in the array
        selectedData.push(selectedDataItem);
      }
    }

    // Filter out the selected data objects from the original data array
    remainingData.push(...data.filter((item) => !selectedData.includes(item)));

    // Combine the selected data objects and the remaining data
    const result = [...selectedData, ...remainingData];

    res.json(result);
    pool.query(Query.addOutPutData, [result]);
  } else if (operation === "onlyLess") {
    const { value } = req.body;

    if (typeof value !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid input. Please provide a number." });
    }

    const filteredData = data.filter((item) => item.value <= value);
    res.json(filteredData);
    pool.query(Query.addOutPutData, [filteredData]);
  } else if (operation === "onlyGrate") {
    const { value } = req.body;

    if (typeof value !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid input. Please provide a number." });
    }

    const filteredData = data.filter((item) => item.value >= value);
    res.json(filteredData);
    pool.query(Query.addOutPutData, [filteredData]);
  } else if (operation === "LessData") {
    const { key, value } = req.body;
    const filteredData = data.filter((item) => {
      if (item.key === key && item.value < value) {
        return false; // Hide the row if the value is smaller than the data value
      }
      return true; // Show the row for other cases
    });
    res.json(filteredData);

    pool.query(Query.addOutPutData, [filteredData]);
  } else if (operation === "grateData") {
    const { key, value } = req.body;
    const filteredData = data.filter((item) => {
      if (item.key === key && item.value > value) {
        return false; // Hide the row if the value is smaller than the data value
      }
      return true; // Show the row for other cases
    });
    res.json(filteredData);
    pool.query(Query.addOutPutData, [filteredData]);
  } else if (operation === "GetOnlyOne") {
    const { key } = req.body;
    const rule = JSON.parse(fs.readFileSync("./SAP/rule.json", "utf8"));
    const engine = new Engine();
    // Execute the rule
    rule.rules.forEach((rule) => {
      engine.addRule(rule);
    });
    const facts = { key: key };

    // Check if the showData event is triggered
    engine
      .run(facts)
      .then((result) => {
        // Check if the showData event is triggered
        const showDataEvent = result.events.find(
          (event) => event.type === "showData"
        );
        if (showDataEvent) {
          // Filter the data based on the provided country name
          const filteredData =
            key && key !== ""
              ? data.filter((element) => element.key === key)
              : data;
          res.json(filteredData);
          pool.query(Query.addOutPutData, [filteredData]);
        } else {
          res.status(404).json({ error: "No showData event triggered" });
        }
      })
      .catch((error) => {
        console.error("Rule Engine Error:", error);
        res.status(500).json({ error: "An error occurred" });
      });
  }
};

///Rule By MohanSIR///////

const ApplyRule = async (req, res) => {
  // console.log("data",req.body);

  const { _docvalue, _rule_id, _docdetails_id } = req.body;
  console.log("279", _docdetails_id);
  let outputData;

  let data = JSON.parse(_docvalue)
  let id = _rule_id;

  // const { data, id } = req.body;

  const rulesExtract = [];

  //  await pool.query(Query.getRuleByName, [_rule_id], (err, result) => {
  //     if (err) {
  //       throw err;
  //     }
  //     res.json({
  //       data: result.rows[0]
  //     });

  //   })

  const result = await pool.query(Query.getKeyRule, [id]);

  rulesExtract.push(result.rows);
  console.log();
  console.log("key ruke 316 ", rulesExtract);

  // console.log("arr push result", rules[0].rules_value);
  /*db paramname and key should map to parameter and key name i.e., Hide/Truncate/Position or Fe/Cu/Zn etc respectively, identifiers will be of no use here*/
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
      const { parameter_id, paramname, paramvalue, key } = rule;

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
    pool.query(Query.update_converted_data, [outputData, _docdetails_id]);
  });

  res.status(201).json({
    success: true,
    outputData: outputData,
  });
};

//Hide,Truncate,Position,Rename

// const ApplyRuleDocumentLevel = async (req, res) => {

//   const { _docvalue, _rule_id, _docdetails_id } = req.body;

//   let outputData;
//   let kyeNames = ['id', 'cast_id', 'document_type', 'COA']
//   // let id='id';
//   // let cast_id='' document_type COA

//   let data = JSON.parse(_docvalue)
//   let id = _rule_id;

//   const rulesExtract = [];

//   const result = await pool.query(Query.getDocRule, [id]);

//   rulesExtract.push(result.rows);

//   let ruleData = rulesExtract;
//   let rawData = data;
//   // console.log("rawData", rawData);

//   const rules = ruleData;
//   // console.log('rules', rules);

//   // Apply each rule
//   rules.forEach(async (rules, index) => {
//     rules.forEach(async (rule, ruleindex) => {



//       const { parameter_id, paramname, paramvalue, key } = rule;
//       console.log("rules", rule);

//       // if (paramname == 'Rename') {
//       //   documentNewName = paramvalue
//       // }

//       // if (rule.key == 'id' && paramname == 'Rename') {
//       //   id = paramvalue
//       // }
//       // if (rule.key == 'cast_id' && paramname == 'Rename') {
//       //   cast_id = paramvalue
//       // }
//       // if (rule.key == 'document_type' && paramname == 'Rename') {
//       //   document_type = paramvalue
//       // }


//       if (paramname === "Hide") {

//         [rawData].map(function (obj) {
//           delete obj[key];
//           return obj;
//         });

//       } else if (paramname === "Truncate") {
//         [rawData].map(function (obj, index) {

//           if ((typeof obj) == 'object') {
//             [obj].map((val1, index1) => {

//               if (val1[kyeNames] == undefined) {

//               } else {
//                 kyeNames.map((keysName) => {
//                   val1[kyeNames].map((val2, index2) => {
//                     val2['value'] = paramvalue;
//                   })
//                 })
//               }
//             })
//           } else {
//             [obj[key]].map((val) => {
//               val['value'] = paramvalue
//             })
//           }
//           return obj;
//         });
//       } else if (paramname === "Position") {
//         function changeKeyPosition(obj, keyToMove, newIndex) {
//           if (!(keyToMove in obj) || newIndex < 0 || newIndex >= Object.keys(obj).length) {
//             // Invalid input: key not found or new index is out of bounds
//             return obj;
//           }

//           const map = new Map(Object.entries(obj));
//           const keyToMoveValue = map.get(keyToMove);

//           // Delete the key-value pair from the original position
//           map.delete(keyToMove);

//           // Insert the key-value pair at the new index
//           const keys = Array.from(map.keys());
//           keys.splice(newIndex, 0, keyToMove);

//           // Create a new Map with the updated order
//           const updatedMap = new Map();
//           keys.forEach(key => {
//             updatedMap.set(key, key === keyToMove ? keyToMoveValue : map.get(key));
//           });

//           // Convert the Map back to an object
//           const updatedObj = Object.fromEntries(updatedMap);

//           return updatedObj;
//         }
//         const obj = changeKeyPosition(rawData, paramname, paramvalue);
//         console.log("pos", obj);
//         return obj
//       }
//       else if (paramname === "Rename") {
//         console.log("Rename", rawData);
//         const newobj = [rawData].map(function (obj) {

//           obj[paramvalue] = obj[key];

//           delete obj[key];

//           return obj;
//         });
//         console.log(newobj);
//       }
//     });

//     outputData = rawData;
//     console.log('outputData', outputData);
//     const result = await pool.query(Query.update_doc_level_convert_data, [outputData, _docdetails_id]);
//   });

//   res.status(201).json({
//     success: true,
//     outputData: outputData,
//   });
// };

const ApplyRuleDocumentLevel = async (req, res) => {

  const { _docvalue, _rule_id, _docdetails_id } = req.body;

  let outputData;
  let documentNewName = 'COA'

  let keysNameList=['id','cast_id','document_type','COA']
  // let id='id';
  // let cast_id='' document_type COA

  let data = JSON.parse(_docvalue)
  let id = _rule_id;

  const rulesExtract = [];

  const result = await pool.query(Query.getDocRule, [id]);

  rulesExtract.push(result.rows);

  let ruleData = rulesExtract;
  let rawData = data;
  // console.log("rawData", rawData);

  const rules = ruleData;
  // console.log('rules', rules);

  // Apply each rule
  rules.forEach(async (rules, index) => {
    rules.forEach(async (rule, ruleindex) => {



      const { parameter_id, paramname, paramvalue, key } = rule;
      console.log("rules",rule);

      if (rule.key == 'COA' && paramname == 'Rename') {
        documentNewName = paramvalue
      }
      
    

      if (paramname === "Hide") {

        [rawData].map(function (obj) {
          delete obj[key];
          return obj;
        });

      } else if (paramname === "Truncate") {
        [rawData].map(function (obj, index) {

          if ((typeof obj) == 'object') {
            [obj].map((val1, index1) => {

              // keysNameList.map((keyName)=>{
              //   console.log(keyName);
              // })
         
              if(val1[documentNewName]==undefined){

              }else{
                val1[documentNewName].map((val2, index2) => {
                  val2['value'] = paramvalue;
                })
              }
            })
          } else {
            [obj[documentNewName]].map((val) => {
              val['value'] = paramvalue
            })
          }
          return obj;
        });
      } else if (paramname === "Position") {


        function changeKeyPosition(obj, keyToMove, newIndex) {
          if (!(keyToMove in obj) || newIndex < 0 || newIndex >= Object.keys(obj).length) {
            // Invalid input: key not found or new index is out of bounds
            return obj;
          }

          const map = new Map(Object.entries(obj));
          const keyToMoveValue = map.get(keyToMove);

          // Delete the key-value pair from the original position
          map.delete(keyToMove);

          // Insert the key-value pair at the new index
          const keys = Array.from(map.keys());
          keys.splice(newIndex, 0, keyToMove);

          // Create a new Map with the updated order
          const updatedMap = new Map();
          keys.forEach(key => {
            updatedMap.set(key, key === keyToMove ? keyToMoveValue : map.get(key));
          });

          // Convert the Map back to an object
          const updatedObj = Object.fromEntries(updatedMap);

          return updatedObj;
        }
        const obj = changeKeyPosition(rawData, paramname, paramvalue);
        return obj
      }
      else if (paramname === "Rename") {

        [rawData].map(function (obj) {

          obj[paramvalue] = obj[key];

          delete obj[key];

          return obj;
        });
      }
    });

    outputData = rawData;
    console.log('outputData', outputData);
    const result = await pool.query(Query.update_doc_level_convert_data, [outputData, _docdetails_id]);
  });

  res.status(201).json({
    success: true,
    outputData: outputData,
  });
};

// const ApplyRuleDocumentLevel = async (req, res) => {
//   const { _docvalue, _rule_id, _docdetails_id } = req.body;
//   console.log(req.body);

//   console.log(JSON.parse(_docvalue));

//   // let outputData;

//   // let data = JSON.parse(_docvalue);
//   let data = _docvalue
//   let id = _rule_id;

//   // const rulesExtract = [];

//   const result = await pool.query(Query.getDocRule, [id]);

//   // rulesExtract.push(result.rows);

//   // console.log("418",rulesExtract);
//   let ruleData = result.rows;
//   let rawData = data;

//   const rule = ruleData;

//   function changeFieldPositions(jsonObj, fieldPositions) {
//     let data = JSON.parse(jsonObj)
//     const updatedObj = {};

//     Object.entries(data).forEach(([key, value]) => {
//       if (key in fieldPositions) {
//         updatedObj[key] = value;
//       }
//     });

//     Object.entries(data).forEach(([key, value]) => {
//       if (!(key in fieldPositions)) {
//         updatedObj[key] = value;
//       }
//     });

//     return updatedObj;
//   }

//   // Function to hide fields from the JSON object
//   function hideFields(jsonObj, fieldNames) {
//     let data = JSON.parse(jsonObj)
//     fieldNames.forEach(key => {
//       if (key in data) {
//         delete data[key];
//       }
//     });
//     return data;
//   }
//   // Function to rename a field in the JSON object
//   function renameField(jsonObj, key, newName) {
//     let data = JSON.parse(jsonObj)

//     if (key in data) {
//       data[newName] = data[key];
//       delete data[key];
//     }
//     return data;
//   }
//   // Function to truncate decimal part of COA values based on the specified digit
//   function truncateDecimalCOA(jsonObj, digit) {

//     if (jsonObj.COA && Array.isArray(jsonObj.COA)) {
//       jsonObj.COA.forEach(item => {
//         if (item.value !== undefined && typeof item.value === 'number') {
//           item.value = parseFloat(item.value.toFixed(digit));
//         }
//       });
//     }
//     return jsonObj;
//   }

//   // Function to rename "cast_id" field to "Alloy" if its value is greater than 100
//   function renameCastId(jsonObj) {
//     if (jsonObj.cast_id !== undefined && typeof jsonObj.cast_id === 'number' && jsonObj.cast_id > 100) {
//       jsonObj.Alloy = jsonObj.cast_id;
//       delete jsonObj.cast_id;
//     }
//     return jsonObj;
//   }

//   // Function to modify JSON data based on conditions
//   function modifyJsonData(rawData, rule) {
//     let truncateDigit = 0;

//     rule.forEach(rules => {
//       const { paramname, paramvalue, key } = rules;

//       if (paramname === 'Position') {
//         const newPosition = parseInt(paramvalue)
//         // Change the position of the field
//         rawData = changeFieldPositions(rawData, { [key]: newPosition });
//       } else if (paramname === 'Hide') {
//         // Hide the field
//         rawData = hideFields(rawData, [key]);
//       } else if (paramname === 'Rename') {
//         const newName = paramvalue
//         // Rename the field
//         rawData = renameField(rawData, key, newName);
//       } else if (paramname === 'Truncate') {
//         const newValue = parseInt(paramvalue)
//         // Set the digit to truncate COA values
//         truncateDigit = newValue;
//       }
//     });

//     // Apply truncation of COA values based on the digit provided
//     rawData = truncateDecimalCOA(rawData, truncateDigit);

//     return rawData;
//   }

//   // Modify the JSON data based on conditions
//   const modifiedData = modifyJsonData(rawData, rule);

//   // Apply the "renameCastId" function separately after other modifications
//   const finalModifiedData = renameCastId(modifiedData);

//   // Convert the final modified data to JSON string
//   const outputData = JSON.stringify(finalModifiedData, null, 2);


//   console.log("524", outputData);
//   // pool.query(Query.addOutPutData, [outputData]);
//   pool.query(Query.update_doc_level_convert_data, [outputData, _docdetails_id]);


//   res.status(201).json({
//     success: true,
//     outputData: outputData,
//   });
// };

//Don't touch code

// const ApplyRuleDocumentLevel = async (req, res) => {
//   const { _docvalue, _rule_id, _docdetails_id } = req.body;

//   // let outputData;

//   // let data = JSON.parse(_docvalue);
//   let data=_docvalue
//   let id = _rule_id;

//   // const rulesExtract = [];

//   const result = await pool.query(Query.getDocRule, [id]);

//   // rulesExtract.push(result.rows);

// // console.log("418",rulesExtract);
//   let ruleData = result.rows;
//   let rawData = data;

//   const rule = ruleData;

//   function changeFieldPositions(jsonObj, fieldPositions) {
//     let data =JSON.parse(jsonObj)
//     const updatedObj = {};

//     Object.entries(data).forEach(([key, value]) => {
//       if (key in fieldPositions) {
//         updatedObj[key] = value;
//       }
//     });

//     Object.entries(data).forEach(([key, value]) => {
//       if (!(key in fieldPositions)) {
//         updatedObj[key] = value;
//       }
//     });

//     return updatedObj;
//   }

//   // Function to hide fields from the JSON object
//   function hideFields(jsonObj, fieldNames) {
//     // let data =JSON.parse(jsonObj)
//     fieldNames.forEach(key => {
//       if (key in jsonObj) {
//         delete jsonObj[key];
//       }
//     });
//     return jsonObj;
//   }
//   // Function to rename a field in the JSON object
//   function renameField(jsonObj, key, newName) {
//     let data =JSON.parse(jsonObj)

//     if (key in data) {
//       data[newName] = data[key];
//       delete data[key];
//     }
//     return data;
//   }
//   // Function to truncate decimal part of COA values based on the specified digit
//   function truncateDecimalCOA(jsonObj, digit) {

//     if (jsonObj.COA && Array.isArray(jsonObj.COA)) {
//       jsonObj.COA.forEach(item => {
//         if (item.value !== undefined && typeof item.value === 'number') {
//           item.value = parseFloat(item.value.toFixed(digit));
//         }
//       });
//     }
//     return jsonObj;
//   }

//   // Function to rename "cast_id" field to "Alloy" if its value is greater than 100
//   function renameCastId(jsonObj) {
//     if (jsonObj.cast_id !== undefined && typeof jsonObj.cast_id === 'number' && jsonObj.cast_id > 100) {
//       jsonObj.Alloy = jsonObj.cast_id;
//       delete jsonObj.cast_id;
//     }
//     return jsonObj;
//   }

//   // Function to modify JSON data based on conditions
//   function modifyJsonData(rawData, rule) {
//     let truncateDigit = 0;

//     rule.forEach(rules => {
//       const { paramname, paramvalue, key } = rules;

//       if (paramname === 'Position') {
//         const newPosition = parseInt(paramvalue)
//         // Change the position of the field
//         rawData = changeFieldPositions(rawData, { [key]: newPosition });
//       } else if (paramname === 'Hide') {
//         // Hide the field
//         rawData = hideFields(rawData, [key]);
//       } else if (paramname === 'Rename') {
//         const  newName = paramvalue
//         // Rename the field
//         rawData = renameField(rawData, key, newName);
//       } else if (paramname === 'Truncate') {
//         const  newValue = parseInt(paramvalue)
//         // Set the digit to truncate COA values
//         truncateDigit = newValue;
//       }
//     });

//     // Apply truncation of COA values based on the digit provided
//     rawData = truncateDecimalCOA(rawData, truncateDigit);

//     return rawData;
//   }

//   // Modify the JSON data based on conditions
//   const modifiedData = modifyJsonData(rawData, rule);

//   // Apply the "renameCastId" function separately after other modifications
//   const finalModifiedData = renameCastId(modifiedData);

//   // Convert the final modified data to JSON string
//   const outputData = JSON.stringify(finalModifiedData, null, 2);


// console.log("524",outputData);
//     // pool.query(Query.addOutPutData, [outputData]);
//     pool.query(Query.update_doc_level_convert_data, [outputData, _docdetails_id]);


//   res.status(201).json({
//     success: true,
//     outputData: outputData,
//   });
// };

// const ApplyRuleDocumentLevel = async (req, res) => {
//   const { _docvalue, _rule_id, _docdetails_id } = req.body;

//   // let outputData;

//   // let data = JSON.parse(_docvalue);
//   let data=_docvalue
//   let id = _rule_id;

//   // const rulesExtract = [];

//   const result = await pool.query(Query.getDocRule, [id]);

//   // rulesExtract.push(result.rows);

// // console.log("418",rulesExtract);
//   let ruleData = result.rows;
//   let rawData = data;

//   const rule = ruleData;

//   function changeFieldPositions(jsonObj, fieldPositions) {
//     let data =JSON.parse(jsonObj)
//     const updatedObj = {};

//     Object.entries(data).forEach(([key, value]) => {
//       if (key in fieldPositions) {
//         updatedObj[key] = value;
//       }
//     });

//     Object.entries(data).forEach(([key, value]) => {
//       if (!(key in fieldPositions)) {
//         updatedObj[key] = value;
//       }
//     });

//     return updatedObj;
//   }

//   // Function to hide fields from the JSON object
//   function hideFields(jsonObj, fieldNames) {
//     // let data =JSON.parse(jsonObj)
//     fieldNames.forEach(key => {
//       if (key in jsonObj) {
//         delete jsonObj[key];
//       }
//     });
//     return jsonObj;
//   }
//   // Function to rename a field in the JSON object
//   function renameField(jsonObj, key, newName) {
//     let data =JSON.parse(jsonObj)


//     if (key in data) {
//       data[newName] = data[key];
//       delete data[key];
//     }
//     return data;
//   }
//   // Function to truncate decimal part of COA values based on the specified digit
//   function truncateDecimalCOA(jsonObj, digit) {

//     if (jsonObj.COA && Array.isArray(jsonObj.COA)) {
//       jsonObj.COA.forEach(item => {
//         if (item.value !== undefined && typeof item.value === 'number') {
//           item.value = parseFloat(item.value.toFixed(digit));
//         }
//       });
//     }
//     return jsonObj;
//   }

//   // Function to rename "cast_id" field to "Alloy" if its value is greater than 100
//   function renameCastId(jsonObj) {
//     if (jsonObj.cast_id !== undefined && typeof jsonObj.cast_id === 'number' && jsonObj.cast_id > 100) {
//       jsonObj.Alloy = jsonObj.cast_id;
//       delete jsonObj.cast_id;
//     }
//     return jsonObj;
//   }

//   // Function to modify JSON data based on conditions
//   function modifyJsonData(rawData, rule) {
//     let truncateDigit = 0;

//     rule.forEach(rules => {
//       const { paramname, paramvalue, key } = rules;

//       if (paramname === 'Position') {
//         const newPosition = parseInt(paramvalue)
//         // Change the position of the field
//         rawData = changeFieldPositions(rawData, { [key]: newPosition });
//       } else if (paramname === 'Hide') {
//         // Hide the field
//         rawData = hideFields(rawData, [key]);
//       } else if (paramname === 'Rename') {
//         const  newName = paramvalue
//         // Rename the field
//         rawData = renameField(rawData, key, newName);
//       } else if (paramname === 'Truncate') {
//         const  newValue = parseInt(paramvalue)
//         // Set the digit to truncate COA values
//         truncateDigit = newValue;
//       }
//     });

//     // Apply truncation of COA values based on the digit provided
//     rawData = truncateDecimalCOA(rawData, truncateDigit);

//     return rawData;
//   }

//   // Modify the JSON data based on conditions
//   const modifiedData = modifyJsonData(rawData, rule);

//   // Apply the "renameCastId" function separately after other modifications
//   const finalModifiedData = renameCastId(modifiedData);

//   // Convert the final modified data to JSON string
//   const outputData = JSON.stringify(finalModifiedData, null, 2);


// console.log("524",outputData);
//     // pool.query(Query.addOutPutData, [outputData]);
//     pool.query(Query.update_doc_level_convert_data, [outputData, _docdetails_id]);


//   res.status(201).json({
//     success: true,
//     outputData: outputData,
//   });
// };

const getRules = (req, res) => {
  try {
    // console.log('error hai', typeof email);
    pool.query(Query.getRules, (err, result) => {
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


//Designing the custom rules.
// const ApplyRule = async (req, res) => {
//   // console.log("data",req.body);

//   const { _docvalue, _rule_id, _docdetails_id } = req.body;
//   console.log("279", _docdetails_id);
//   let outputData;

//   let data = JSON.parse(_docvalue)
//   let id = _rule_id;

//   // const { data, id } = req.body;

//   const rulesExtract = [];

//   //  await pool.query(Query.getRuleByName, [_rule_id], (err, result) => {
//   //     if (err) {
//   //       throw err;
//   //     }
//   //     res.json({
//   //       data: result.rows[0]
//   //     });

//   //   })

//   const result = await pool.query(Query.getKeyRule, [id]);

//   rulesExtract.push(result.rows);
//   console.log();
//   console.log("key ruke 316 ", rulesExtract);

//   // console.log("arr push result", rules[0].rules_value);
//   /*db paramname and key should map to parameter and key name i.e., Hide/Truncate/Position or Fe/Cu/Zn etc respectively, identifiers will be of no use here*/
//   /*naming conventions in db should be modified later 
//     parameter_id - op_type
//     paramvalue - op_param
//     documentkeysid - op_value
//     and  to make the rule engine more robust we need to include condition on which the operation will be executed
//     op_cond
//     This will be an expression based on unary operator ?
//     */
//   //  let age=10
//   //  age >=18 ? "":""
//   // Read rawData.json
//   // const rawData = JSON.parse(fs.readFileSync('rawData.json', 'utf8'));

//   // Read rule.json
//   let ruleData = rulesExtract;
//   // const ruleData = JSON.parse(fs.readFileSync('rule.json', 'utf8'));
//   let rawData = data;
//   // Extract the parameters from rule.json

//   // const rules =ruleData.Key.data;
//   const rules = ruleData;

//   // Apply each rule
//   rules.forEach((rules, index) => {
//     rules.forEach((rule) => {
//       const { parameter_id, paramname, paramvalue, key } = rule;

//       //  console.log("359",paramvalue);

//       if (paramname === "Hide") {
//         console.log("hide working");
//         // Filter out the key-value pair where the value is less than the threshold
//         const item = rawData.COA.find((item) => item.key === key);
//         if (item) {
//           rawData.COA = rawData.COA.filter(
//             (item) => item.key !== key || item.value >= paramvalue
//           );
//         }
//       } else if (paramname === "Truncate") {
//         // Truncate the value to the specified decimal places
//         const decimalPlaces = parseInt(paramvalue);
//         const item = rawData.COA.find((item) => item.key === key);
//         if (item) {
//           const value = rawData.COA.find((item) => item.key === key).value;
//           rawData.COA.find((item) => item.key === key).value = truncateDecimal(
//             value,
//             decimalPlaces
//           );
//         }
//       } else if (paramname === "Position") {
//         // Move the key-value pair to the specified position
//         const index = parseInt(paramvalue) - 1;
//         const item = rawData.COA.find((item) => item.key === key);
//         if (item) {
//           const filteredCOA = rawData.COA.filter((item) => item.key !== key);
//           filteredCOA.splice(index, 0, item);
//           rawData.COA = filteredCOA;
//         }
//       } else if (paramname === "Rename") {
//         // Rename the key to the specified value
//         const item = rawData.COA.find((item) => item.key === key);
//         if (item) {
//           item.key = paramvalue;
//         }
//       }
//       else if (paramname === "Custom_Rule1") {
//         // Rename the key to the specified value
//        custom_rule1(key, value)
//       }
//       else if (paramname === "Custom_Rule2") {
//         // Rename the key to the specified value
//        custom_rule1(key, value)
//       }
//     });

//     // Function to truncate decimal value to specified decimal places
//     function truncateDecimal(value, decimalPlaces) {
//       const factor = 10 ** decimalPlaces;
//       return Math.floor(value * factor) / factor;
//     }

//     // Prepare output.json
//     outputData = rawData;
//     // pool.query(Query.addOutPutData, [outputData]);
//     pool.query(Query.update_converted_data, [outputData, _docdetails_id]);
//   });

//   res.status(201).json({
//     success: true,
//     outputData: outputData,
//   });
// };


module.exports = {
  newData,
  getRules,
  // getAllData,
  // FilterData,
  // lessValue,
  // greateValue,
  // onlyGrate,
  // onlyLess,
  CommonApiRequest,
  getRuleByName,
  ApplyRule,
  ApplyRuleDocumentLevel,
};
