import nodemailer from "nodemailer";

// Create transporter with necessary configurations
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000, // 5 seconds
  socketTimeout: 10000, // 10 seconds
});

// Gracefully verify the transporter on startup
const verifyTransporter = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Error during startup:", error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });
};

// Gracefully close the transporter when shutting down
const closeTransporter = () => {
  return new Promise((resolve) => {
    transporter.close(); // Close the SMTP connection
    resolve();
  });
};

// Send email function
export const sendMail = async (userEmail, password, next) => {
  try {
    const mailOptions = {
      from: `"Car Management System" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to Car Management System",
      text: `Hello,\n\nWelcome to the Car Management System!\n\nYour password is: ${password}.\n\nBest regards,\nThe Car Management System Team`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    return next(error)
  }
};

// Test email service
// const testEmailService = async () => {
//   try {
//     await sendMail("test@example.com", "testpassword");
//     console.log("Test email sent successfully");
//   } catch (error) {
//     console.error("Test email failed:", error);
//   }
// };

// // Test startup
// verifyTransporter()
//   .then(() => {
//     testEmailService(); // Test email after verifying the transporter
//   })
//   .catch((error) => {
//     console.error("SMTP Error during startup:", error);
//     process.exit(1); // Exit with failure if SMTP verification fails
//   });

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await closeTransporter(); // Ensure transporter is closed before shutdown
  process.exit(0); // Exit successfully after cleanup
});

process.on('SIGTERM', async () => {
  await closeTransporter();
  process.exit(0);
});
