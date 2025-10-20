document.addEventListener('DOMContentLoaded', function () {
  // 사전예약 버튼 클릭 시 샘플 다운로드
	const sampleBtn = document.getElementById('download-sample-btn');
  if (sampleBtn) {
    sampleBtn.addEventListener('click', function () {
      const link = document.createElement('a');
      link.href = 'public/sample-emoticons.zip';
      link.download = 'sample-emoticons.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Intersection Observer로 "화면에 보일 때" 애니메이션 시작
  var preorderEl = document.querySelector('.preorder-animate');
  if (preorderEl && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          preorderEl.classList.add('is-shown');
          observer.unobserve(preorderEl);
        }
      });
    }, {
      threshold: 0.70 // 70%만 보일때 동작
    });
    observer.observe(preorderEl);
  } else if (preorderEl) {
    // IntersectionObserver 미지원 브라우저 예외 처리 (구형 환경 대응)
    preorderEl.classList.add('is-shown');
  }
});
