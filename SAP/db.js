{
    "id": 2,
    "INVOICE": [
        {
            "Fe": "0.1705"
        },
        {
            "Cu": "0.0039"
        },
        {
            "Mn": "0.0280"
        },
        {
            "Mg": "0.4754"
        },
        {
            "Cr": "0.0020"
        },
        {
            "Ni": "0.0025"
        },
        {
            "Zn": "0.0026"
        },
        {
            "Ti": "0.0121"
        }
    ]
}



// INSERT INTO public.user_details(
// 	user_id, name, title, comp_id, designation, department, email, phone, address, user_type, datetime, status_by, status_reason, status_id, status_datetime, pref_id, otp, isverified, isadminverified, company_status_id, password, role_id)
// 	VALUES
//     (
//     OLD.user_id, OLD.name, OLD.title, OLD.comp_id, OLD.designation, OLD.department, OLD.email, OLD.phone, OLD.address, OLD.user_type, OLD.datetime, OLD.status_by, OLD.status_reason, OLD.status_id, OLD.status_datetime, OLD.pref_id, OLD.otp, OLD.isverified, OLD.isadminverified, OLD.company_status_id, OLD.password, OLD.role_id
//     )



    

    
// CREATE OR REPLACE FUNCTION user_logs_trigger_function() RETURNS TRIGGER AS $user_audit$
// BEGIN
//     IF (TG_OP = 'DELETE') THEN
//          INSERT INTO user_logs(DML_Type,user_id, name, title, comp_id, designation, department, email, phone, address, user_type, datetime, status_by, status_reason, status_id, status_datetime, pref_id, otp, isverified, isadminverified, company_status_id, role_id)
//             VALUES(SELECT 'D',OLD.user_id, OLD.name, OLD.title, OLD.comp_id, OLD.designation, OLD.department, OLD.email, OLD.phone, OLD.address, OLD.user_type, OLD.datetime, OLD.status_by, OLD.status_reason, OLD.status_id, OLD.status_datetime, OLD.pref_id, OLD.otp, OLD.isverified, OLD.isadminverified, OLD.company_status_id, OLD.role_id);
    
//     ELSIF (TG_OP = 'UPDATE') THEN
//         INSERT INTO user_logs(DML_Type,user_id, name, title, comp_id, designation, department, email, phone, address, user_type, datetime, status_by, status_reason, status_id, status_datetime, pref_id, otp, isverified, isadminverified, company_status_id, role_id)
//             VALUES(SELECT 'U',OLD.user_id, OLD.name, OLD.title, OLD.comp_id, OLD.designation, OLD.department, OLD.email, OLD.phone, OLD.address, OLD.user_type, OLD.datetime, OLD.status_by, OLD.status_reason, OLD.status_id, OLD.status_datetime, OLD.pref_id, OLD.otp, OLD.isverified, OLD.isadminverified, OLD.company_status_id, OLD.role_id);
    
//     ELSIF (TG_OP = 'INSERT') THEN
//         INSERT INTO user_logs(DML_Type,user_id, name, title, comp_id, designation, department, email, phone, address, user_type, datetime, status_by, status_reason, status_id, status_datetime, pref_id, otp, isverified, isadminverified, company_status_id, role_id)
//             VALUES(SELECT 'I',OLD.user_id, OLD.name, OLD.title, OLD.comp_id, OLD.designation, OLD.department, OLD.email, OLD.phone, OLD.address, OLD.user_type, OLD.datetime, OLD.status_by, OLD.status_reason, OLD.status_id, OLD.status_datetime, OLD.pref_id, OLD.otp, OLD.isverified, OLD.isadminverified, OLD.company_status_id, OLD.role_id);
//     END IF;
//     RETURN NULL; 
// END;
// $user_audit$ LANGUAGE plpgsql;

// CREATE TRIGGER user_audit
// AFTER INSERT OR UPDATE OR DELETE ON user_details
// FOR EACH ROW EXECUTE FUNCTION user_logs_trigger_function();
