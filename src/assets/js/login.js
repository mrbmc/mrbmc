// UPDATE THIS with your API Gateway endpoint
const API_ENDPOINT = 'https://9npc66dbde.execute-api.us-east-1.amazonaws.com/production';

const emailStep = document.getElementById('emailStep');
const otpStep = document.getElementById('otpStep');
const emailForm = document.getElementById('emailForm');
const otpForm = document.getElementById('otpForm');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const userEmailDisplay = document.getElementById('userEmail');
const backLink = document.getElementById('backLink');

let userEmail = '';

// Request OTP
emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('emailBtn');
  const messageDiv = document.getElementById('emailMessage');
  
  btn.disabled = true;
  btn.textContent = 'Sending...';
  messageDiv.innerHTML = '';

  try {
    const response = await fetch(`${API_ENDPOINT}/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value })
    });

    const data = await response.json();

    if (response.ok) {
      userEmail = emailInput.value;
      userEmailDisplay.textContent = userEmail;
      emailStep.style.display = 'none';
      otpStep.style.display = 'block';
      otpInput.focus();
    } else {
      messageDiv.innerHTML = `<div class="message error">${data.error || 'Failed to send code'}</div>`;
    }
  } catch (error) {
    messageDiv.innerHTML = '<div class="message error">Network error. Please try again.</div>';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Access Code';
  }
});

// Verify OTP
otpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('otpBtn');
  const messageDiv = document.getElementById('otpMessage');
  
  btn.disabled = true;
  btn.textContent = 'Verifying...';
  messageDiv.innerHTML = '';

  try {
    const response = await fetch(`${API_ENDPOINT}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        email: userEmail, 
        otp: otpInput.value 
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store session token in localStorage as backup
      localStorage.setItem('portfolio_session', data.sessionId);
      
      // Manually set cookie using JavaScript
      const expiryDate = new Date(data.expiresAt * 1000).toUTCString();
      document.cookie = `portfolio_session=${data.sessionId}; domain=.brianmcconnell.me; path=/; expires=${expiryDate}; secure; samesite=lax`;

      messageDiv.innerHTML = '<div class="message success">✓ Access granted! Redirecting...</div>';
      
      // Redirect to original page or home
      const params = new URLSearchParams(window.location.search);
      const redirect = decodeURIComponent(params.get('redirect') || '/');
      setTimeout(() => window.location.href = redirect, 1000);
    } else {
      messageDiv.innerHTML = `<div class="message error">${data.error || 'Invalid code'}</div>`;
      otpInput.value = '';
      otpInput.focus();
    }
  } catch (error) {
    messageDiv.innerHTML = '<div class="message error">Network error. Please try again.</div>';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Verify & Access';
  }
});

// Back to email step
backLink.addEventListener('click', (e) => {
  e.preventDefault();
  otpStep.style.display = 'none';
  emailStep.style.display = 'block';
  otpInput.value = '';
  document.getElementById('otpMessage').innerHTML = '';
});

// Auto-focus email on load
emailInput.focus();

