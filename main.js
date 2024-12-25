$(document).ready(function() {
    
    let cart = [];
    const cartSidebar = $('.cart-sidebar');
    const cartButton = $('.cart-button');
    const closeCart = $('.close-cart');
    const cartCount = $('.cart-count');
    
    cartButton.click(function() {
        cartSidebar.addClass('open');
    });
    
    closeCart.click(function() {
        cartSidebar.removeClass('open');
    });
    
    $('.add-to-cart').click(function() {
        const productCard = $(this).closest('.product-card');
        const product = {
            name: productCard.find('h3').text(),
            price: productCard.find('.price').text(),
            image: productCard.find('img').attr('src')
        };
        
        addToCart(product);
        showAddedMessage($(this));
    });
    
    function addToCart(product) {
        cart.push(product);
        updateCartCount();
        updateCartDisplay();
    }
    
    function updateCartCount() {
        cartCount.text(cart.length);
    }
    
    function updateCartDisplay() {
        const cartItems = $('.cart-items');
        cartItems.empty();
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price;
            
            cartItems.append(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${item.price}</span>
                    </div>
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `);
        });
        
        $('.total-amount').text('$' + total.toFixed(2));
        
        $('.remove-item').click(function() {
            const index = $(this).data('index');
            cart.splice(index, 1);
            updateCartCount();
            updateCartDisplay();
        });
    }
    
    function showAddedMessage(button) {
        const originalText = button.text();
        button.text('Added to Cart')
              .prop('disabled', true);
        
        setTimeout(() => {
            button.text(originalText)
                  .prop('disabled', false);
        }, 1500);
    }
    
    
    $('.newsletter-form').submit(function(e) {
        e.preventDefault();
        const form = $(this);
        const email = form.find('input[type="email"]').val();
        
        if (email) {
           
            const successMessage = $('<div class="success-message">Thank you for subscribing!</div>');
            form.after(successMessage);
            
            
            form.find('input[type="email"]').val('');
            
            setTimeout(() => {
                successMessage.fadeOut(() => successMessage.remove());
            }, 3000);
        }
    });
    
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.main-nav').css('background-color', 'rgba(255, 255, 255, 0.98)');
        } else {
            $('.main-nav').css('background-color', 'rgba(255, 255, 255, 0.95)');
        }
    });
    
    function initFadeIn() {
        const fadeElements = $('.fade-in');
        fadeElements.each(function() {
            const element = $(this);
            const elementPosition = element.offset().top;
            const windowHeight = $(window).height();
            const scrollPosition = $(window).scrollTop();
            
            if (scrollPosition + windowHeight > elementPosition) {
                element.addClass('visible');
            }
        });
    }
    
  
    $(window).scroll(_.debounce(initFadeIn, 100));
    
    initFadeIn();
});