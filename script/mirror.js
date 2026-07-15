// Tilt interaction for the 3D mirrors
  function bindTilt(stageId, tiltId){
    const stage = document.getElementById(stageId);
    const tilt = document.getElementById(tiltId);
    if(!stage || !tilt) return;
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform = `rotateY(${-16 + x * 30}deg) rotateX(${6 - y * 20}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      tilt.style.transform = 'rotateY(-16deg) rotateX(6deg)';
    });
  }
  bindTilt('heroStage', 'heroTilt');
  bindTilt('liveStage', 'liveTilt');

  // Click-to-capture sequence: countdown -> flash -> captured -> print slides out -> reset
  function triggerCapture(id){
    const glass = document.getElementById(id + 'Glass');
    const pill = document.getElementById(id + 'Pill');
    const countdown = document.getElementById(id + 'Countdown');
    const flash = document.getElementById(id + 'Flash');
    const captured = document.getElementById(id + 'Captured');
    const printStrip = document.getElementById(id + 'Print');
    if(!glass || glass.dataset.busy === '1') return;
    glass.dataset.busy = '1';

    pill.style.opacity = '0';
    let n = 3;
    countdown.style.opacity = '1';
    countdown.textContent = n;
    countdown.classList.remove('pop'); void countdown.offsetWidth; countdown.classList.add('pop');

    const timer = setInterval(() => {
      n--;
      if(n > 0){
        countdown.textContent = n;
        countdown.classList.remove('pop'); void countdown.offsetWidth; countdown.classList.add('pop');
      } else {
        clearInterval(timer);
        countdown.style.opacity = '0';
        flash.classList.add('flash-active');
        setTimeout(() => {
          flash.classList.remove('flash-active');
          captured.style.opacity = '1';
          printStrip.classList.add('print-out');
        }, 250);
        setTimeout(() => {
          captured.style.opacity = '0';
          printStrip.classList.remove('print-out');
          pill.style.opacity = '1';
          glass.dataset.busy = '0';
        }, 3200);
      }
    }, 650);
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });