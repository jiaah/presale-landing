// 프로모션 후 삭제 예정,
const supabaseUrl = 'https://xpotcfknclblilvvehtu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3RjZmtuY2xibGlsdnZlaHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzUyNTUsImV4cCI6MjA3NjU1MTI1NX0.xGijop29krqMLo-25JkKIQGQXoIESCEv3ZlfmRhDtJ0';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function showNotification(message, type = 'success') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // 새 알림 생성
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? '✅' : '❌';
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // 애니메이션으로 표시
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // 3초 후 자동 제거
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

async function handleReserve(email) {
	if (!email) {
		showNotification('이메일을 입력해주세요.', 'error');
		return false;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		showNotification('유효한 이메일을 입력해주세요.', 'error');
		return false;
	}

	try {
		const { error } = await supabase.from('emails').insert([{ email }]);
		if (error) {
			showNotification('저장 중 오류가 발생했습니다.', 'error');
			console.error(error);
			return false;
		}
		showNotification('사전 예약이 완료되었습니다! 샘플 파일을 다운로드합니다.', 'success');
		return true;
	} catch (err) {
		showNotification('오류가 발생했습니다.', 'error');
		console.error(err);
		return false;
	}
}

function downloadSample() {
	const link = document.createElement('a');
	link.href = 'public/sample-emoticons.zip';
	link.download = 'sample-emoticons.zip';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

async function processReservation(emailInput) {
	console.log('emailInput', emailInput);
	const email = emailInput.value.trim();
	const success = await handleReserve(email);
	if (success) {
		downloadSample();
		emailInput.value = '';
	}
}

document.addEventListener('DOMContentLoaded', async function () {
	// Intersection Observer로 "화면에 보일 때" 애니메이션 시작
	const preorderEl = document.querySelector('.preorder-animate');
	if (preorderEl && 'IntersectionObserver' in window) {
		const observer = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					preorderEl.classList.add('is-shown');
					observer.unobserve(preorderEl);
				}
			});
		}, {
			threshold: 0.1
		});
		observer.observe(preorderEl);
	} else if (preorderEl) {
		preorderEl.classList.add('is-shown');
	}

	
  const sampleBtn = document.getElementById('download-sample-btn');
  const emailInput = document.getElementById('email-input');

  // 버튼 클릭 시 처리
  if (sampleBtn) {
    sampleBtn.addEventListener('click', function () {
      processReservation(emailInput);
    });
  }

  // Enter 키 입력 시 처리
  if (emailInput) {
    emailInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        processReservation(emailInput);
      }
    });
  }
});


