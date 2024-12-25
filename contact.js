$(document).ready(function() {
    const form = $('#contactForm');
    
    const validators = {
        firstName: (value) => {
            if (!value) return 'First name is required';
            if (value.length < 2) return 'First name must be at least 2 characters';
            if (!/^[a-zA-Z\s]*$/.test(value)) return 'First name can only contain letters';
            return '';
        },
        
        lastName: (value) => {
            if (!value) return 'Last name is required';
            if (value.length < 2) return 'Last name must be at least 2 characters';
            if (!/^[a-zA-Z\s]*$/.test(value)) return 'Last name can only contain letters';
            return '';
        },
        
        mobile: (value) => {
            if (!value) return 'Mobile number is required';
            if (!/^\d{10}$/.test(value.replace(/[\s-]/g, ''))) {
                return 'Please enter a valid 10-digit mobile number';
            }
            return '';
        },
        
        address: (value) => {
            if (!value) return 'Address is required';
            if (value.length < 10) return 'Please enter a complete address';
            return '';
        },
        
        age: (value) => {
            if (!value) return 'Age is required';
            const age = parseInt(value);
            if (isNaN(age) || age < 18 || age > 120) {
                return 'Age must be between 18 and 120';
            }
            return '';
        },
        
        hobbies: (value) => {
            if (!value) return 'Please enter at least one hobby';
            const hobbies = value.split(',').map(h => h.trim()).filter(h => h);
            if (hobbies.length === 0) return 'Please enter at least one hobby';
            return '';
        },
        
        country: (value) => {
            if (!value) return 'Please select a country';
            return '';
        }
    };
    
    function validateField(field) {
        const value = field.value.trim();
        const validator = validators[field.name];
        const errorMessage = validator ? validator(value) : '';
        
        const formGroup = $(field).closest('.form-group');
        const errorDisplay = formGroup.find('.error-message');
        
        if (errorMessage) {
            formGroup.addClass('error');
            errorDisplay.text(errorMessage);
            return false;
        } else {
            formGroup.removeClass('error');
            errorDisplay.text('');
            return true;
        }
    }
    
   
    form.find('input, textarea, select').on('input blur', function() {
        validateField(this);
    });
    
    $('#mobile').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        
        
        if (value.length >= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        } else if (value.length >= 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        $(this).val(value);
    });
    
    
    form.on('submit', function(e) {
        e.preventDefault();
        
       
        let isValid = true;
        form.find('input, textarea, select').each(function() {
            if (!validateField(this)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            
            const formData = {
                firstName: $('#firstName').val().trim(),
                lastName: $('#lastName').val().trim(),
                mobile: $('#mobile').val().trim(),
                address: $('#address').val().trim(),
                age: $('#age').val().trim(),
                hobbies: $('#hobbies').val().trim().split(',').map(h => h.trim()),
                country: $('#country').val()
            };
            
          
            form.hide();
            $('.success-message').fadeIn();
            
           
            setTimeout(() => {
                form[0].reset();
                form.show();
                $('.success-message').hide();
            }, 3000);
            
            console.log('Form submitted:', formData);
        }
    });
});