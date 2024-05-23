window.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
  
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      validateLoginForm();
    });
  
    function validateLoginForm() {
      let isValid = true;
  
      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmailInput.value.trim())) {
        loginEmailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        loginEmailError.textContent = '';
      }
  
      // Password Validation
      if (loginPasswordInput.value.trim().length < 8) {
        loginPasswordError.textContent = 'Password must be at least 8 characters long.';
        isValid = false;
      } else {
        loginPasswordError.textContent = '';
      }
  
      if (isValid) {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
  
        if (userData) {
          const { email, password } = userData;
  
          if (email === loginEmailInput.value.trim() && password === loginPasswordInput.value.trim()) {
            successMessage.textContent = 'Successful Login';
            successMessage.style.display = 'block';
            setTimeout(() => {
              window.location.href = 'app/app.html';
            }, 2000); // Delay of 2 seconds (2000 milliseconds)
          } else {
            alert('Invalid email or password.');
          }
        } else {
          alert('No user data found. Please sign up first.');
        }
      }
    }
  });
  