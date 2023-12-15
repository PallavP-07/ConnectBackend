const { SendMail } = require('../functions/mailer')
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Mail Services Gateway...");
})

const sendMail= async (req, res) => {
    var result = await SendMail(req.body.toMail, "OTP verification mail", )

        res.statusMessage = "Mail sent Successfully..."
        res.status(200).json({
            Results: result
        })
};

module.exports={
    sendMail
}