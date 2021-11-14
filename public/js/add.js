var municipal = document.getElementById('tempAdd');
var barangay = document.getElementById('barangayTemp');
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
