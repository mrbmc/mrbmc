const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const crypto = require('crypto');

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);
const ses = new SESClient({});

// CONFIGURATION - Update these values
const YOUR_EMAIL = 'brian@kageki.com'; // Email to receive notifications
const FROM_EMAIL = 'b@brianmcconnell.me'; // Must be verified in SES
const OTP_EXPIRY_MINUTES = 10;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://www.brianmcconnell.me',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let body;
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } else {
      body = event; // Direct invocation
    }
    const email = body.email?.toLowerCase().trim();

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' })
      };
    }

    // Generate 6-digit OTP and magic link token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const magicToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Math.floor(Date.now() / 1000) + (OTP_EXPIRY_MINUTES * 60);

    // Store OTP in DynamoDB
    await ddb.send(new PutCommand({
      TableName: 'portfolio-otp-codes',
      Item: {
        email,
        otp,
        magicToken,
        expiresAt,
        createdAt: Date.now()
      }
    }));

    // Create magic link
    const magicLink = `https://www.brianmcconnell.me/login/?token=${magicToken}&email=${encodeURIComponent(email)}`;

    // Send OTP to user
    await ses.send(new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Your Access Code for Brian\'s Portfolio' },
        Body: {
          Text: { Data: `Your one-time access code is: ${otp}\n\nOr click this link to verify automatically:\n${magicLink}\n\nThis code expires in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you didn't request this, please ignore this email.` },
          Html: { Data: `
            <p>Your one-time access code for Brian's portfolio is:</p>
            <h1 style="font-size: 32px; letter-spacing: 8px; color: #333;">${otp}</h1>
            <p style="margin: 20px 0;">Or click the button below to verify automatically:</p>
            <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Access</a>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          `}
        }
      }
    }));

    console.log(`OTP sent to ${email}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'OTP sent successfully',
        expiresIn: OTP_EXPIRY_MINUTES * 60
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send OTP' })
    };
  }
};