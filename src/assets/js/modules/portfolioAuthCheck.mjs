const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

// NOTE: Lambda@Edge must be deployed in us-east-1
const ddbClient = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(ddbClient);

const LOGIN_PAGE = '/login/'; // Path to your login page on S3

exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // Allow access to login page and auth API
  if (request.uri === LOGIN_PAGE || request.uri.startsWith('/api/')) {
    return request;
  }

  // Extract session cookie
  const cookieHeader = headers.cookie ? headers.cookie[0].value : '';
  const sessionMatch = cookieHeader.match(/portfolio_session=([^;]+)/);
  
  if (!sessionMatch) {
    return redirectToLogin(request.uri);
  }

  const sessionId = sessionMatch[1];

  try {
    // Verify session in DynamoDB
    const result = await ddb.send(new GetCommand({
      TableName: 'portfolio-sessions',
      Key: { sessionId }
    }));

    if (!result.Item) {
      return redirectToLogin(request.uri);
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (result.Item.expiresAt < now) {
      return redirectToLogin(request.uri);
    }

    // Session valid, allow request
    return request;

  } catch (error) {
    console.error('Auth check error:', error);
    return redirectToLogin(request.uri);
  }
};

function redirectToLogin(originalUri) {
  return {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [{
        key: 'Location',
        value: `${LOGIN_PAGE}?redirect=${encodeURIComponent(originalUri)}`
      }]
    }
  };
}