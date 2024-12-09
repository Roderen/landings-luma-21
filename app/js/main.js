document.addEventListener('DOMContentLoaded', () => {
  const screenWidth = window.innerWidth;
  if (screenWidth < 801) {
    const swiperProperty = new Swiper('.swiper-gallery', {
      direction: 'horizontal',
      loop: true,

      pagination: {
        el: '.gallery-swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.gallery-button-next',
        prevEl: '.gallery-button-prev',
      },
    });
  }
});


function validateForm() {
  const forms = document.querySelectorAll('form');

  const validateEmail = (email) => {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  forms.forEach(form => {
    const input = form.querySelectorAll('input');
    const name = form.querySelector('input[name="name"]');
    const phone = form.querySelector('input[name="phone"]');
    const email = form.querySelector('input[name="email"]');

    input.forEach(input => {
      input.addEventListener('change', () => {
        if (!input.value) {
          input.classList.remove('input-valid');
        } else {
          input.classList.add('input-valid');
        }
      })
    })

    $(form).on('submit', function (e) {
      e.preventDefault();

      let validation = true;

      if (name) {
        if (name.value === '') {
          validation = false;
          name.classList.add('invalid-input')
        } else {
          name.classList.remove('invalid-input')
        }
      }
      if (phone) {
        if (phone.value === '') {
          validation = false;
          phone.classList.add('invalid-input')
        } else {
          phone.classList.remove('invalid-input')
        }
      }
      if (email) {
        if (email.value === '') {
          validation = false;
          email.classList.add('invalid-input')
        } else if (!validateEmail(email.value)) {
          validation = false;
          email.classList.add('invalid-input')
        } else {
          email.classList.remove('invalid-input')
        }
      }

      // Ajax if validation
      if (validation) {
        e.preventDefault();

        const $form = $(this);
        const formSuccess = $('.form__succsess');
        $form.addClass('sending');
        var data = new FormData($form[0]);

        $.ajax({
          type: 'POST',
          url: $form.attr('action'),
          data: data,
          contentType: false,
          processData: false,
          success: (function (data) {
            if ($form.data('brochureUrl')) window.location.href = $form.data('brochureUrl');
            if ($form.hasClass('popup__form')) {
              $form.css('display', 'none')
              $form.next('.popup__thanks').css('display', 'block')
              $form.find('input').val('') && $form.find('input').removeClass('input-valid');
            }
            if ($form.hasClass('footer__form')) {
              formSuccess.css('display', 'flex')
              $form.find('input').val('') && $form.find('input').removeClass('input-valid');
            }
            $form.removeClass('sending');
            dataLayer.push({
              event: 'userEvent',
              eventCategory: 'conversions',
              eventAction: 'formSubmit',
              eventLabel: 'allLeads',
              eventNonInteraction: false,
              firingOptions: 'oncePerEvent'
            });
          }),
          error: (function () {
            alert('Oops... There was an error');
          })
        })
      }
    })
  })
}

validateForm();


/* Limit number and email */
const limitNumber = e => {
  const value = e.value;
  e.value = value.replace(/[A-Za-zА-Яа-яЁё]/g, '');
}

const limitEmail = e => {
  const value = e.value;
  e.value = value.replace(/[А-Яа-яЁё]/g, '');
}


function openPopups() {
  const popups = document.querySelectorAll('.popup');
  const popupBtn = document.querySelectorAll('.popup-button');

  popupBtn.forEach(btn => {
    btn.addEventListener('click', e => {
      popups.forEach(popup => {
        if (btn.dataset.popup == popup.dataset.popup) {
          popup.style.display = 'flex';
          setTimeout(() => {
            popup.classList.add('active');
          }, 1)
          document.body.classList.add('active');
        }
      })
    })
  })

  popups.forEach(popup => {
    const popupClose = popup.querySelector('.popup-close');

    popup.addEventListener('click', e => {
      if (e.target === popup || e.target === popupClose) {
        popup.classList.remove('active');
        setTimeout(() => {
          popup.style.display = 'none';
        }, 300)
        document.body.classList.remove('active');
      }
    })
  })
}

openPopups();


/* Form succsess =============================== */
const formSuccess = document.querySelector('.form__succsess');
const formSuccessClose = document.querySelector('.form__succsess-close');
formSuccess.addEventListener('click', (e) => {
  if (e.target === formSuccessClose || e.target === formSuccess) {
    formSuccess.style.display = 'none';
  }
})

/* For All Sites ================================== */
$(document).ready(function () {
  let userPower = {};
  $(document).on('input', 'input', function () {
    let name = $(this).attr('name');
    if (typeof userPower[name] !== "undefined") {
      userPower[name] = userPower[name] + 1;
    } else {
      userPower[name] = 1;
    }
  }).on('focus', 'input', function () {
    if (typeof userPower['focus'] !== "undefined") {
      userPower['focus'] = userPower['focus'] + 1;
    } else {
      userPower['focus'] = 1;
    }
  }).on('click', 'button, a', function () {
    if (typeof userPower['click'] !== "undefined") {
      userPower['click'] = userPower['click'] + 1;
    } else {
      userPower['click'] = 1;
    }
  });
  $('form').submit(function () {
    userPoints(userPower);
  });
});

function userPoints(userPower) {
  let user_ses = 0,
      input_score = 0;
  user_ses = user_ses + (Object.keys(userPower).length / 10);

  if (typeof userPower['focus'] !== "undefined" && userPower['focus'] >= (Object.keys(userPower).length - 2)) {
    user_ses = user_ses + 0.2;
  }
  if (typeof userPower['click'] !== "undefined") {
    user_ses = user_ses + 0.1;
  }
  for (const [key, value] of Object.entries(userPower)) {
    if (key != 'focus' && key != 'click') {
      input_score = input_score + value;
    }
  }
  if (typeof userPower['focus'] !== "undefined" && input_score >= (Object.keys(userPower).length - 2)) {
    user_ses = user_ses + 0.2;
  }
  saveCookie('user_score', user_ses);

  return user_ses;
}

function saveCookie(n, v, t = 30) {
  let saveDate = new Date(Date.now() + (60 * 60 * 24 * t * 1000));
  document.cookie = n + "=" + v + "; path=/; expires=" + saveDate.toGMTString();
}

function readCookie(name) {
  let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}