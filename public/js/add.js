var municipal = document.getElementById('tempAdd');
var barangay = document.getElementById('barangayTemp');
var oBarangay = document.getElementById('barangay');
var oMun = document.getElementById('mun');
call();

function call() {
  console.log();
  municipal.addEventListener('input', function () {
    console.log(this.value);
    axios.get(`/barcode/${this.value}`).then((res) => {
      console.log(res.data);
      removeOptions(barangay);
      for (data of res.data) {
        loop(data.name, data.name, barangay);
      }
    });
  });
  oMun.addEventListener('input', function () {
    axios.get(`/barcode/${this.value}`).then((res) => {
      removeOptions(oBarangay);
      for (data of res.data) {
        loop(data.name, data.name, oBarangay);
      }
    });
  });
}
function loop(req, reqVal, select) {
  //var select2 = document.getElementById('barangayTemp');
  let opt = document.createElement('option');
  opt.value = reqVal;
  opt.innerHTML = req;
  select.appendChild(opt);
}

function removeOptions(selectElement) {
  var i,
    L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}
