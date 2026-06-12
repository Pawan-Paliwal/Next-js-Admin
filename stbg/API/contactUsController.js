const db = require('../db');
const nodemailer = require('nodemailer');


const isSmtpConfigured = () => {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.ADMIN_EMAIL
  );
};

// Get all leads
exports.getAllLeads = (req, res) => {
  const sql = ` 
    SELECT 
      ROW_NUMBER() OVER (ORDER BY ContactID DESC) AS SerialNo, 
      ContactID, 
      FullName, 
      PhoneNo, 
      EmailID,
      City,
      State,
      Pincode,
      Product,
      Message, 
      EnquiryType, 
      EnquiryFor, 
      PageName, 
      DATE_FORMAT(PostedDate, '%d %b %Y') AS PostedDate 
    FROM mst_contact_us 
    ORDER BY ContactID DESC 
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};

exports.saveNewEnquiry = (req, res) => {
  const {
    FullName,
    EmailID,
    PhoneNo,
    City,
    State,
    Pincode,
    Product,
    Message,
    EnquiryType,
    EnquiryFor,
    PageName = "/thank-you",
  } = req.body;
  const currentTime = new Date();
  const IsRead = 0;
  const insertSql = `
    INSERT INTO mst_contact_us (
      FullName,
      EmailID,
      PhoneNo,
      City,
      State,
      Pincode,
      Product,
      Message,
      EnquiryType,
      EnquiryFor,
      PageName,
      PostedDate,
      IsRead
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FullName,
    EmailID,
    PhoneNo,
    City,
    State,
    Pincode,
    Product,
    Message,
    EnquiryType,
    EnquiryFor,
    PageName,
    currentTime,
    IsRead,
  ];

  db.query(insertSql, values, async (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to save enquiry",
        error: err.message
      });
    }

    if (isSmtpConfigured()) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Affordplan" <${process.env.SMTP_USER}>`,
          to: EmailID,
          subject: "Thank You for Your Enquiry",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Verdana, Geneva, Tahoma, sans-serif; background-color: #f4f4f4;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <tr style="background-color: #e5f9fb;">
            <td style="padding: 5px 10px;" colspan="2">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="width: 40%;">
                            <a href="https://affordplan.com/" target="_blank"><img
                                    src="https://affordplan.com/assets/logo.svg" alt="Affordplan Logo"
                                    style="display: block; width: 123px;"></a>
                        </td>
                        <td style="text-align: right; font-size: 12px; color: #ffffff;">
                            <div style="margin-bottom: 4px;">
                                <a href="tel:+919250050501" style="color: #000000; text-decoration: none;">+91
                                    9250050501</a>
                            </div>
                            <div>
                                <a href="mailto:info@affordplan.com"
                                    style="color: #000000; text-decoration: none;">info@affordplan.com</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding: 20px; font-size: 14px; color: #666666; line-height: 1.5;">
                <p style="color: #000; font-weight: 600; font-size: 14px;">Hi ${FullName},</p>
                <p style="line-height: 20px; font-size: 14px;">Thank you for your enquiry! We appreciate your interest
                    in <a href="https://affordplan.com/" target="_blank"
                        style="display: inline-block; text-decoration: none; font-weight: 700; color: #666;">Affordplan
                    </a>. Our team will review your submission and get back to you shortly. We look forward to
                    assisting you.</p>
            </td>
        </tr>
        <tr>
            <td colspan="2"
                style="padding: 20px 20px 80px; font-size: 14px; color: #666666; line-height: 1.5; background: url(https://affordplan.com/email/light_grad.png) no-repeat; background-position: 95% 20%; background-size: 200px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                        <td style="padding-right: 5px; vertical-align: top; width: 50px;">
                            <img src="https://affordplan.com/favicon.ico" alt="Icon"
                                style="display: block; width: 50px;">
                        </td>
                        <td
                            style="vertical-align: top; width: 51%; float: left; border-left: 1px solid #00000040; padding-left: 15px;">
                            <h6 style="font-size: 14px; line-height: 18px; font-weight: 700; color: #000; margin: 0;">
                                Affordplan Team</h6>
                            <div style="margin-top: 5px; line-height: 1.4;">
                                <div style="color: #666;"><a href="javascript:;"
                                        style="color: #666; text-decoration: none; font-size: 14px;">Unit No. TTF-01,
                                        3rd Floor, Ocus Technopolis, Tower B, Sector - 54, Gurugram, Haryana -
                                        122002</a></div>
                                <div>
                                    <a href="tel:+919250050501"
                                        style="color: #666; text-decoration: none; font-size: 14px;">+91 9250050501</a>
                                </div>
                                <div>
                                    <a href="mailto:info@affordplan.com"
                                        style="color: #666; text-decoration: none; font-size: 14px;">info@affordplan.com</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr style="background-color: #DEDEDE;">
            <td style="padding: 20px 20px;" colspan="2">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="width: 40%;">
                            <a href="javascript:;"
                                style="font-size: 14px; text-decoration: none; color: #000; font-weight: 700;">www.affordplan.com</a>
                        </td>
                        <td style="text-align: right; font-size: 12px; color: #ffffff;">
                            <div style="vertical-align: middle;">
                                <a href="https://x.com/MyAffordplan" style="color: #000; margin-right: 10px;"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
                                        <g fill="none">
                                            <g clip-path="url(#primeTwitter0)">
                                                <path fill="#000"
                                                    d="M11.025.656h2.147L8.482 6.03L14 13.344H9.68L6.294 8.909l-3.87 4.435H.275l5.016-5.75L0 .657h4.43L7.486 4.71zm-.755 11.4h1.19L3.78 1.877H2.504z" />
                                            </g>
                                            <defs>
                                                <clipPath id="primeTwitter0">
                                                    <path fill="#000" d="M0 0h14v14H0z" />
                                                </clipPath>
                                            </defs>
                                        </g>
                                    </svg></a>
                                <a href="https://www.facebook.com/myaffordplan" style="color: #000; margin-right: 10px;"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#000"
                                            d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                                    </svg></a>
                                <a href="https://www.instagram.com/my_affordplan/#"
                                    style="color: #000; margin-right: 10px;"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#000"
                                            d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                                    </svg></a>
                                <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQFQ7idwpyY1hwAAAZvaWFJgpNuFKgVxwfRl87Hwoji3oxikn-ybTt_qyD2OI8G1nEhCUKGcgA7FFPZ20Htj0YIfRoQ9OCfDYnjJ1vWyraXF8Fxl_tQCmdBhGgSLgsJwq7FLFLs=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Faffordplan"
                                    style="color: #000; margin-right: 10px;"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="20" height="20" viewBox="0 0 24 24">
                                        <path fill="#000"
                                            d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                                    </svg></a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
        });
      } catch (mailErr) {
        console.error("Email Error:", mailErr);
      }
    }
    res.json({
      success: true,
      message: "Enquiry submitted successfully! We'll reach you soon.",
      contactId: result.insertId
    });
  });
};

// Delete a lead
exports.deleteEnquiry = (req, res) => {
  const ContactID = req.params.ContactID;
  const sql = 'DELETE FROM mst_contact_us WHERE ContactID = ?';
  db.query(sql, [ContactID], (err, result) => {
    if (err) {
      console.error('MySQL error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  });
};