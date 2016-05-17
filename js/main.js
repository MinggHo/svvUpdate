angular.module('invoicing', [])

// The default logo for the invoice
.constant('DEFAULT_LOGO', 'images/logologo.png')

// The invoice displayed when the user first uses the app
.constant('DEFAULT_INVOICE', {
  tax: 6.00,
  invoice_number: 'Invoice number',
  customer_info: {
    name: 'Customer Name',
    web_link: 'Customer web',
    address1: 'Customer Address',
    address2: 'Customer Address',
    postal: 'Postal'
  },
  company_info: {
    name: 'The A Team',
    web_link: 'www.thea-team.my',
    address1: 'Fakulti Teknologi Maklumat & Komunikasi',
    address2: 'Universiti Teknikal Malaysia Melaka',
    postal: '76100'
  },
  items:[
    { qty: 0, description: '', cost: 0.00 }
  ]
})

// Service for accessing local storage
.service('LocalStorage', [function() {

  var Service = {};

  // Returns true if there is a logo stored
  var hasLogo = function() {
    return !!localStorage['logo'];
  };

  // Returns a stored logo (false if none is stored)
  Service.getLogo = function() {
    if (hasLogo()) {
      return localStorage['logo'];
    } else {
      return false;
    }
  };

  Service.setLogo = function(logo) {
    localStorage['logo'] = logo;
  };

  // Checks to see if an invoice is stored
  var hasInvoice = function() {
    return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
  };

  // Returns a stored invoice (false if none is stored)
  Service.getInvoice = function() {
    if (hasInvoice()) {
      return JSON.parse(localStorage['invoice']);
    } else {
      return false;
    }
  };

  Service.setInvoice = function(invoice) {
    localStorage['invoice'] = JSON.stringify(invoice);
  };

  // Clears a stored logo
  Service.clearLogo = function() {
    localStorage['logo'] = '';
  };

  // Clears a stored invoice
  Service.clearinvoice = function() {
    localStorage['invoice'] = '';
  };

  // Clears all local storage
  Service.clear = function() {
    localStorage['invoice'] = '';
    Service.clearLogo();
  };

  return Service;

}])

.service('Currency', [function(){

  var service = {};

  service.all = function() {
    return [
      {
        name: 'Canadian Dollar ($)',
        symbol: 'CAD $ '
      },
      {
        name: 'Euro (€)',
        symbol: '€'
      },
      {
        name: 'Indian Rupee (₹)',
        symbol: '₹'
      },
      {
        name: 'Norwegian krone (kr)',
        symbol: 'kr '
      },
      {
        name: 'US Dollar ($)',
        symbol: '$'
      },
      {
        name: 'Ringgit Malaysia (RM)',
        symbol: 'RM'
      }
    ]
  }

  return service;

}])

// Main application controller
.controller('InvoiceCtrl', ['$scope', '$http', 'DEFAULT_INVOICE', 'DEFAULT_LOGO', 'LocalStorage', 'Currency',
  function($scope, $http, DEFAULT_INVOICE, DEFAULT_LOGO, LocalStorage, Currency) {

  // Set defaults
  $scope.currencySymbol = 'RM';
  $scope.logoRemoved = false;
  $scope.printMode   = false;

  (function init() {
    // Attempt to load invoice from local storage
    !function() {
      var invoice = LocalStorage.getInvoice();
      $scope.invoice = invoice ? invoice : DEFAULT_INVOICE;
    }();

    // Set logo to the one from local storage or use default
    !function() {
      var logo = LocalStorage.getLogo();
      $scope.logo = logo ? logo : DEFAULT_LOGO;
    }();

    $scope.availableCurrencies = Currency.all();

  })();
  // Adds an item to the invoice's items
  $scope.addItem = function() {
    $scope.invoice.items.push({
      qty:0,
      cost:0,
      description:""
  });
};

/* -----------------
  Check if barang exist on database
-------------------- */

$scope.check = function(id,obj){
  var elm = angular.element(obj.currentTarget);
  var elmId = elm.attr('id');


  var res = elmId.slice(5);
  var mon = "money_";
  var foo = mon.concat(res);


  var x_timer;
  clearTimeout(x_timer);

  x_timer = setTimeout(function(){
    check_username_ajax(id, foo);
  }, 1000);
};

function check_username_ajax(id, foo){
  $http({
    method : "POST",
    url : './checkbuku.php',
    data: {id : id},
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
  }).success(function(response){
    if(response=="Data not found"){
      swal({
        title: "Error!",
        text: "Data not found in database!",
        type: "error",
        confirmButtonText: "Ok"
      });
    }else{
      //alert(response);
      swal("Data found! Harga Buku: RM "+response, "Please press spacebar on cost text-box to calculate :)", "success");
      var myEl = angular.element(document.querySelector("#"+foo) ).val(response);
    }
  });
}

// Suggest data from database

$scope.suggest = function(barang){
  $http({
    method : "POST",
    url : './searchbuku.php',
    data: {barang : barang},
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
  }).success(function(response){
    angular.element(myBuku).empty();
    angular.element(myBuku).html(response);
  });
};

// Money from DB

$scope.focusMoney = function (event){

  if (event.keyCode == 32) {

  } else {
    swal("Please press spacebar :)");
  }

// $scope.focusMoney = function(barang, obj, item){

  // var elm = angular.element(obj.currentTarget);
  //
  // var elmId = elm.attr('id');
  // var res = elmId.slice(5);
  // var mon = "qty";
  // var zom = "spn";
  // var foo = mon.concat(res);
  // var barCheck = zom.concat(res);
  //
  // var cubaCheck = angular.element( document.querySelector("#"+foo) ).val();
  //
  // $http({
  //   method: "POST",
  //   url : './hargaBarang.php',
  //   data: {barang: barang},
  //   headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'}
  // }).success(function(response){
  //   var myEl = angular.element( document.querySelector("#"+elmId) ).val(response);
  //
  //   // $scope.calculateNow(response, cubaCheck, barCheck);
  // });
};

$scope.getMoney = function(barang, obj){
  // console.log(angular.element(obj.target.attr('data-id')));
  var elm = angular.element(obj.currentTarget);
  var elmId = elm.attr('id');
  $http({
    method: "POST",
    url : './hargaBarang.php',
    data: {barang: barang},
    headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'}
  }).success(function(response){
  });
};

  // Toggle's the logo
  $scope.toggleLogo = function(element) {
    $scope.logoRemoved = !$scope.logoRemoved;
    LocalStorage.clearLogo();
  };

  // Triggers the logo chooser click event
  $scope.editLogo = function() {
    // angular.element('#imgInp').trigger('click');
    document.getElementById('imgInp').click();
  };

  // Remotes an item from the invoice
  $scope.removeItem = function(item) {
    $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
  };

  // Calculate now
  $scope.calculateNow = function(response, cubaCheck, barCheck){
    var kira = 0.00;
     kira = cubaCheck*response;
    console.log(barCheck);
    // var myEl = angular.element( document.querySelector("#"+barCheck) ).text(kira);
    var myEl = angular.element( document.querySelector("#"+barCheck) ).text("RM"+kira);
    return kira;
  };

  // Calculates the sub total of the invoice
  $scope.invoiceSubTotal = function() {
    var total = 0.00;
    angular.forEach($scope.invoice.items, function(item, key){
      total += (item.qty * item.cost);
    });
    return total;
  };

  // Calculates the tax of the invoice
  $scope.calculateTax = function() {
    return (($scope.invoice.tax * $scope.invoiceSubTotal())/100);
  };

  // Calculates the grand total of the invoice
  $scope.calculateGrandTotal = function() {
    saveInvoice();
    return $scope.calculateTax() + $scope.invoiceSubTotal();
  };

  // Clears the local storage
  $scope.clearLocalStorage = function() {
    var confirmClear = confirm('Are you sure you would like to clear the invoice?');
    if(confirmClear) {
      LocalStorage.clear();
      setInvoice(DEFAULT_INVOICE);
    }
  };

  // Sets the current invoice to the given one
  var setInvoice = function(invoice) {
    $scope.invoice = invoice;
    saveInvoice();
  };

  // Reads a url
  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        LocalStorage.setLogo(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  };

  // Saves the invoice in local storage
  var saveInvoice = function() {
    LocalStorage.setInvoice($scope.invoice);
  };

  // Runs on document.ready
  angular.element(document).ready(function () {
    // Set focus
    document.getElementById('invoice-number').focus();

    // Changes the logo whenever the input changes
    document.getElementById('imgInp').onchange = function() {
      readUrl(this);
    };
  });

}])

/* -------------------
  Print Invoice
---------------------- */

function printPDF(){
  html2canvas(document.body,{
    onrendered: function(canvas){
      img = canvas.toDataURL('image/png');
      var doc = new jsPDF();
      doc.addImage(img, 'JPEG', -10,5, 255, 155);
      doc.save('test.pdf');
        }
      });
}
