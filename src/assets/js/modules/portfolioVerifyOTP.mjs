const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const crypto = require('crypto');

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);
const ses = new SESClient({});

// CONFIGURATION - Update these values
const YOUR_EMAIL = 'brian@kageki.com'; // Email to receive login notifications
const FROM_EMAIL = 'b@brianmcconnell.me'; // Must be verified in SES
const SESSION_EXPIRY_HOURS = 24;
const COOKIE_DOMAIN = 'brianmcconnell.me'; // e.g., '.example.com' to work on all subdomains

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://www.brianmcconnell.me',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
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
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and OTP required' })
      };
    }

    // Get OTP from DynamoDB
    const otpResult = await ddb.send(new GetCommand({
      TableName: 'portfolio-otp-codes',
      Key: { email }
    }));

    if (!otpResult.Item) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid or expired OTP' })
      };
    }

    // Verify OTP
    if (otpResult.Item.otp !== otp) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid OTP' })
      };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (otpResult.Item.expiresAt < now) {
      await ddb.send(new DeleteCommand({
        TableName: 'portfolio-otp-codes',
        Key: { email }
      }));
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'OTP has expired' })
      };
    }

    // Generate session token
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = Math.floor(Date.now() / 1000) + (SESSION_EXPIRY_HOURS * 3600);

    // Store session
    await ddb.send(new PutCommand({
      TableName: 'portfolio-sessions',
      Item: {
        sessionId,
        email,
        expiresAt,
        createdAt: Date.now(),
        ip: event.requestContext?.identity?.sourceIp || 'unknown'
      }
    }));

    // Log access permanently
    await ddb.send(new PutCommand({
      TableName: 'portfolio-access-log',
      Item: {
        id: crypto.randomUUID(),
        email,
        timestamp: Date.now(),
        ip: event.requestContext?.identity?.sourceIp || 'unknown',
        userAgent: event.headers?.['User-Agent'] || 'unknown'
      }
    }));

    // Delete used OTP
    await ddb.send(new DeleteCommand({
      TableName: 'portfolio-otp-codes',
      Key: { email }
    }));

    // Send notification email to you
    try {
      await ses.send(new SendEmailCommand({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: [YOUR_EMAIL] },
        Message: {
          Subject: { Data: '🔔 New Portfolio Login' },
          Body: {
            Text: { 
              Data: `New login to your portfolio:\n\nEmail: ${email}\nTime: ${new Date().toLocaleString()}\nIP: ${event.requestContext?.identity?.sourceIp || 'unknown'}`
            },
            Html: { 
              Data: `
                <h2>🔔 New Portfolio Login</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>IP:</strong> ${event.requestContext?.identity?.sourceIp || 'unknown'}</p>
              `
            }
          }
        }
      }));
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if notification fails
    }

    // Create secure cookie
    const expiryDate = new Date(expiresAt * 1000).toUTCString();
    const cookieValue = `portfolio_session=${sessionId}; Domain=${COOKIE_DOMAIN}; Path=/; Expires=${expiryDate}; HttpOnly; Secure; SameSite=Lax`;

    console.log(`Session created for ${email}`);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Set-Cookie': cookieValue
      },
      body: JSON.stringify({ 
        message: 'Authentication successful',
        sessionId, // Also return in body for client-side storage if needed
        expiresAt
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};