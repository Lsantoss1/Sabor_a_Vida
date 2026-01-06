/* christmas.js - efeitos natalinos imersivos
   Gera neve, confetes e luzes decorativas sobre o site.
*/
(function(){
  const overlayId = 'christmas-overlay';
  const overlay = document.getElementById(overlayId);
  if(!overlay) return;

  // Configurações
  const SNOW_COUNT = 28; // total de flocos simultâneos
  const CONFETTI_INTERVAL = 3500; // ms entre rajadas
  const CONFETTI_PER_BURST = 24;
  const LIGHTS_COUNT = 18;
  // Ativar/desativar efeitos
  const ENABLE_CONFETTI = false; // <<< set to false para desativar confetes

  // Utils
  function rand(min, max){ return Math.random() * (max - min) + min }
  function createEl(tag, cls){ const e = document.createElement(tag); if(cls) e.className = cls; return e }

  // --- Snow ---
  function spawnSnow(){
    for(let i=0;i<SNOW_COUNT;i++){
      const flake = createEl('div','snowflake');
      // usar um pequeno símbolo de floco simples (puro branco) para leveza
      flake.textContent = '❆';
      const size = Math.round(rand(12,28));
      flake.style.fontSize = size + 'px';
      flake.style.left = rand(0,100) + 'vw';
      const duration = rand(8,20);
      flake.style.animationDuration = duration + 's';
      flake.style.opacity = rand(0.6,1).toFixed(2);
      overlay.appendChild(flake);

      // remover ao fim da animação para não acumular
      setTimeout(()=>{ flake.remove() }, (duration*1000)+500);
    }
  }

  // spawn inicial e ciclo suave (interval spawn pequeno)
  function startSnowLoop(){
    spawnSnow();
    setInterval(spawnSnow, 4200);
  }

  // --- Confetti ---
  const confettiColors = ['#ff6b9d','#ffd93d','#6bcf7f','#6fa8ff','#a05cff'];
  function burstConfetti(){
    const startX = rand(10,90);
    for(let i=0;i<CONFETTI_PER_BURST;i++){
      const piece = createEl('div','confetti-piece');
      piece.style.background = confettiColors[Math.floor(rand(0,confettiColors.length))];
      piece.style.left = startX + rand(-8,8) + 'vw';
      piece.style.top = '-6vh';
      const sizeW = Math.round(rand(6,14));
      const sizeH = Math.round(rand(10,20));
      piece.style.width = sizeW + 'px';
      piece.style.height = sizeH + 'px';
      const duration = rand(2.4,5.2);
      piece.style.animationDuration = duration + 's';
      piece.style.transform = `rotate(${rand(0,360)}deg)`;
      overlay.appendChild(piece);
      setTimeout(()=>{ piece.remove() }, (duration*1000)+800);
    }
  }

  function startConfettiLoop(){
    burstConfetti();
    setInterval(burstConfetti, CONFETTI_INTERVAL);
  }

  // --- Fairy lights (piscas-piscas) ---
  function createFairyLights(){
    const string = createEl('div','fairy-lights');
    const colors = ['red','green','blue','yellow','red','green'];
    for(let i=0;i<LIGHTS_COUNT;i++){
      const bulb = createEl('div','fairy-bulb');
      const cls = colors[i % colors.length];
      bulb.classList.add(cls);
      // stagger animation so bulbs twinkle independently
      bulb.style.animationDelay = (rand(0,2))+'s';
      bulb.style.opacity = rand(0.6,1).toFixed(2);
      // slight vertical offset for organic look
      bulb.style.transform = `translateY(${rand(-2,4)}px)`;
      string.appendChild(bulb);
    }
    overlay.appendChild(string);
  }

  // --- Hanging ornament (bola decorativa) ---
  function createHangingOrnament(){
    const orb = createEl('div','hanging-ornament');
    // show a small emoji or logo inside for charm
    const inner = createEl('div');
    inner.textContent = '★';
    inner.style.fontSize = '28px';
    inner.style.mixBlendMode = 'screen';
    orb.appendChild(inner);
    overlay.appendChild(orb);
  }

  // --- Toggle (acessibilidade) ---
  function createToggle(){
    try{
      const btn = document.createElement('button');
      btn.className = 'christmas-toggle btn btn-secondary';
      btn.type = 'button';
      btn.title = 'Ativar/desativar efeitos natalinos';
      btn.textContent = '🎄';
      btn.addEventListener('click', ()=>{
        const on = document.body.classList.toggle('no-christmas');
        btn.textContent = on ? '❄️' : '🎄';
        // se desativado, limpar overlay
        if(document.body.classList.contains('no-christmas')) overlay.innerHTML = '';
        else initialize();
      });
      document.body.appendChild(btn);
    }catch(e){/* silencioso */}
  }

  // Inicialização principal
  let initialized = false;
  function initialize(){
    if(initialized) return;
    initialized = true;
    startSnowLoop();
    if(ENABLE_CONFETTI) startConfettiLoop();
    createFairyLights();
    createHangingOrnament();
  }

  // start when DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initialize);
  } else initialize();

  // small performance safeguard: pause effects when user switches tab
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) overlay.style.display = 'none';
    else overlay.style.display = '';
  });

})();
