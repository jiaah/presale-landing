document.addEventListener('DOMContentLoaded', function () {
  const sampleBtn = document.getElementById('download-sample-btn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', function () {
      const link = document.createElement('a');
      link.href = '/sample-emoticons.zip';
      link.download = 'sample-emoticons.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  setTimeout(function() {
    var el = document.querySelector('.preorder-animate');
    if (el) el.classList.add('is-shown');
  }, 100);
});
