(function () {
  'use strict';
  
  const SUPABASE_URL = 'https://wdgscthrcgniigrnsdjo.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_1sSs7ou4vk87Bf88U4dA2A_ZK1MQBIS';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  var SUPPORT_EMAIL = 'contact@xyvro.in'; 
  var FREE = 20;
  var $ = function (id) { return document.getElementById(id); };
  
  var ICON = {
    game: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
    crown: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    micoff: '<path d="M12 19v3"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M16.95 16.95A7 7 0 0 1 5 12v-2"/><path d="M18.89 13.23A7 7 0 0 0 19 12v-2"/><path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>',
    keypad: '<g fill="currentColor" stroke="none"><circle cx="5" cy="4" r="1.7"/><circle cx="12" cy="4" r="1.7"/><circle cx="19" cy="4" r="1.7"/><circle cx="5" cy="10" r="1.7"/><circle cx="12" cy="10" r="1.7"/><circle cx="19" cy="10" r="1.7"/><circle cx="5" cy="16" r="1.7"/><circle cx="12" cy="16" r="1.7"/><circle cx="19" cy="16" r="1.7"/><circle cx="12" cy="21" r="1.7"/></g>',
    speaker: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    pause: '<g fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></g>',
    play: '<path fill="currentColor" stroke="none" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/>',
    phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    dots: '<circle cx="12" cy="5" r="1.600" fill="currentColor"/><circle cx="12" cy="12" r="1.600" fill="currentColor"/><circle cx="12" cy="19" r="1.600" fill="currentColor"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    badge: '<circle cx="12" cy="12" r="9"/><path d="M8 12.200l2.800 2.800L16 9.500"/>'
  };
  var AV = '<svg viewBox="0 0 64 64"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ecd5b5"/><stop offset="1" stop-color="#b98b62"/></linearGradient></defs><rect width="64" height="64" fill="url(#ag)"/><path d="M12 64c2-14 12-18 20-18s18 4 20 18z" fill="#f4efe6"/><ellipse cx="32" cy="29" rx="12" ry="14" fill="#2a1a12"/><ellipse cx="32" cy="31" rx="9.500" ry="11.500" fill="#d9a982"/><path d="M21 28c2-9 20-9 22 0-4-5-18-5-22 0z" fill="#2a1a12"/></svg><img src="zira.jpg" alt="" onerror="this.remove()">';

  function ic(n, s) { return '<svg width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICON[n] || '') + '</svg>'; }
  function fmt(s) { s = Math.round(s); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function fmt2(s) { s = Math.floor(s); return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); }
  
  var AUD = {};
  var S = { logged: false, name: '', gender: '', agreed: false, msgs: [], sub: false, msg_count: 0 };
  var CURRENT_USER = null;
  var revealed = false;

  function locked() { return !S.sub && S.msg_count >= FREE; }
  function show(id) { var e = $(id); if (e) e.classList.remove('hidden'); }
  function hide(id) { var e = $(id); if (e) e.classList.add('hidden'); }
  var LAYERS = ['s-terms', 's-gender', 's-logout', 's-rate', 's-support', 's-gate', 'legal'];
  function closeLayers() { LAYERS.forEach(function (l) { hide(l); }); hide('pop'); hide('scrim'); }
  
  var tt;
  function toast(m, errDetails) {
    var t = $('toast');
    if (errDetails) {
      t.innerHTML = '<span>' + m + '</span> <button id="copy-err" style="background:#fff;color:#1b1612;border-radius:12px;padding:4px 10px;margin-left:8px;font-size:13px;font-weight:600;border:none;">Copy Error</button>';
      setTimeout(() => {
        var btn = document.getElementById('copy-err');
        if(btn) {
          btn.onclick = function(e) {
            e.stopPropagation();
            if(navigator.clipboard) {
              navigator.clipboard.writeText(errDetails).then(function() {
                t.textContent = 'Copied to clipboard!';
                setTimeout(function(){ hide('toast'); }, 2000);
              });
            }
          };
        }
      }, 50);
    } else {
      t.textContent = m;
    }
    show('toast');
    clearTimeout(tt);
    tt = setTimeout(function () { hide('toast'); }, errDetails ? 10000 : 2400); 
  }

  document.querySelectorAll('[data-i]').forEach(function (e) {
    e.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICON[e.dataset.i] || '') + '</svg>';
  });
  document.querySelectorAll('.who b i svg').forEach(function (s) { s.setAttribute('width', 16); s.setAttribute('height', 16); });
  document.querySelectorAll('[data-av]').forEach(function (e) { e.innerHTML = AV; });

  function loaderOn(then, ms) { show('loader'); setTimeout(function () { then && then(); hide('loader'); }, ms || 100); }
  function reveal() { if (revealed) return; revealed = true; document.body.classList.add('ready'); hide('loader'); }

  function bubble(m, animate) {
    var d = document.createElement('div'); d.className = 'bub dynamic ' + (m.r === 'u' ? 'u' : 'z');
    if (m.v) {
      d.className = 'bub dynamic u vn'; var w = '';
      for (var q = 0; q < 24; q++) w += '<u style="height:' + (6 + (Math.abs(Math.sin(q * 1.7 + m.d)) * 16 | 0)) + 'px"></u>';
      d.innerHTML = '<button type="button" class="vplay" data-action="vplay" data-id="' + m.v + '" aria-label="Play voice note">' + ic('play', 16) + '</button><span class="wave">' + w + '</span><small>' + fmt(m.d) + '</small>';
      if (!animate) d.style.animation = 'none';
      $('feed').insertBefore(d, $('paywall')); return d;
    }
    var p = document.createElement('span'); p.textContent = m.t; d.appendChild(p);
    if (m.r === 'z' && m.a) { var v = document.createElement('button'); v.type = 'button'; v.className = 'vp'; v.textContent = 'Play her voice'; v.dataset.action = 'voice'; v.dataset.audio = m.a; d.appendChild(v); }
    if (!animate) d.style.animation = 'none';
    $('feed').insertBefore(d, $('paywall'));
    return d;
  }
  
  function scroll() { var f = $('feed'); requestAnimationFrame(function () { f.scrollTop = f.scrollHeight; }); }
  
  function renderAll() {
    document.querySelectorAll('#feed .bub.dynamic').forEach(function (b) { b.remove(); });
    var toRender = S.msgs.filter(m => m.t !== 'Hey, sab theek?');
    toRender.forEach(function (m) { bubble(m, false); });
    refresh(); scroll();
  }
  
  function refresh() {
    var left = Math.max(0, FREE - S.msg_count);
    $('quota').textContent = S.sub ? 'Unlimited with Zira Plus' : left + ' of ' + FREE + ' free left today';
    var l = locked();
    $('paywall').classList.toggle('hidden', !l); 
    $('msg').disabled = l; document.querySelector('.micbtn').disabled = l; $('msg').placeholder = l ? 'unlock Zira to keep chatting' : 'type your message';
    $('paybtn').textContent = S.sub ? 'You are on Zira Plus' : 'Start for ₹1';
    $('paybtn').disabled = S.sub;
    if (l) scroll();
  }

  function speakReal(base64Data) {
    if(!base64Data) return;
    const audio = new Audio("data:audio/mp3;base64," + base64Data);
    audio.play().catch(()=>toast('Could not play audio'));
  }

  var busy = false;
  
  async function converse(userText) {
    busy = true;
    var tp = document.createElement('div'); tp.className = 'bub dynamic z'; tp.innerHTML = '<div class="typing"><u></u><u></u><u></u></div>';
    $('feed').insertBefore(tp, $('paywall')); scroll();
    
    try {
      const historyWindow = S.msgs.slice(-14).map(m => ({
        role: m.r === 'u' ? 'user' : 'assistant',
        content: m.t
      }));

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: userText, 
          history: historyWindow, 
          generateVoice: false,
          gender: S.gender,
          name: S.name,
          isCall: false
        }
      });

      if (error) throw error;
      if (data && data.error) throw new Error(data.error); 
      
      if (tp && tp.parentNode) tp.remove();
      
      if (CURRENT_USER) {
        S.msg_count++;
        refresh();
        await supabase.from('profiles').update({ msg_count: S.msg_count }).eq('id', CURRENT_USER.id);
      }

      // FIX: Clean, reliable newline splitting instead of buggy '|||' parsing
      const rawReply = data.reply || "";
      const replies = rawReply.split(/\n+/).map(r => r.trim()).filter(r => r.length > 0);
      
      for (let i = 0; i < replies.length; i++) {
        const textPart = replies[i];
        if (i > 0) {
            var tp2 = document.createElement('div'); tp2.className = 'bub dynamic z'; tp2.innerHTML = '<div class="typing"><u></u><u></u><u></u></div>';
            $('feed').insertBefore(tp2, $('paywall')); scroll();
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 600));
            tp2.remove();
        }
        
        var r = { r: 'z', t: textPart, a: (i === 0 ? data.audio : null) }; 
        S.msgs.push(r); 
        bubble(r, true); 
        scroll();
        
        // EXPLICIT DB ERROR LOGGING
        if (CURRENT_USER) {
          const { error: dbErr } = await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: textPart }]);
          if (dbErr) {
              console.error("DB SAVE ERROR:", dbErr);
              toast("Save Failed: " + dbErr.message); // If it ghosts you again, the app will scream at you
          }
        }
      }
      
    } catch(e) {
      console.error("Zira Edge Error:", e);
      if (tp && tp.parentNode) tp.remove();
      
      let rawError = typeof e === 'object' && e.message ? e.message : String(e);
      toast('Network Error', rawError);

      const errText = "Oops! Network thoda slow hai yaar. Please ek minute baad try karo 🥲";
      var errBubble = { r: 'z', t: errText };
      S.msgs.push(errBubble);
      bubble(errBubble, true); 
      scroll();

      if (CURRENT_USER) {
        const { error: dbErr } = await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: errText }]);
        if (dbErr) toast("Save Failed: " + dbErr.message);
      }
    }
    busy = false;
  }

  async function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    if (locked()) { refresh(); return; }
    
    var m = { r: 'u', t: text }; S.msgs.push(m); bubble(m, true); 
    
    var msgEl = $('msg');
    msgEl.value = '';
    msgEl.style.height = 'auto'; 
    scroll();
    
    if (CURRENT_USER) {
      const { error: dbErr } = await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'user', content: text }]);
      if (dbErr) toast("User Save Failed: " + dbErr.message);
    }
    
    converse(text);
  }

  function sendVoice(url, dur) {
    if (busy || locked()) return;
    var id = 'v' + Date.now(); AUD[id] = url;
    var m = { r: 'u', v: id, d: dur }; S.msgs.push(m); bubble(m, true);
    scroll();
    converse("I just sent a voice note. Say something nice.");
  }
  
  var REC = { mr: null, chunks: [], t0: 0, iv: 0, stream: null, cancel: false };
  function recStart() {
    if (REC.mr || busy || locked()) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Recording is not supported on this browser'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
      REC.stream = st; REC.chunks = []; REC.cancel = false;
      var mt = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].filter(function (m) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
      var mr = mt ? new MediaRecorder(st, { mimeType: mt }) : new MediaRecorder(st);
      REC.mr = mr; mr.ondataavailable = function (e) { if (e.data && e.data.size) REC.chunks.push(e.data); };
      mr.onstop = recDone; mr.start(); REC.t0 = Date.now();
      $('comp').classList.add('recording'); show('rec'); hide('msg');
      REC.iv = setInterval(function () { $('rtime').textContent = fmt((Date.now() - REC.t0) / 1000); if (Date.now() - REC.t0 > 120000) recStop(false); }, 250);
    }).catch(function () { toast('Allow microphone access to record'); });
  }
  function recStop(cancel) { if (!REC.mr) return; REC.cancel = !!cancel; try { REC.mr.stop(); } catch (e) { recDone(); } }
  function recDone() {
    clearInterval(REC.iv);
    try { REC.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    var mr = REC.mr, dur = (Date.now() - REC.t0) / 1000; REC.mr = null;
    $('comp').classList.remove('recording'); hide('rec'); show('msg'); $('rtime').textContent = '0:00';
    if (REC.cancel) return;
    if (!REC.chunks.length || dur < .8) { toast('Hold on a little longer'); return; }
    sendVoice(URL.createObjectURL(new Blob(REC.chunks, { type: (mr && mr.mimeType) || 'audio/webm' })), dur);
  }
  
  var cur = null;
  function playNote(btn) {
    var id = btn.dataset.id, u = AUD[id];
    if (!u) { toast('This voice note is no longer on this device'); return; }
    if (cur) { cur.a.pause(); cur.b.innerHTML = ic('play', 16); var same = cur.id === id; cur = null; if (same) return; }
    var a = new Audio(u); cur = { id: id, a: a, b: btn }; btn.innerHTML = ic('pause', 16);
    a.onended = function () { btn.innerHTML = ic('play', 16); cur = null; };
    a.play().catch(function () { toast('Could not play this note'); });
  }

  var CALL = { iv: 0, t1: 0, t2: 0, t0: 0, on: false, hold: false, audioNode: null };
  var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  var callSTT = SpeechRec ? new SpeechRec() : null;
  if (callSTT) {
    callSTT.continuous = false;
    callSTT.interimResults = false;
    callSTT.lang = 'en-IN'; 
  }

  function setOn(id, on) { $(id).classList.toggle('on', on); }
  
  function callStart() {
    if (!S.sub) {
        $('gate-title').textContent = 'Voice calls are Plus';
        $('gate-desc').textContent = 'Upgrade to hear Zira and talk to her live.';
        show('s-gate');
        return;
    }
    
    if (!callSTT) { toast("Your browser doesn't support live voice."); return; }

    CALL.on = false; CALL.hold = false; $('kd').innerHTML = '&nbsp;'; $('ctime').textContent = '00:00';
    ['cb-mute', 'cb-key', 'cb-spk', 'cb-hold'].forEach(function (i) { setOn(i, false); });
    hide('kp'); $('ringw').classList.remove('live', 'hold'); $('cst').textContent = 'Calling Zira...'; show('call');
    
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        CALL.t1 = setTimeout(function () { $('cst').textContent = 'Ringing...'; }, 900);
        CALL.t2 = setTimeout(function () {
            CALL.on = true; CALL.t0 = Date.now(); 
            $('cst').textContent = 'Connected'; 
            $('ringw').classList.add('live');
            CALL.iv = setInterval(function () { $('ctime').textContent = fmt2((Date.now() - CALL.t0) / 1000); }, 500);
            triggerCallBackend("Hey Zira, I'm calling you.");
        }, 2600);
    }).catch(() => {
        hide('call'); toast('Microphone permission required for calls.');
    });
  }

  function startListening() {
    if (!CALL.on || CALL.hold || $('cb-mute').classList.contains('on')) return;
    $('cst').textContent = 'Zira is listening...';
    try { callSTT.start(); } catch(e) {}
  }

  if (callSTT) {
      callSTT.onresult = function(event) {
          if (!CALL.on) return;
          var transcript = event.results[0][0].transcript;
          
          if (CURRENT_USER) {
             S.msgs.push({ r: 'u', t: transcript });
             supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'user', content: transcript }]);
          }
          
          triggerCallBackend(transcript);
      };

      callSTT.onend = function() {
          if (CALL.on && $('cst').textContent === 'Zira is listening...') {
              startListening();
          }
      };
  }

  async function triggerCallBackend(spokenText) {
      $('cst').textContent = 'Zira is thinking...';
      try {
          const historyWindow = S.msgs.slice(-14).map(m => ({
            role: m.r === 'u' ? 'user' : 'assistant',
            content: m.t
          }));

          const { data, error } = await supabase.functions.invoke('chat', {
            body: { 
              message: spokenText, 
              history: historyWindow, 
              generateVoice: true, 
              gender: S.gender,
              name: S.name,
              isCall: true 
            }
          });

          if (error || (data && data.error)) throw new Error("Call API Error");

          if (CURRENT_USER && data.reply) {
             S.msgs.push({ r: 'z', t: data.reply });
             supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: data.reply }]);
             
             S.msg_count++;
             refresh();
             supabase.from('profiles').update({ msg_count: S.msg_count }).eq('id', CURRENT_USER.id);
          }

          if (data.audio && CALL.on) {
              $('cst').textContent = 'Zira is speaking...';
              CALL.audioNode = new Audio("data:audio/mp3;base64," + data.audio);
              CALL.audioNode.onended = function() {
                  if (CALL.on) startListening();
              };
              CALL.audioNode.play().catch(() => {
                  if (CALL.on) startListening();
              });
          } else {
              if (CALL.on) startListening();
          }

      } catch (e) {
          console.error(e);
          if (CALL.on) {
             $('cst').textContent = 'Network weak. Listening...';
             startListening();
          }
      }
  }

  function callEnd() {
    clearTimeout(CALL.t1); clearTimeout(CALL.t2); clearInterval(CALL.iv);
    var was = CALL.on, d = fmt2((Date.now() - CALL.t0) / 1000); 
    CALL.on = false;
    
    if (callSTT) { try { callSTT.stop(); } catch(e) {} }
    if (CALL.audioNode) { CALL.audioNode.pause(); CALL.audioNode = null; }

    if ($('call').classList.contains('hidden')) return;
    hide('call'); hide('kp'); 
    toast(was ? 'Call ended · ' + d : 'Call cancelled');
    
    renderAll();
  }
  
  function beep(f) {
    try { var C = window.AudioContext || window.webkitAudioContext, a = beep.c || (beep.c = new C()), o = a.createOscillator(), g = a.createGain(); o.frequency.value = f; g.gain.value = .05; o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + .09); } catch (e) {}
  }

  async function syncGo() { 
    $('go').disabled = !($('name').value.trim() && S.gender && $('agree').getAttribute('aria-checked') === 'true'); 
  }
  
  async function comply() {
    var n = $('name').value.trim(); if (!n) return;
    S.name = n; S.agreed = true;
    
    if (CURRENT_USER) {
      await supabase.from('profiles').update({ name: n, gender: S.gender }).eq('id', CURRENT_USER.id);
      
      let firstMsg = 'Hey, sab theek?';
      await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: firstMsg }]);
      S.msgs.push({ r: 'z', t: firstMsg });
    }
    hide('s-terms'); renderAll();
  }

  async function loadUserData(user) {
    CURRENT_USER = user;
    S.logged = true;
    
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) {
        S.name = prof.name || '';
        S.gender = prof.gender || '';
        S.agreed = !!prof.name && prof.name !== 'Yaar';
        S.sub = prof.sub_tier !== 'free';
        
        const today = new Date().toISOString().slice(0, 10);
        if (prof.last_reset !== today) {
          S.msg_count = 0;
          await supabase.from('profiles').update({ msg_count: 0, last_reset: today }).eq('id', user.id);
        } else {
          S.msg_count = prof.msg_count || 0;
        }
      }
      
      const { data: msgs, error: loadErr } = await supabase.from('messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (loadErr) console.error("Message Load Error:", loadErr);
      
      if (!msgs || msgs.length === 0) {
        let firstMsg = 'Hey, sab theek?';
        await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: firstMsg }]);
        S.msgs = [{ r: 'z', t: firstMsg }];
      } else {
        S.msgs = msgs.map(m => ({ r: m.role === 'zira' ? 'z' : 'u', t: m.content }));
      }
      
      hide('loader'); hide('auth'); show('chat'); 
      reveal(); 
      renderAll();
      
      if (!S.agreed) { 
          $('name').value = S.name || ''; syncGo(); show('s-terms'); 
      } else if (!S.gender) {
          show('s-gender');
      }
    } catch(e) {
      console.error("Critical Load Error:", e);
      hide('loader'); hide('auth'); show('chat'); 
      reveal(); 
      renderAll();
    }
  }

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      loadUserData(session.user);
    } else {
      setTimeout(reveal, 1400);
    }
  });
  
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) loadUserData(session.user);
    else if (event === 'SIGNED_OUT') {
      CURRENT_USER = null; S.logged = false; S.msgs = []; S.name = ''; S.gender = ''; S.msg_count = 0;
      closeLayers(); ['games', 'chess', 'call', 'plus', 'legal'].forEach(hide);
      hide('chat'); show('auth'); 
      $('name').value = ''; $('agree').setAttribute('aria-checked', 'false');
    }
  });

  var START = 'rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR'.split('');
  var G = { k: '\u265A\uFE0E', q: '\u265B\uFE0E', r: '\u265C\uFE0E', b: '\u265D\uFE0E', n: '\u265E\uFE0E', p: '\u265F\uFE0E' };
  var PIECE_NAMES = { 'p': 'Pawn', 'n': 'Knight', 'b': 'Bishop', 'r': 'Rook', 'q': 'Queen', 'k': 'King' };
  var VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
  var C = { b: START.slice(), sel: -1, turn: 'w', over: false, hints: [] };

  function isW(c) { return c !== '.' && c === c.toUpperCase(); }
  function toAlg(i) { return String.fromCharCode(97 + (i % 8)) + (8 - Math.floor(i / 8)); }

  function gen(i) {
    var p = C.b[i], w = isW(p), t = p.toLowerCase(), r = i >> 3, c = i & 7, o = [], d, j;
    function add(rr, cc, m) {
      if (rr < 0 || rr > 7 || cc < 0 || cc > 7) return false;
      var x = C.b[rr * 8 + cc];
      if (x === '.') { if (m !== 2) o.push(rr * 8 + cc); return true; }
      if (m !== 0 && isW(x) !== w) o.push(rr * 8 + cc);
      return false;
    }
    if (t === 'p') { d = w ? -1 : 1; if (add(r + d, c, 0) && r === (w ? 6 : 1)) add(r + 2 * d, c, 0); add(r + d, c - 1, 2); add(r + d, c + 1, 2); }
    else if (t === 'n') [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(function (m) { add(r + m[0], c + m[1], 1); });
    else if (t === 'k') { for (var a = -1; a < 2; a++) for (var b = -1; b < 2; b++) if (a || b) add(r + a, c + b, 1); }
    else {
      var D = t === 'b' ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : t === 'r' ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
      D.forEach(function (v) { for (j = 1; j < 8; j++) if (!add(r + v[0] * j, c + v[1] * j, 1) || C.b[(r + v[0] * j) * 8 + c + v[1] * j] !== '.') break; });
    }
    return o;
  }
  function csay(t) { $('csay').textContent = t; }
  
  async function chessVoiceReaction(promptText, boardArray) {
    try {
      let boardString = "";
      for (let r=0; r<8; r++) {
         boardString += boardArray.slice(r*8, (r+1)*8).join('') + "\n";
      }
      
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
            message: `[CHESS SYSTEM]: The user just made this move: ${promptText}\n\nCurrent Board State:\n${boardString}\n\nGive a fast, witty, 1-line Gen-Z Hinglish reaction to their move. NO EMOJIS, NO ASTERISKS. Just pure dialogue.`, 
            history: [], 
            generateVoice: true, 
            gender: S.gender, 
            name: S.name, 
            isCall: true 
        }
      });
      if (!error && data && !data.error) {
        csay(data.reply);
        if (data.audio) speakReal(data.audio);
      }
    } catch (e) {
      csay('Hmm, nice move.');
    }
  }

  var BS = 0;
  function fitBoard() {
    var w = $('bw'), b = $('bd'); if (!w || !b) return;
    var s = Math.floor(Math.min(w.clientWidth - 4, w.clientHeight - 4, 420));
    if (!(s >= 120)) s = 120;
    if (BS && Math.abs(s - BS) <= 8) return; 
    BS = s;
    b.style.width = b.style.height = s + 'px';
    b.style.fontSize = Math.floor(s / 8 * .78) + 'px';
    b.style.borderRadius = Math.max(10, Math.round(s / 18)) + 'px';
  }
  function draw() {
    var h = '';
    for (var i = 0; i < 64; i++) {
      var p = C.b[i], dark = ((i >> 3) + i) % 2 === 1;
      h += '<button type="button" class="sq ' + (dark ? 'd' : 'l') + (i === C.sel ? ' sel' : '') + (C.hints.indexOf(i) > -1 ? ' hint' : '') + '" data-action="sq" data-i="' + i + '">' + (p === '.' ? '' : '<span class="pc ' + (isW(p) ? 'w' : 'b') + '">' + G[p.toLowerCase()] + '</span>') + '</button>';
    }
    $('bd').innerHTML = h;
    $('cstat').textContent = C.over ? 'Game over. Start a new one.' : C.turn === 'w' ? 'Your move. You are white.' : 'Zira is thinking...';
  }
  function move(a, b) {
    var cap = C.b[b], p = C.b[a];
    C.b[b] = p; C.b[a] = '.';
    if (p === 'P' && b < 8) C.b[b] = 'Q'; if (p === 'p' && b > 55) C.b[b] = 'q';
    if (cap.toLowerCase() === 'k') { C.over = true; return true; }
    return false;
  }
  
  function tap(i) {
    if (C.turn !== 'w' || C.over) return;
    var p = C.b[i];
    if (isW(p)) { C.sel = i; C.hints = gen(i); }
    else if (C.sel > -1 && C.hints.indexOf(i) > -1) {
      
      var movedPiece = PIECE_NAMES[C.b[C.sel].toLowerCase()];
      var cap = C.b[i];
      var capPiece = cap !== '.' ? PIECE_NAMES[cap.toLowerCase()] : null;
      var fromSq = toAlg(C.sel);
      var toSq = toAlg(i);

      var won = move(C.sel, i); 
      C.sel = -1; C.hints = []; C.turn = 'b';
      
      draw();
      csay('Thinking...');

      if (won) {
        chessVoiceReaction(`I moved my ${movedPiece} from ${fromSq} to ${toSq} and checkmated you! I win! Give a short witty defeat reaction.`, C.b);
        C.turn = 'w';
      } else {
        let promptDesc = `I moved my ${movedPiece} from ${fromSq} to ${toSq}.`;
        if (capPiece) promptDesc += ` I captured your ${capPiece}!`;
        
        chessVoiceReaction(promptDesc, C.b).then(() => {
          setTimeout(zira, 800); 
        });
      }
    }
    draw();
  }
  
  function zira() {
    if (C.over) return;
    var best = null, sc = -1;
    for (var i = 0; i < 64; i++) if (C.b[i] !== '.' && !isW(C.b[i])) gen(i).forEach(function (t) {
      var s = (C.b[t] === '.' ? 0 : VAL[C.b[t].toLowerCase()] * 10) + Math.random() * 6; if (s > sc) { sc = s; best = [i, t]; }
    });
    if (!best) { csay('Meri koi chaal bachi hi nahi. Tum jeet gaye!'); C.over = true; draw(); return; }
    var took = C.b[best[1]], won = move(best[0], best[1]);
    C.turn = 'w'; 
    if (won) {
      csay('Checkmate. Maine tumhara raja le liya 😎');
    }
    draw();
  }
  function cnew() { C = { b: START.slice(), sel: -1, turn: 'w', over: false, hints: [] }; csay('Naya game. Chal safed teri hai.'); draw(); }

  var DOCS = {
    terms: ['Terms of Service', '<p>By using Zira you agree to these terms. You must be 13 or older. Zira is an AI companion, not a human, doctor or therapist, and replies may be wrong. Do not use it for emergencies.</p><h4>Your account</h4><p>You are responsible for activity on your account. Do not misuse the service, harass others or try to break it.</p><h4>Plans</h4><p>Free use is limited to ' + FREE + ' messages a day. Zira Plus is billed per 28-day cycle and renews until cancelled.</p><h4>Contact</h4><p>' + SUPPORT_EMAIL + '</p>'],
    privacy: ['Privacy Policy', '<p>Zira stores your name, chats and settings securely in the cloud. We do not sell your data.</p><h4>What we collect</h4><p>We process messages through providers like Google to generate responses. Your data is encrypted in transit and at rest in Supabase.</p><h4>Your choices</h4><p>You can request account deletion at any time by contacting support. Write to ' + SUPPORT_EMAIL + ' for questions or deletion requests.</p>'],
    refund: ['Refund Policy', '<p>Zira Plus is a digital subscription. You can cancel any time and keep access until the end of the paid period.</p><h4>Refunds</h4><p>If you were charged by mistake or have a billing problem, write to ' + SUPPORT_EMAIL + ' within 7 days and we will review it and respond within 5 working days. Approved refunds go back to the original payment method.</p>']
  };

  var A = {
    mode: function (e) { $('seg').dataset.mode = e.dataset.mode; $('auth-btn').textContent = e.dataset.mode === 'signup' ? 'Create account' : 'Log in'; },
    eye: function () { var p = $('pw'); p.type = p.type === 'password' ? 'text' : 'password'; },
    
    email: async function () { 
      var mode = $('seg').dataset.mode;
      var em = $('email').value.trim(), pw = $('pw').value;
      if(!em || pw.length < 8) { toast('Valid email and 8+ char password required'); return; }
      
      loaderOn(null, 10);
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: em, password: pw });
        if (error) { toast(error.message); hide('loader'); return; }
        toast('Account created! Logging in...');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: em, password: pw });
        if (error) { toast(error.message); hide('loader'); return; }
      }
    },
    
    social: function () { toast('Coming soon! Please use Email & Password.'); },
    agree: function (e) { e.setAttribute('aria-checked', e.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); syncGo(); },
    
    pickgen: function (e) {
      document.querySelectorAll('.g-btn').forEach(b => b.style.background = 'transparent');
      e.style.background = '#e6dccf';
      S.gender = e.dataset.gen;
      syncGo();
    },
    
    setgen: async function (e) {
      S.gender = e.dataset.gen;
      if (CURRENT_USER) {
        await supabase.from('profiles').update({ gender: S.gender }).eq('id', CURRENT_USER.id);
      }
      hide('s-gender');
    },

    comply: comply,
    menu: function () { var was = $('pop').classList.contains('hidden'); closeLayers(); if (was) { show('pop'); show('scrim'); } },
    
    clearchat: async function () {
      closeLayers();
      if (!CURRENT_USER) return;
      var conf = confirm("Clear all chats permanently?");
      if (!conf) return;
      loaderOn(null, 10);
      
      const { error } = await supabase.from('messages').delete().eq('user_id', CURRENT_USER.id);
      if (error) { hide('loader'); toast('Oops! Something went wrong.'); return; }
      
      S.msgs = [];
      let firstMsg = 'Hey, sab theek?';
      await supabase.from('messages').insert([{ user_id: CURRENT_USER.id, role: 'zira', content: firstMsg }]);
      S.msgs.push({ r: 'z', t: firstMsg });
      
      hide('loader');
      renderAll();
      toast('Chat cleared securely.');
    },

    games: function () { 
      closeLayers(); 
      if (S.sub) {
        show('games');
      } else {
        $('gate-title').textContent = 'Games are Plus only';
        $('gate-desc').textContent = 'Upgrade to Zira Plus to unlock live chess and interactive games.';
        show('s-gate');
      }
    },
    chess: function () { BS = 0; show('chess'); draw(); setTimeout(fitBoard, 80); setTimeout(fitBoard, 400); },
    cnew: cnew,
    sq: function (e) { tap(+e.dataset.i); },
    
    call: function () { 
      closeLayers(); 
      callStart(); 
    },
    cmute: function (e) { 
        var isMuted = !e.classList.contains('on');
        setOn('cb-mute', isMuted); 
        toast(isMuted ? 'Muted' : 'Unmuted');
        if (isMuted && callSTT) { try { callSTT.stop(); } catch(err){} }
        else if (!isMuted && CALL.on) { startListening(); }
    },
    cspk: function (e) { setOn('cb-spk', !e.classList.contains('on')); toast(e.classList.contains('on') ? 'Speaker on' : 'Speaker off'); },
    chold: function (e) { 
        CALL.hold = !e.classList.contains('on'); 
        setOn('cb-hold', CALL.hold); 
        $('ringw').classList.toggle('hold', CALL.hold); 
        $('cst').textContent = CALL.hold ? 'On hold' : (CALL.on ? 'Connected' : 'Ringing...'); 
        if (CALL.hold && callSTT) { try { callSTT.stop(); } catch(err){} }
        else if (!CALL.hold && CALL.on) { startListening(); }
    },
    ckeys: function (e) { var o = !e.classList.contains('on'); setOn('cb-key', o); o ? show('kp') : hide('kp'); },
    key: function (e) { var k = e.dataset.k, d = $('kd'); var t = d.textContent.trim(); if (t.length < 14) d.textContent = t + k; beep(600 + '123456789*0#'.indexOf(k) * 55); },
    endcall: callEnd,
    mic: recStart,
    recx: function () { recStop(true); },
    vplay: function (e) { playNote(e); },
    voice: function (e) { speakReal(e.dataset.audio); },
    plus: function () { closeLayers(); show('plus'); },
    
    pay: async function () { 
      if (!CURRENT_USER) { toast('Please log in first'); return; }
      loaderOn(null, 10);
      try {
        const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
        const { error } = await supabase.from('profiles').update({ sub_tier: 'plus', sub_expires_at: expires }).eq('id', CURRENT_USER.id);
        if (error) throw error;
        
        S.sub = true;
        refresh();
        hide('plus');
        toast('Welcome to Zira Plus! (28 Days Active)');
      } catch (e) {
        toast('Oops! Something went wrong.');
      }
      hide('loader');
    },
    
    share: function () {
      closeLayers();
      var d = { title: 'Zira', text: 'Meet Zira, your everyday companion.', url: location.href };
      if (navigator.share) navigator.share(d).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast('Link copied'); });
    },
    rate: function () {
      closeLayers(); show('r1'); hide('r2');
      document.querySelectorAll('#stars button').forEach(function (b) { b.classList.remove('on'); }); show('s-rate');
    },
    star: function (e) {
      var v = +e.dataset.v; document.querySelectorAll('#stars button').forEach(function (b) { b.classList.toggle('on', +b.dataset.v <= v); });
      setTimeout(function () { hide('r1'); show('r2'); }, 450); setTimeout(function () { hide('s-rate'); }, 1900);
    },
    support: function () { closeLayers(); show('s-support'); },
    ssend: function () {
      var t = $('stext').value.trim(); if (!t) { toast('Write a message first'); return; }
      location.href = 'mailto:' + SUPPORT_EMAIL + '?subject=' + encodeURIComponent('Zira support') + '&body=' + encodeURIComponent(t);
      $('stext').value = ''; closeLayers();
    },
    legal: function (e) { closeLayers(); var d = DOCS[e.dataset.doc]; $('ltitle').textContent = d[0]; $('lbody').innerHTML = d[1]; show('legal'); },
    
    logout: function () { closeLayers(); show('s-logout'); },
    dologout: async function () {
      loaderOn(null, 10);
      const { error } = await supabase.auth.signOut();
      hide('loader');
      if(error) toast('Logout failed');
      else toast('Logged out safely.');
    },
    restore: function () { toast('Contact support if you have paid.'); },
    close: function (e) { if (e.dataset.t) hide(e.dataset.t); else closeLayers(); }
  };
  
  var msgEl = $('msg');
  msgEl.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight <= 120 ? this.scrollHeight : 120) + 'px';
      if (!this.value) this.style.height = 'auto';
  });
  msgEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          $('comp').dispatchEvent(new Event('submit'));
          this.style.height = 'auto';
      }
  });

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-action]');
    if (a) { ev.stopPropagation(); var f = A[a.dataset.action]; if (f) { ev.preventDefault(); f(a, ev); } return; }
    var o = ev.target.closest('[data-overlay]');
    if (o && ev.target === o && !o.hasAttribute('data-lock')) { ev.stopPropagation(); closeLayers(); }
  }, false);
  $('comp').addEventListener('submit', function (e) { e.preventDefault(); e.stopPropagation(); if (REC.mr) recStop(false); else send($('msg').value); });
  $('name').addEventListener('input', syncGo);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLayers(); });

  var SCALE = 1;
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var mobile = w < 560; 
    var root = document.documentElement.style, s = 1, bw = w, bh = h;
    if (!mobile) {
      s = Math.max(.45, Math.min((w - 32) / 430, (h - 32) / 680, 1.25));
      bw = 430; bh = Math.min(780, Math.floor((h - 32) / s));
    }
    SCALE = s;
    root.setProperty('--bw', bw + 'px'); root.setProperty('--bh', bh + 'px'); root.setProperty('--s', s);
    document.body.classList.toggle('mobile', mobile);
    document.body.dataset.device = mobile ? 'mobile' : (Math.max(w, h) < 1100 ? 'tablet' : 'desktop');
  }
  window.addEventListener('resize', function () { fit(); fitBoard(); });
  if (window.ResizeObserver) new ResizeObserver(fitBoard).observe($('bw'));
  window.addEventListener('resize', fit); window.addEventListener('orientationchange', fit);
  fit();

  var CARDS = [
    ['Why ₹599?', 'Unlimited messages aur voice calls, poore 28 days ke liye. Roz ka ₹21 se bhi kam, lagbhag ek chai ke daam mein.'],
    ['No daily limit', 'Free mein 20 messages milte hain. Plus mein jitna bolna ho, bolo, koi gintee nahi.'],
    ['Live Chess', 'Zira ke saath chess khelo aur har move pe live voice commentary suno.'],
    ['Voice calls', 'Typing chhodo, seedha Zira se baat karo. Wo sunegi aur bolke jawab degi.'],
    ['Hinglish, naturally', 'Zira waise hi baat karti hai jaise tum karte ho. Na too formal, na robotic.'],
    ['Late-night company', 'Raat ke 2 baje bhi Zira jaag rahi hai. Dil halka karna ho toh bas bol do.'],
    ['Always there', 'No waiting, no judging. Just a friendly voice whenever you open the app.'],
    ['Play her voice', 'Kisi bhi reply pe tap karo aur Zira ki awaaz mein suno.'],
    ['Private by design', 'Your data is securely stored in the cloud.'],
    ['Cancel anytime', 'Pasand nahi aaya? Koi lock-in nahi, jab chaho band karo.'],
    ['Made for India', 'IST ke hisaab se, desi slang aur desi mood ke saath.'],
    ['Quick replies', 'Seedhe point pe jawab, bina lambe intezaar ke.']
  ];
  (function buildCards() {
    var h = '', k;
    for (k = 0; k < 2; k++) CARDS.forEach(function (c) { h += '<div class="rc"><small>Zira Plus</small><b>' + c[0] + '</b><p>' + c[1] + '</p></div>'; });
    $('rt').innerHTML = h;
  })();
  var cv = { x: 0, v: -38, drag: false, lx: 0, lt: 0, half: 0, t: 0 };
  function carLoop(ts) {
    requestAnimationFrame(carLoop);
    var dt = Math.min(.05, (ts - cv.t) / 1000 || 0); cv.t = ts;
    if ($('plus').classList.contains('hidden')) return;
    var tr = $('rt');
    if (!cv.half) cv.half = tr.children[CARDS.length].offsetLeft - tr.children[0].offsetLeft;
    if (!cv.drag) { cv.x += cv.v * dt; cv.v += (-38 - cv.v) * Math.min(1, dt * 3); }
    if (cv.half) { while (cv.x <= -cv.half) cv.x += cv.half; while (cv.x > 0) cv.x -= cv.half; }
    tr.style.transform = 'translate3d(' + cv.x + 'px,0,0)';
  }
  var rv = $('rv');
  rv.addEventListener('pointerdown', function (e) { cv.drag = true; cv.v = 0; cv.lx = e.clientX; cv.lt = e.timeStamp; try { rv.setPointerCapture(e.pointerId); } catch (x) {} });
  rv.addEventListener('pointermove', function (e) {
    if (!cv.drag) return;
    var dx = (e.clientX - cv.lx) / SCALE, dt = Math.max(8, e.timeStamp - cv.lt) / 1000;
    cv.x += dx; cv.v = Math.max(-1500, Math.min(1500, dx / dt)); cv.lx = e.clientX; cv.lt = e.timeStamp;
  });
  function drop() { cv.drag = false; }
  rv.addEventListener('pointerup', drop); rv.addEventListener('pointercancel', drop); rv.addEventListener('lostpointercapture', drop);
  requestAnimationFrame(carLoop);

})();
