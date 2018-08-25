/**
 * Оповещаем о входе в личный кабинет
 */
function renderMyAccount() {
  $.get("http://localhost:3000/customer-online-p/", {}, function (customer) {
      if (customer[0]) {
        $('#registrationMassageBox').css('display', 'block');
        $('#registrationMassageDefault').css('display', 'none');
        $("#registrationMassageCustomer").empty();
        $("#myOfficeName").empty();
        $('#registrationMassageCustomer').append(
          $('<div />', {
            text: 'Hi, ' + customer[0].name,
          })
        ).append(
          $('<a />', {
            text: 'My office',
            href: 'myOffice.html',
          })
        );
        $('.myAccountHeader a').attr(
          'href', 'myOffice.html'
        );
        $('#myOfficeName').append(
          $('<div />', {
            text: 'Hi, ' + customer[0].name,
          })
        );
        $('#formUserChangeName').append(
          $('<button />', {
            type: 'submit',
            class: 'specification-choose-buttom-grey',
            id: 'userChangeName-bnt',
            text: 'Change Name',
            'data-name': customer[0].name,
            'data-idUser': customer[0].idUser,
          })
        );
      } else {
        $('#registrationMassageBox').css('display', 'none');
        $('#registrationMassageDefault').css('display', 'block');
        $('.myAccountHeader a').attr(
          'href', 'myAccount.html'
        );
      }
  }, "json");
  $('#failureMassageSuccess').empty();
  $('#loginMassageSuccess').empty();
}

/**
 * Показываем сообщение об успешной регистрации
 */
function registrationMassageSuccess() {
  $('#registrationMassageSuccess').append(
    $('<span>', {
      text: 'You have successfully registered',
    })
  );
}

/**
 * Показываем сообщение об успешном входе в личный кабинет
 */
function loginMassageSuccess() {
  $('#loginMassageSuccess').append(
    $('<span>', {
      text: 'You have successfully signed in to your account',
    })
  );
}

/**
 * Показываем сообщение об ошибке при входе в личный кабинет
 */
function failureMassageSuccess() {
  $('#failureMassageSuccess').append(
    $('<span>', {
      text: 'You entered a username or password incorrectly',
    })
  );
}

(function ($) {
  $(document).ready(function () {
    renderMyAccount();
    /**
     * Нажатие на кнопку регистрации
     */
    $("#registration").on("click", "#join-btn", function (event) {
      let customer = {
        name: $('#registrationName').val(),
        email: $('#registrationEmail').val(),
        password: $('#registrationPassword').val(),
      };
      /**
       * Отправляем на сервер данные регистрации
       */
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/customers-p/",
        data: customer,
        success: function () {
          renderMyAccount();
          registrationMassageSuccess();
        }
      });
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/customer-online-p/",
        data: customer,
      });
      event.preventDefault();
      $('#registration')[0].reset();
    });
    /**
     * Нажатие на кнопку Login
     */
    $("#login").on("click", "#login-btn", function (event) {
      let customerLogin = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val(),
      };
      /**
       * Отправляем на сервер данные входа в личный кабинет
       */
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/customer-login-p/",
        data: customerLogin,
        success: function () {
          $.get("http://localhost:3000/customers-p/", {}, function (customer) {
            if (customer.some(function (item) {
              if (item.email === customerLogin.email && item.password === customerLogin.password) {
                $.ajax({
                  type: "POST",
                  url: "http://localhost:3000/customer-online-p/",
                  data: {
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    idUser: item.id,
                  },
                });
                return true;
              } else {
                return false;
              }
            })) {
              renderMyAccount();
              loginMassageSuccess();
            } else {
              renderMyAccount();
              failureMassageSuccess();
            }

          }, "json");
        }
      });
      /**
       * Удаляем данные с сервера при входе в личный кабинет
       */
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/customer-login-p/1",
      });
      event.preventDefault();
      $('#login')[0].reset();
    });
    /**
     * Выход из личного кабинета
     */
    $("#registrationMassageBox").on("click", "#logout-btn", function (event) {
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/customer-online-p/1",
        success: function () {
          renderMyAccount();
          console.log('exit');
        }
      });
      event.preventDefault();
    });

    /**
     * Удаляем конкретного покупателя из общего списка
     */
    $("#registration").on("click", "#registrationDel", function (event) {
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/customers-p/" + "2",
        success: function () {
          console.log('del');
        }
      });
      event.preventDefault();
    });

    /**
     * Изменяем имя потльзователя
     */
    $("#formUserChangeName").on("click", "#userChangeName-bnt", function (event) {
      let userChangeName = {
        name: $('#userChangeName').val(),
      };
      console.log(userChangeName.name);
      // /**
      //  * Удаляем покупателя из общего списка
      //  */
      // $.ajax({
      //   type: "DELETE",
      //   url: "http://localhost:3000/customers-p/" + $(this).attr('data-idUser'),
      //   success: function () {
      //     console.log('del');
      //   }
      // });
      $.get("http://localhost:3000/customer-online-p/" , {}, function (customer) {
        console.log(customer[0].idUser);
        /**
         * Добавляем пользователя с новым именем
         */
        $.ajax({
          type: "POST",
          url: "http://localhost:3000/customers-p/" + customer[0].idUser,
            success: function () {
              console.log('add ' + userChangeName.name);
            }
          // data: {
          //   name: userChangeName.name,
          //   email: customer[0].email,
          //   password: customer[0].password,
          //   idUser: customer[0].id,
          // },
        });
      });
      event.preventDefault();
    });

  });
})(jQuery);