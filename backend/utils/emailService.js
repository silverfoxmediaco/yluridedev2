const nodemailer = require('nodemailer');

// Create reusable transporter using Outlook SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

// Verify connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email service connected successfully');
    return true;
  } catch (error) {
    console.error('Email service connection error:', error);
    return false;
  }
};

// Send booking confirmation email
const sendBookingConfirmation = async (bookingDetails) => {
  const { customerEmail, customerName, vanName, pickupDate, returnDate, totalPrice } = bookingDetails;

  const mailOptions = {
    from: `"NTX Luxury Van Rentals" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: 'Booking Confirmation - NTX Luxury Van Rentals',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000; border-bottom: 2px solid #C0C0C0; padding-bottom: 10px;">
          Booking Confirmation
        </h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for your booking with NTX Luxury Van Rentals. Here are your booking details:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Vehicle:</strong> ${vanName}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Return Date:</strong> ${returnDate}</p>
          <p><strong>Total Price:</strong> $${totalPrice}</p>
        </div>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>NTX Luxury Van Rentals Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send notification to admin about new booking
const sendBookingNotification = async (bookingDetails) => {
  const { customerEmail, customerName, customerPhone, vanName, pickupDate, returnDate, totalPrice } = bookingDetails;

  const mailOptions = {
    from: `"NTX Booking System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Booking - ${customerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #000; border-bottom: 2px solid #C0C0C0; padding-bottom: 10px;">
          New Booking Received
        </h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Customer Information</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
          <h3>Booking Details</h3>
          <p><strong>Vehicle:</strong> ${vanName}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Return Date:</strong> ${returnDate}</p>
          <p><strong>Total Price:</strong> $${totalPrice}</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking notification sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending booking notification:', error);
    return { success: false, error: error.message };
  }
};

// Send contact form email
const sendContactEmail = async (contactDetails) => {
  const { name, email, phone, subject, message } = contactDetails;

  const mailOptions = {
    from: `"NTX Website Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #002244; border-bottom: 2px solid #FB4F14; padding-bottom: 10px;">
          New Contact Form Submission
        </h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3 style="color: #002244; margin-top: 20px;">Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This message was sent from the NTX Luxury Van Rentals website contact form.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, error: error.message };
  }
};

// Generic send email function
const sendEmail = async (to, subject, html, text = null) => {
  const mailOptions = {
    from: `"NTX Luxury Van Rentals" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    ...(text && { text })
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  transporter,
  verifyConnection,
  sendBookingConfirmation,
  sendBookingNotification,
  sendContactEmail,
  sendEmail
};
