//----USER TABLE  RELATED ALL SP AND FUNCTION-------//////
const check_otp_verified = ` SELECT * from  public.sp_check_otp_verified($1,$2)`;
const deleteUserIfOTPNotVerified = `CALL PUBLIC.sp_deleteUserIfOTPNotVerified($1)`;
const addUsers = 'SELECT * FROM public.sp_save_userdetails($1 , $2 , $3 ,$4 ,$5,$6,$7,$8,$9,$10,$11,$12,$13)';
const getUsers = 'SELECT * FROM public.sp_all_userdetails()'
const isVerified = 'call public.sp_signup_otp_verify($1)';
const updatePassword = 'CALL public.sp_changepassword($1, $2)'
// const getUserByEmail =  'SELECT * FROM public.sp_getspecific_userdetails($1)'
// const getUserByEmail = 'SELECT * FROM user_details where email=$1';
const getUserById = 'SELECT * FROM user_details where user_id=$1';
// const getUserById = 'SELECT * FROM public.sp_get_UserById($1)';
const getUserByEmail = 'select * from public.sp_get_single_userdetails_ByEmail($1)';

//----------USER DETAILS GET  and Update Queries----------------------
const updateUser = 'CALL public.sp_updateuserdetails ($1 , $2 , $3 ,$4 ,$5,$6,$7)'
const EmailVerify = "SELECT * FROM user_details WHERE email=$1"
const company_details = 'SELECT * FROM public.sp_checknamecomponyeixts ($1)'
//----------Update User Status-------------------------------------------------------------------------------------------
const update_user_status = 'CALL public.sp_updatestatus_userdetails ($1 , $2 , $3 ,$4 , $5, $6)';
const user_active_deactive = 'CALL public.sp_updateactivateanddeactivate ($1 , $2 , $3 ,$4 ,$5)';
const update_login_status_by_customer = `CALL public.sp_update_login_status_by_customer ($1 , $2 , $3 ,$4 ,$5,$6)`;
const update_login_status_by_superadmin = `CALL public.sp_update_login_status_by_superadmin ($1 , $2 , $3 ,$4 ,$5,$6)`;
const update_user_role = 'CALL public.sp_update_user_role ($1 , $2 , $3 ,$4 ,$5)'
const update_user_preferences = 'CALL public.sp_change_change_settings_preference ($1, $2)'
//------------FAQ QUERIES-------------------------------------------------------------------------------
const addFAQ = 'CALL public.sp_faq_details ($1,$2)'
const getAllFAQ = 'SELECT * FROM public.sp_all_faq_details()'
const getComp = 'select * from company_details WHERE comp_id=$1 '
// const searchFAQ = "SELECT FAQ_DETAILS.id as _id , FAQ_DETAILS.question as _question, FAQ_DETAILS.answer as _answer, FAQ_DETAILS.created_time as _created_time FROM FAQ_DETAILS WHERE question LIKE $1"
const searchFAQ = `SELECT FAQ_DETAILS.id as _id , FAQ_DETAILS.question as _question, FAQ_DETAILS.answer as _answer, FAQ_DETAILS.created_time as _created_time FROM FAQ_DETAILS WHERE LOWER(question) LIKE $1 OR UPPER(question) LIKE $2`
const sp_create_faq_feedback = `call public.sp_create_faq_feedback($1,$2,$3,$4,$5)`
const sp_get_faq_feedback = 'SELECT * from public.sp_get_faq_feedback()';
const sp_getsinglefaqfeedback = 'SELECT * FROM public.sp_getsinglefaqfeedback($1)';
//---------USER FEEDBACK QUERIES---------------------------------------------------------------------------

const sp_getspecific_userdetails = `SELECT * FROM sp_getspecific_userdetails($1)`;
const getUserIdUsingQuery = 'SELECT * FROM public.sp_getuserid($1)';
const createUserFeedback = 'CALL public.sp_create_user_feedback($1,$2,$3,$4,$5)';
const getAllUserFeedBack = 'SELECT * from public.sp_user_feedback()';
// const getSingleUserFeedBack = 'SELECT * FROM public.sp_getsingleuserfeedback($1)';
const getSingleUserFeedBack = 'SELECT * FROM user_feedback WHERE email=$1';

//---------USER FEEDBACK QUERIES END-------------------


//------------DELETE USER QUERIES----------------------------------------------------
const deleteUser = 'DELETE FROM user_details WHERE user_id=$1'
const deleteUserByEmail = 'DELETE FROM user_details WHERE email=$1 AND status_id=$2'
const candeleteUserByEmail = 'DELETE FROM user_details WHERE email=$1 AND status_id=$2'



// const saveCompany='call public.sp_companydetails($1)';
const saveCompanyWithStatus = 'insert into company_details(comp_name,company_status_id)values($1,$2) RETURNING comp_id';
const ActiveCompany = 'select * from public.sp_active_company()';
const DeactiveCompany = 'select * from public.sp_deactive_company()';
// const MoveCompanyDeactiveToActive = 'select * from public.sp_add_deactcomp_in_newcomp($1,$2,$3,$4)';
const MoveCompanyDeactiveToActive = `call public.sp_update_compony_status($1,$2)`;
const CompanyExits = 'SELECT * FROM public.sp_checknamecomponyeixts($1)';
const addNewCompany = 'call public.sp_new_company_details($1,$2)';
// const addUserReturnId = "INSERT INTO user_details (name,title,designation,department,email,phone,address,status_id,status_by,comp_id,company_status_id,password,otp) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING user_id";
const userExits = 'SELECT * FROM user_details where email=($1) OR phone=($2)';
const newComapanyExits = 'SELECT * FROM new_company_details where comp_name=($1)';
const userExits1 = 'SELECT * FROM user_details where email=$1';
const access_api_logs = `INSERT INTO access_api_logs(email, requestor_name, api_name, app_name, server_ip_port, parameter, rule_id)VALUES($1,$2,$3,$4,$5,$6,$7)`;
const getAccessAPILogs = `select * from sp_get_AccessAPILogsList()`;
const getAccessSpecUserAPILogs = `SELECT * FROM access_api_logs WHERE email=$1`;
const employeeListAssociateWitAdmin = `select * from sp_get_employeeListAssociateWitAdmin($1,$2)`;

const addreqUser = `CALL public.sp_save_api_user_req($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
const reqExitsForAPI = `SELECT * FROM customer_admin_api_req WHERE app_name=$1 AND requestor_name=$2 AND api_id=$3 AND rule_id=$4 AND email=$5`
// const APItokenRemove = `UPDATE customer_admin_api_req SET sign_token=NULL WHERE cust_req_id=$1`
const APItokenRemove = `CALL sp_delete_APITokenRemove($1)`;
const getAllreqUser = 'SELECT * FROM public.sp_get_user_api_req()';
const singleApiRequest = 'SELECT * FROM customer_admin_api_req where user_id=$1';
// const singleApiRequest=`select  from sp_get_singleApiRequest($1)`;



//======Role==========================//
const sp_get_role_created = `select * from public.sp_get_role_created()`;
const sp_Role_created = `call public.sp_Role_created($1,$2,$3,$4)`;
const isRoleExits = `SELECT * FROM Role_created WHERE role_name=$1`;
//======API REQUEST QUERY======////

const ApiStatus = 'SELECT * FROM public.sp_get_api_status($1)';
const FetchApiFormat = `SELECT * FROM public.sp_get_ApiFormat()`;
const FetchApiDetails = `SELECT * FROM public.sp_get_ApiDetails()`;
const updateApiStatus = 'UPDATE customer_admin_api_req SET  api_status_id=$5, status_by=$2,statusreason=$3,response_datetime=$4,sign_token=$6,status_datetime=$7,api_param=$8 WHERE cust_req_id=$1';
const updateApiParams = 'UPDATE customer_admin_api_req SET api_param=$1 WHERE cust_req_id=$2';
const getEmailRequesterAPI = `select * from sp_get_sigle_api_req($1)`;
const ApiRequestVerification = `SELECT * FROM customer_admin_api_req WHERE email=$1 AND app_name=$2 AND sign_token=$3 AND rule_id=$4 AND api_status_id=$5`;
const isApiExits = `select * from sp_check_isApiExits($1)`;
const updateAPIToken = `CALL public.sp_updateAPIToken($2,$1)`;
const ActiveAPI = `select * from sp_get_ActiveAPI($1)`
const apiReqExits = `SELECT * FROM customer_admin_api_req WHERE cust_req_id=$1`

//---NOT USED---------------------------------------------------------------------------------
const ApiName = 'SELECT * FROM api_details WHERE api_name=$1';
const ApiFormat = 'SELECT * FROM api_data_format WHERE api_format_name=$1';
const ApiRequestIsExits = `SELECT * FROM customer_admin_api_req WHERE email=$1`;
// const ApiRequestIsExits = `SELECT * from public.sp_get_apirequestisexits($1)`;
//---NOT USED---------------------------------------------------------------------------------


//=================USER Logs SP===========================================
const userLogsUniqueRecords = `SELECT * FROM sp_get_user_logs_unique()`;
const userLogs = `SELECT * FROM sp_get_user_logs()`;
const singleUserLogs = `SELECT * FROM sp_get_single_user_logs($1)`;

//=================API Logs SP===========================================
const apiLogs = `SELECT * FROM public.sp_get_api_logs()`;
const getUserNameFromAPILogs = `SELECT * FROM sp_getUserNameFromAPILogs()`;
const apisingleUserLogs = `select * FROM sp_get_single_api_logs($1)`;
const getDistincAPILogs = `select * from sp_get_DistincAPILogs()`

//=====Data Conversion=============================================
const documentsName = `SELECT * from public.sp_get_document()`;
const documentKeysList = `SELECT * FROM public.sp_get_documentkey()`;
const documentFormatList = `SELECT * FROM public.sp_get_doc_format()`;
const parameterRuleApplyDoc = `SELECT * FROM public.sp_get_doc_parameter()`;
const parameterRuleApplyKeys = `select * from sp_get_doc_keys_parameter()`;
const sp_get_all_rule = `select * from public.sp_get_all_rule()`;
const getSpecRules = `select * from public.sp_get_spec_rule($1)`;
const sp_get_rule = `select * from public.sp_get_rule($1)`;
const getRuleForApproval = `SELECT * FROM getAllRules()`;
const ApproveRule = `call sp_approveRules($1,$2,$3,$4)`;
// const storedDocRulesforDocumentSpecification = `INSERT INTO dlr (parameter_id,documetkeys_id,paramvalue,rule_id)VALUES($1,$2,$3,$4) RETURNING dlr_id`
const storedDocRulesforDocumentSpecification = `INSERT INTO doc_specification (parameter_id,documetkeys_id,paramvalue,rule_id)VALUES($1,$2,$3,$4) RETURNING docspec_id`
// const storedDocRulesforDocumentSpecification = `INSERT INTO doc_specification (parameter_id,paramvalue,rule_id)VALUES($1,$2,$3) RETURNING docspec_id`;
const EditstoredDocRulesforDocumentSpecification1 = `CALL PUBLIC.sp_UpdateRulesDocumentSpecification($1,$2,$3)`

const EditstoredDocRulesforDocumentSpecification = `CALL PUBLIC.sp_updaterulesdocumentspecificationFirst($1,$2,$3,$4)`


const save_keyrulesWithDocSpec = `call public.sp_save_keyrulesWithoutDocSpecId($1,$2,$3,$4)`;
const save_KeysSpecification = `call public.sp_save_KeysSpecification($1,$2,$3,$4)`;
const edit_KeysSpecification = `CALL PUBLIC.sp_UpdateEdit_KeysSpecification($1,$2,$3,$4)`
const RuleIdIsExitsInRuleKeys = `select * from get_ruleIdIsExitsInRuleKeys($1)`;
const RuleIdIsExitsInDocKeys = `select * from get_RuleIdIsExitsInDocKeys($1)`;
const deleteRuleKeysExits = `CALL PUBLIC.sp_deleteRuleKeys($1)`;
const deleteRuleDocExits = `DELETE FROM doc_specification WHERE rule_id=$1`;
// const deleteRuleDocExits = `CALL PUBLIC.sp_deleteRuleDocExits($1)`;
// const getDocumentDataForApplyRuleForKeys = `SELECT * FROM PUBLIC.sp_getDocumentDataForApplyRuleForKeys($1)`;
const getPerviousRuleKeys = `SELECT * FROM PUBLIC.sp_getPerviousRuleKeys($1)`;
const getRequestedActiveData = `select * from getRequestedActiveData($1)`;
const getAllRequestedData = `SELECT * from public.sp_getallrequesteddata()`;
// const getUserRequestedData=`SELECT * FROM doc_details WHERE user_id=$1`;
// const getUserRequestedData = `SELECT * FROM sp_getUserRequestedData($1)`
const getUserRequestedData = `SELECT * FROM sp_getUserRequestedDataWithDoc_Key_convert_data($1)`
const EditPreviousRule = `call sp_update_previousRule($1,$2,$3,$4)`;
const DeletePreviousRule = `call sp_delete_Rule($1)`;
const addNewRule = `INSERT INTO ruleskeys(paramvalue, documetkeys_id, parameter_id)VALUES($1,$2,$3)`;
const creatingNewRule = `INSERT INTO rules(rule_name, description, document_id,created_by,comp_id)VALUES 
($1, $2, $3,$4,$5) RETURNING rule_id`;
const UpdateExitsRule = `CALL PUBLIC.sp_UpdateExitsRule($1,$2,$3,$4,$5,$6)`;
// const creatingNewRule=`CALL sp_save_creatingNewRule ($1, $2, $3,$4)`;

//================Reset Password START===================================
const forgotPassword = `CALL public.sp_forgotpassword($1,$2)`;
const resetPassword = 'CALL public.sp_reset_password ($1, $2)';
//================Reset Password END==========-=====================

//===========SAP====================================================================================================================================
// const doc_save_details = `INSERT INTO doc_details (docdetails_id,docvalue,request_param,user_id) VALUES ($1 , $2 , $3 ,$4) RETURNING id`;
const checkDocExits = `SELECT * FROM doc_details WHERE doc_id=$1 AND user_id=$2`;
const doc_save_details = `INSERT INTO doc_details (doc_id,docvalue,request_param,user_id,rule_id) VALUES ($1 , $2 , $3 ,$4,$5) RETURNING docdetails_id`;
const updateIdFomatAndDocumentType = `UPDATE doc_details SET document_id=$1 , format_id=$2 WHERE docdetails_id=$3`;
const UpdateDocExits = `UPDATE doc_details SET docvalue=$1, request_param=$2, document_id=$3, format_id=$4 ,rule_id=$5 WHERE doc_id=$6 AND user_id=$7`;
const ApproveRequestedDocument = `update doc_details SET spec_status_id=$1,approve_by=$2, reason=$3 WHERE docdetails_id=$4`

const sp_save_DocumentKeys = `INSERT INTO DocumentKeys(key_name,key_value,id)VALUES($1,$2,$3)`;
const rejectUserLoginRequest = `DELETE FROM user_details WHERE email=$1`;
const JsonData = 'SELECT * FROM doc_details'
const getRuleByName = 'SELECT * FROM custom_rules where custom_rules_id=$1'
const getRules = 'SELECT * FROM custom_rules'
// const getDocRule = 'SELECT * FROM doc_specification where rule_id=$1'
const getDocRule = 'SELECT * FROM sp_getDocRule($1)';

//custome rules
const addCustomRulesName = `INSERT INTO custom_rules(rules_name,purpose,created_by)VALUES($1,$2,$3)`;
const addCustomRulesNameIsExits = `SELECT * FROM custom_rules WHERE rules_name=$1`;
const SelectCustomRulesName = `SELECT * FROM custom_rules`;

const addKeysDynamically = `INSERT INTO documetkeys(key,description,key_type)VALUES($1,$2,$3)`;
const addKeysDynamicallyISExits = `SELECT * FROM documetkeys WHERE key=$1`;

const custAdminaddCustomRulesName = `INSERT INTO parameter(paramname)VALUES($1)`;
const custAdminaddCustomRulesNameIsEXits = `SELECT * FROM parameter WHERE paramname=$1`;

const getKeyRule = 'SELECT * FROM sp_getKeyRules($1)'
const getOneRule = `select * from sp_get_SingleRule($1)`;
const getOutPutData = 'SELECT * FROM output_data ORDER BY id DESC LIMIT 1'
const addOutPutData = 'INSERT INTO output_data(document_value)VALUES($1)'
const getSingleData = 'SELECT * FROM doc_details where docdetails_id=$1'
const update_converted_data = 'CALL sp_update_converted_data($1,$2)';
const update_doc_level_convert_data = `UPDATE doc_details SET doc_level_convert_data=$1 WHERE docdetails_id=$2`


//------------Company Related START----------------
const isCompActive = `select * from company_details where comp_id=$1`;
const getActiveCustomer = `SELECT * FROM sp_getActiveCustomer()`;
//----------------Company Related END--------------------------




//---Not in Used Now---------------------------------------------------------
// const getAllreqUser = 'SELECT * FROM customer_admin_api_req'
// const updateApiStatus = 'UPDATE customer_admin_api_req SET  api_status_id=$1, status_by=$3,statusreason=$4,response_datetime=$5 user_id=$2'
// const singleApiRequest = 'SELECT * FROM customer_admin_api_req where user_id=$1'

const checkUserActive2WayAUTH = `
select 
	user_id as _user_id, email as _email,
	user_type as _user_type,status_id as _status_id,
	bycustomeradmin as _bycustomeradmin,bysuperadmin as _bysuperadmin
	FROM user_details
	WHERE email=$1 AND bycustomeradmin=true AND bysuperadmin=True
`
// const save_keyrules = `call public.sp_save_keyrules($1,$2,$3,$4)`;
//=================================================================


module.exports = {
  company_details, getUserById, addUsers, getUsers, getUserByEmail, updateUser, deleteUser, addFAQ, getAllFAQ, update_user_status, EmailVerify, update_user_preferences, isVerified, createUserFeedback, getAllUserFeedBack, getUserIdUsingQuery, getSingleUserFeedBack, getComp, updatePassword, user_active_deactive, addreqUser, getAllreqUser, ApiStatus, ApiFormat, ApiName
  , ActiveCompany, DeactiveCompany, MoveCompanyDeactiveToActive, CompanyExits, addNewCompany, saveCompanyWithStatus, userExits, newComapanyExits, employeeListAssociateWitAdmin, update_user_role, searchFAQ
  , sp_getspecific_userdetails, sp_create_faq_feedback, sp_get_faq_feedback, sp_getsinglefaqfeedback
  , ActiveCompany, DeactiveCompany, MoveCompanyDeactiveToActive, CompanyExits, addNewCompany, userExits, newComapanyExits, employeeListAssociateWitAdmin, updateApiStatus, singleApiRequest
  , sp_get_role_created, sp_Role_created, isRoleExits, doc_save_details, checkDocExits, sp_save_DocumentKeys
  , ActiveAPI, FetchApiFormat, FetchApiDetails, ApiRequestIsExits, userLogs, getRuleByName,
  documentsName, documentKeysList, documentFormatList, parameterRuleApplyDoc, forgotPassword,
  resetPassword, userLogsUniqueRecords, singleUserLogs, deleteUserByEmail, candeleteUserByEmail, userExits1, apiLogs, apisingleUserLogs, getUserNameFromAPILogs
  , parameterRuleApplyKeys,
  updateIdFomatAndDocumentType,
  save_keyrulesWithDocSpec,
  save_KeysSpecification,
  getRequestedActiveData, JsonData,
  getAllRequestedData,
  UpdateDocExits,
  update_login_status_by_customer,
  update_login_status_by_superadmin,
  checkUserActive2WayAUTH,
  rejectUserLoginRequest,
  EditPreviousRule,
  DeletePreviousRule,
  sp_get_all_rule,
  sp_get_rule,
  creatingNewRule,
  getPerviousRuleKeys,
  storedDocRulesforDocumentSpecification,
  getRuleForApproval,
  getUserRequestedData,
  ApproveRequestedDocument,
  APItokenRemove,
  getEmailRequesterAPI,
  ApiRequestVerification,
  getDistincAPILogs,
  apiReqExits,
  getSpecRules,
  access_api_logs,
  reqExitsForAPI,
  getAccessAPILogs,
  getAccessSpecUserAPILogs,
  isCompActive,
  getActiveCustomer,
  updateApiParams,
  isApiExits,
  updateAPIToken,
  ApproveRule, getDocRule, getKeyRule, getOneRule, getOutPutData, addOutPutData, getRules, getSingleData, update_converted_data,
  UpdateExitsRule,
  edit_KeysSpecification,
  EditstoredDocRulesforDocumentSpecification,
  EditstoredDocRulesforDocumentSpecification1,
  addNewRule,
  deleteRuleKeysExits,
  RuleIdIsExitsInRuleKeys,
  RuleIdIsExitsInDocKeys,
  check_otp_verified,
  deleteUserIfOTPNotVerified,
  update_doc_level_convert_data,
  deleteRuleDocExits,
  addKeysDynamically,
  addCustomRulesName,
  addCustomRulesNameIsExits,
  SelectCustomRulesName,
  addKeysDynamicallyISExits,
  custAdminaddCustomRulesName,
  custAdminaddCustomRulesNameIsEXits
}