// Sidebar floating toggle logic and welcome name fix
function getFirstName(fullName) {
  if (!fullName) return '';
  return fullName.trim().split(' ')[0];
}

function renderSidebar() {
  var user = JSON.parse(localStorage.getItem('user') || 'null');
  var sidebarWelcome = document.getElementById('sidebar-welcome');
  var sidebarMenu = document.getElementById('sidebar-menu');
  var sidebarLogout = document.getElementById('sidebar-logout');
  var sidebarEdit = document.getElementById('sidebar-edit-name');
  if (sidebarWelcome) {
    if (user) {
      sidebarWelcome.innerHTML = 'Welcome, <b id="sidebar-user-name">' + getFirstName(user.name) + '</b>' +
        ' <a href="#" id="sidebar-edit-name" title="Edit name" style="font-size:0.9em;margin-left:6px;"><i class="fa fa-pencil"></i></a>';
    } else {
      sidebarWelcome.innerHTML = 'Welcome, Guest';
    }
  }
  if (sidebarMenu) {
    sidebarMenu.innerHTML = '';
    sidebarMenu.innerHTML += '<li><a href="index.html"><i class="fa fa-home"></i> Home</a></li>';
    sidebarMenu.innerHTML += '<li><a href="categories.html"><i class="fa fa-list"></i> Categories</a></li>';
    sidebarMenu.innerHTML += '<li><a href="foods.html"><i class="fa fa-map-marker"></i> Our Locations</a></li>';
    sidebarMenu.innerHTML += '<li><a href="order.html"><i class="fa fa-cutlery"></i> Order</a></li>';
    sidebarMenu.innerHTML += '<li><a href="contact.html"><i class="fa fa-envelope"></i> Contact</a></li>';
    if (user) {
      sidebarMenu.innerHTML += '<li><a href="profile.html"><i class="fa fa-user"></i> Profile</a></li>';
      if (sidebarLogout) sidebarLogout.style.display = 'block';
    } else {
      if (sidebarLogout) sidebarLogout.style.display = 'none';
    }
  }
  // Add floating toggle button if not present
  if (!document.getElementById('sidebar-float-toggle')) {
    var floatBtn = document.createElement('button');
    floatBtn.id = 'sidebar-float-toggle';
    floatBtn.className = 'sidebar-float-toggle';
    floatBtn.innerHTML = '<i class="fa fa-bars"></i>';
    floatBtn.style.display = 'none';
    document.body.appendChild(floatBtn);
  }
  updateSidebarFloatToggle();
}

function updateSidebarFloatToggle() {
  var sidebar = document.getElementById('sidebar');
  var floatBtn = document.getElementById('sidebar-float-toggle');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !floatBtn || !sidebarToggle) return;
  if (sidebar.classList.contains('collapsed')) {
    floatBtn.style.display = 'flex';
    // Arrow icon for opening
    floatBtn.innerHTML = '<i class="fa fa-arrow-right"></i>';
    sidebarToggle.innerHTML = '<i class="fa fa-times"></i>';
  } else {
    floatBtn.style.display = 'none';
    // X/close icon for closing
    sidebarToggle.innerHTML = '<i class="fa fa-times"></i>';
  }
}

// Sidebar toggle logic
document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.getElementById('sidebar');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var sidebarOverlay = document.getElementById('sidebar-overlay');
  var floatBtn = document.getElementById('sidebar-float-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      document.body.classList.toggle('sidebar-open', !sidebar.classList.contains('collapsed'));
      if (sidebarOverlay) sidebarOverlay.style.display = sidebar.classList.contains('collapsed') ? 'none' : 'block';
      updateSidebarFloatToggle();
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.add('collapsed');
      document.body.classList.remove('sidebar-open');
      sidebarOverlay.style.display = 'none';
      updateSidebarFloatToggle();
    });
  }
  if (floatBtn) {
    floatBtn.addEventListener('click', function() {
      sidebar.classList.remove('collapsed');
      document.body.classList.add('sidebar-open');
      if (sidebarOverlay) sidebarOverlay.style.display = 'block';
      updateSidebarFloatToggle();
    });
  }
  // Edit name logic
  document.body.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'sidebar-edit-name' || e.target.closest('#sidebar-edit-name'))) {
      e.preventDefault();
      var user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;
      var newName = prompt('Edit your name:', user.name);
      if (newName && newName.trim()) {
        user.name = newName.trim();
        localStorage.setItem('user', JSON.stringify(user));
        renderSidebar();
      }
    }
  });
  // Initial float toggle state
  updateSidebarFloatToggle();
});

// Registration logic: save user and update sidebar
document.addEventListener('DOMContentLoaded', function() {
  var registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.onsubmit = function(e) {
      e.preventDefault();
      var name = registerForm.querySelector('input[placeholder="Full Name"]').value;
      var email = registerForm.querySelector('input[placeholder="Email"]').value;
      var password = registerForm.querySelector('input[placeholder="Password"]').value;
      if (name && email && password) {
        var user = { name: name.trim(), email: email.trim(), password: password };
        localStorage.setItem('user', JSON.stringify(user));
        renderSidebar();
        alert('Registration successful!');
        // Optionally close modal if present
        var modal = document.getElementById('register-modal');
        if (modal) modal.style.display = 'none';
      }
    };
  }
});
$(function () {
  // Main Menu JS
  $(window).scroll(function () {
    if ($(this).scrollTop() < 50) {
      $("nav").removeClass("site-top-nav");
      $("#back-to-top").fadeOut();
    } else {
      $("nav").addClass("site-top-nav");
      $("#back-to-top").fadeIn();
    }
  });

  // Shopping Cart Toggle JS
  $("#shopping-cart").on("click", function () {
    $("#cart-content").toggle("blind", "", 500);
  });

  // Back-To-Top Button JS
  $("#back-to-top").click(function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1000
    );
  });

  // Delete Cart Item JS
  $(document).on("click", ".btn-delete", function (event) {
    event.preventDefault();
    $(this).closest("tr").remove();
    updateTotal();
  });

  // Update Total Price JS
  function updateTotal() {
    let total = 0;
    $("#cart-content tr").each(function () {
      const rowTotal = parseFloat($(this).find("td:nth-child(5)").text().replace("$", ""));
      if (!isNaN(rowTotal)) {
        total += rowTotal;
      }
    });
    $("#cart-content th:nth-child(5)").text("$" + total.toFixed(2));
    $(".tbl-full th:nth-child(6)").text("$" + total.toFixed(2));
  }
});