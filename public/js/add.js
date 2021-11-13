var municipal = document.getElementById('tempAdd');

call();

function call() {
  console.log();
  municipal.addEventListener('input', function () {
    console.log(this.value);
    axios.get(`/barcode/${this.value}`).then((res) => {
      console.log(res.data);
    });
  });
}
