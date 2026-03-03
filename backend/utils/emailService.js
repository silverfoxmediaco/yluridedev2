const nodemailer = require('nodemailer');

// Create reusable transporter using SendGrid SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
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
    from: '"NTX Luxury Van Rentals" <james@silverfoxmedia.co>',
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
    from: '"NTX Booking System" <james@silverfoxmedia.co>',
    to: 'james@silverfoxmedia.co',
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
    from: '"NTX Website Contact" <james@silverfoxmedia.co>',
    to: 'james@silverfoxmedia.co',
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

// Send owner email verification email
const sendOwnerVerificationEmail = async (ownerDetails) => {
  const { email, firstName, businessName, verificationUrl } = ownerDetails;

  const mailOptions = {
    from: '"NTX Luxury Van Rentals" <james@silverfoxmedia.co>',
    to: email,
    subject: 'Verify Your Email — NTX Luxury Van Rentals',
    text: `Hi ${firstName},\n\nThank you for registering ${businessName} on NTX Luxury Van Rentals.\n\nPlease verify your email by visiting the following link within 24 hours:\n${verificationUrl}\n\nIf you did not create this account, you can safely ignore this email.\n\nBest regards,\nNTX Luxury Van Rentals Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #002244; padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">NTX Luxury Van Rentals</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #002244; margin-top: 0;">Welcome, ${firstName}!</h2>
          <p>Thank you for registering <strong>${businessName}</strong> on the NTX Luxury Van Rentals Marketplace.</p>
          <p>Please verify your email address to access your owner dashboard and start listing your vans.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verificationUrl}" style="background-color: #FB4F14; color: #ffffff; padding: 14px 36px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">Verify My Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 13px; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 13px; margin-top: 24px;">This link expires in 24 hours. If you did not create this account, you can safely ignore this email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 16px 24px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">NTX Luxury Van Rentals — Premium Mercedes Sprinter Vans in Dallas</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Owner verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending owner verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send listing submitted notification to admin
const sendListingSubmittedNotification = async (listingDetails) => {
  const { ownerName, ownerEmail, vanName, vanId } = listingDetails;

  const mailOptions = {
    from: '"NTX Marketplace" <james@silverfoxmedia.co>',
    to: 'james@silverfoxmedia.co',
    subject: `New Listing Submitted — ${vanName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #002244; border-bottom: 2px solid #FB4F14; padding-bottom: 10px;">
          New Listing Pending Review
        </h1>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Van:</strong> ${vanName}</p>
          <p><strong>Owner:</strong> ${ownerName} (${ownerEmail})</p>
          <p><strong>Listing ID:</strong> ${vanId}</p>
        </div>
        <p>Please review this listing in the admin dashboard.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Listing submitted notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending listing notification:', error);
    return { success: false, error: error.message };
  }
};

// Send listing approved email to owner
const sendListingApprovedEmail = async (listingDetails) => {
  const { ownerEmail, ownerName, vanName } = listingDetails;

  const mailOptions = {
    from: '"NTX Luxury Van Rentals" <james@silverfoxmedia.co>',
    to: ownerEmail,
    subject: `Your Listing Has Been Approved — ${vanName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #002244; border-bottom: 2px solid #FB4F14; padding-bottom: 10px;">
          Listing Approved!
        </h1>
        <p>Hi ${ownerName},</p>
        <p>Great news! Your listing for <strong>${vanName}</strong> has been approved and is now live on the NTX Luxury Van Rentals marketplace.</p>
        <p>Customers can now find and book your van. You'll receive an email notification when a booking is made.</p>
        <p>Best regards,<br>NTX Luxury Van Rentals Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Listing approved email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending listing approved email:', error);
    return { success: false, error: error.message };
  }
};

// Send listing rejected email to owner
const sendListingRejectedEmail = async (listingDetails) => {
  const { ownerEmail, ownerName, vanName, reason } = listingDetails;

  const mailOptions = {
    from: '"NTX Luxury Van Rentals" <james@silverfoxmedia.co>',
    to: ownerEmail,
    subject: `Listing Update — ${vanName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #002244; border-bottom: 2px solid #FB4F14; padding-bottom: 10px;">
          Listing Requires Changes
        </h1>
        <p>Hi ${ownerName},</p>
        <p>Your listing for <strong>${vanName}</strong> was not approved at this time.</p>
        ${reason ? `<div style="background-color: #fff3e0; padding: 16px; border-radius: 5px; margin: 16px 0; border-left: 4px solid #e67e00;"><p><strong>Reason:</strong> ${reason}</p></div>` : ''}
        <p>Please update your listing and resubmit for review.</p>
        <p>Best regards,<br>NTX Luxury Van Rentals Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Listing rejected email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending listing rejected email:', error);
    return { success: false, error: error.message };
  }
};

// Generic send email function
const sendEmail = async (to, subject, html, text = null) => {
  const mailOptions = {
    from: '"NTX Luxury Van Rentals" <james@silverfoxmedia.co>',
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
  sendEmail,
  sendOwnerVerificationEmail,
  sendListingSubmittedNotification,
  sendListingApprovedEmail,
  sendListingRejectedEmail
};
