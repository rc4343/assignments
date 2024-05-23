window.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const dobError = document.getElementById('dobError');
    const termsError = document.getElementById('termsError');
    const passwordStrengthMeter = document.getElementById('passwordStrength');
  
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;
  
      // Name Validation
      if (nameInput.value.trim().length < 4) {
        nameError.textContent = 'Name must be at least 4 characters long.';
        isValid = false;
      } else {
        nameError.textContent = '';
      }
  
      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }
  
      // Password Validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(passwordInput.value.trim())) {
        passwordError.textContent = 'Password must contain at least one uppercase letter and one number.';
        isValid = false;
      } else {
        passwordError.textContent = '';
      }
  
      // Confirm Password Validation
      if (confirmPasswordInput.value.trim() !== passwordInput.value.trim()) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
      } else {
        confirmPasswordError.textContent = '';
      }
  
      // Date of Birth Validation
      const dob = new Date(document.getElementById('dob').value);
      const today = new Date();
      if (dob > today) {
        dobError.textContent = 'Date of birth cannot be in the future.';
        isValid = false;
      } else {
        dobError.textContent = '';
      }
  
      // Terms and Conditions Validation
      const termsCheckbox = document.getElementById('terms');
      if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions.';
        isValid = false;
      } else {
        termsError.textContent = '';
      }
  
      if (isValid) {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
  
        // Save user data to localStorage
        const userData = {
          name,
          email,
          password
        };
        localStorage.setItem('userData', JSON.stringify(userData));
  
        successMessage.style.display = 'block'; // Show the success message
        signupForm.reset();
      }
    });
  
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      updatePasswordStrengthMeter(strength);
    });
  
    function calculatePasswordStrength(password) {
      let strength = 0;
  
      // Check password length
      if (password.length >= 8) {
        strength += 1;
      }
  
      // Check for uppercase letters
      if (/[A-Z]/.test(password)) {
        strength += 1;
      }
  
      // Check for lowercase letters
      if (/[a-z]/.test(password)) {
        strength += 1;
      }
  
      // Check for numbers
      if (/\d/.test(password)) {
        strength += 1;
      }
  
      // Check for special characters
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strength += 1;
      }
  
      return strength;
    }
  
    function updatePasswordStrengthMeter(strength) {
      switch (strength) {
        case 1:
          passwordStrengthMeter.classList.remove('medium', 'strong', 'very-strong');
          passwordStrengthMeter.classList.add('weak');
          break;
        case 2:
          passwordStrengthMeter.classList.remove('weak', 'strong', 'very-strong');
          passwordStrengthMeter.classList.add('medium');
          break;
        case 3:
          passwordStrengthMeter.classList.remove('weak', 'medium', 'very-strong');
          passwordStrengthMeter.classList.add('strong');
          break;
        case 4:
        case 5:
          passwordStrengthMeter.classList.remove('weak', 'medium', 'strong');
          passwordStrengthMeter.classList.add('very-strong');
          break;
        default:
          passwordStrengthMeter.classList.remove('weak', 'medium', 'strong', 'very-strong');
          break;
      }
    }
  });
  