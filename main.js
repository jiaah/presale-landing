// 프로모션 후 삭제 예정
const supabaseUrl = 'https://xpotcfknclblilvvehtu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwb3RjZmtuY2xibGlsdnZlaHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzUyNTUsImV4cCI6MjA3NjU1MTI1NX0.xGijop29krqMLo-25JkKIQGQXoIESCEv3ZlfmRhDtJ0';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function showNotification(message, type = 'success') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

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

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

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
			return false;
		}
		showNotification('사전 예약이 완료되었습니다! 샘플 파일을 다운로드합니다.', 'success');
		return true;
	} catch (err) {
		showNotification('오류가 발생했습니다.', 'error');
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
	const email = emailInput.value.trim();
	const success = await handleReserve(email);
	if (success) {
		downloadSample();
		emailInput.value = '';
	}
}

// 이모티콘 데이터
const femoticons = [
  { file: "e-emoticon-1" },
  { file: "e-emoticon-2" },
];

const memoticons = [
  { file: "t-emoticon-1" },
  { file: "t-emoticon-2" },
];

// 에냥이용 sample 이미지들 
const eSampleImages = Array.from({ length: 5 }, (_, i) => ({ file: `e-sample-${i + 1}` }));
// 테냥이용 sample 이미지들 
const tSampleImages = Array.from({ length: 5 }, (_, i) => ({ file: `t-sample-${i + 1}` }));

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 24개 길이의 배열 생성 (처음 2개는 에냥이/테냥이, 나머지 22개는 각각의 sample 이미지 랜덤)
const createEmoticonArray = (baseEmoticons, sampleImages) => {
  const shuffledSamples = shuffleArray(sampleImages);
  
  // sample 이미지가 5개이므로 반복해서 22개 만들기
  const repeatedSamples = Array(5).fill(shuffledSamples).flat().slice(0, 22);
  
  return [
    ...baseEmoticons,
    ...repeatedSamples
  ].map((item, index) => ({ ...item, id: index + 1 }));
};

function createEmoticonHTML(emoticons, characterName) {
  return emoticons.map((emoticon, index) => `
    <div class="emoticon-item ${index >= 2 ? 'blur' : ''}" style="transition-delay: ${index * 30}ms">
      <img
        src="public/images/${emoticon.file}.png"
        alt="${characterName} 이모티콘 ${emoticon.id}"
        class="emoticon-img"
        onerror="console.warn('이미지 로드 실패:', this.src)"
      />
    </div>
  `).join('');
}


function generateEmoticons() {
  // 에냥이 이모티콘 렌더링 (e-sample 이미지 사용)
  const femaleContainer = document.getElementById('female-emoticons');
  if (femaleContainer) {
    const femaleEmoticons = createEmoticonArray(femoticons, eSampleImages);
    femaleContainer.innerHTML = createEmoticonHTML(femaleEmoticons, '에냥이');
  }

  // 테냥이 이모티콘 렌더링 (t-sample 이미지 사용)
  const maleContainer = document.getElementById('male-emoticons');
  if (maleContainer) {
    const maleEmoticons = createEmoticonArray(memoticons, tSampleImages);
    maleContainer.innerHTML = createEmoticonHTML(maleEmoticons, '테냥이');
  }
}

function setupIntersectionObserver(selector, callback) {
  const element = document.querySelector(selector);
  if (!element) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(element);
  } else {
    callback(element);
  }
}

function setupEventListeners() {
  const sampleBtn = document.getElementById('download-sample-btn');
  const emailInput = document.getElementById('email-input');

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => processReservation(emailInput));
  }

  if (emailInput) {
    emailInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        processReservation(emailInput);
      }
    });
  }
}

function setupVideoLoading() {
  const video = document.querySelector('.promo-video');
  if (!video) return;

  // 동영상이 로드되면 skeleton 제거
  video.addEventListener('loadeddata', () => {
    video.classList.add('loaded');
  });

  // 동영상이 재생 가능할 때
  video.addEventListener('canplay', () => {
    video.classList.add('loaded');
  });

  // 동영상이 재생 시작될 때
  video.addEventListener('playing', () => {
    video.classList.add('loaded');
  });

  // 동영상 로딩 실패 시 skeleton 제거
  video.addEventListener('error', () => {
    console.warn('동영상 로딩 실패:', video.src);
    video.classList.add('loaded');
  });

  // 동영상이 이미 로드된 상태인지 확인
  if (video.readyState >= 2) {
    video.classList.add('loaded');
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  // 동영상 로딩 설정
  setupVideoLoading();

  // 이모티콘 생성
  generateEmoticons();

  // 애니메이션 설정
  setupIntersectionObserver('.animate', (element) => {
    element.classList.add('is-shown');
  });

  // 사전예약 이벤트 리스너 설정
  setupEventListeners();
});


