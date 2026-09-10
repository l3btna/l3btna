const KEY="l3btna_data_v2";
const defaults={games:[
{id:"spy",name:"مين الكذاب؟",desc:"اكتشف الكذاب بينكم في لعبة اجتماعية مليئة بالخداع والضحك.",price:9,players:"3–8",emoji:"🕵️",type:"red"},
{id:"draw",name:"ارسم وخمّن",desc:"ارسم الكلمة وخلي أصحابك يخمنونها قبل انتهاء الوقت.",price:9,players:"3–10",emoji:"🎨",type:"purple"},
{id:"yesno",name:"لا تقول نعم ولا لا",desc:"جاوب على الأسئلة بدون الوقوع في الفخ.",price:9,players:"3–10",emoji:"🚫",type:"blue"}],orders:[],rooms:[]};
function data(){let x=localStorage.getItem(KEY);if(!x){localStorage.setItem(KEY,JSON.stringify(defaults));return structuredClone(defaults)}return JSON.parse(x)}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function renderGames(){let g=data().games,el=document.getElementById("gamesGrid");if(!el)return;el.innerHTML=g.map(x=>`<article class="game-card"><div class="cover ${x.type}">${x.emoji}</div><div class="game-info"><h3>${esc(x.name)}</h3><p>${esc(x.desc)}</p><div><span>👥 ${esc(x.players)}</span><strong>${x.price} ريال</strong></div><a class="btn" href="game.html?id=${x.id}">عرض اللعبة</a></div></article>`).join("")}
function renderGame(){let el=document.getElementById("gamePage");if(!el)return;let id=new URLSearchParams(location.search).get("id")||"spy",g=data().games.find(x=>x.id===id)||data().games[0];el.innerHTML=`<div class="detail-cover ${g.type}">${g.emoji}<span>${esc(g.name)}</span></div><div class="detail-copy"><span class="pill">ألعاب جماعية</span><h1>${esc(g.name)}</h1><p class="lead">${esc(g.desc)} شخص واحد فقط يشتري، ثم ينشئ غرفة ويدعو أصحابه مجانًا.</p><div class="stats"><span>👥 ${esc(g.players)} لاعبين</span><span>⏱ 15–30 دقيقة</span><span>⭐ 4.8</span></div><div class="buy"><strong>${g.price} ريال</strong><button class="btn primary" onclick="buyGame('${g.id}')">اشترِ الآن وابدأ</button></div></div>`}
function buyGame(id){let d=data(),g=d.games.find(x=>x.id===id),order={id:Date.now(),gameId:id,game:g.name,amount:g.price,status:"مدفوع",date:new Date().toLocaleString("ar-SA")};d.orders.push(order);let code=Math.random().toString(36).slice(2,6).toUpperCase();d.rooms.push({code,gameId:id,game:g.name,players:[{name:"أنت",host:true}],status:"waiting"});save(d);location.href="room.html?code="+code}
function renderRoom(){let code=new URLSearchParams(location.search).get("code")||"A7K9",d=data(),r=d.rooms.find(x=>x.code===code);if(!r){r={code,gameId:"spy",game:"مين الكذاب؟",players:[{name:"أنت",host:true}],status:"waiting"};d.rooms.push(r);save(d)}document.getElementById("roomCode").textContent=r.code;document.getElementById("roomGame").textContent=r.game;document.getElementById("count").textContent=(r.players.length)+"/8";document.getElementById("players").innerHTML=r.players.map(p=>`<div class="player">${p.host?"👑":"👤"}<span>${esc(p.name)}</span>${p.host?"<small>المضيف</small>":""}</div>`).join("")}
function shareRoom(){navigator.clipboard?.writeText(location.href);alert("تم نسخ رابط الغرفة")}
function startGame(){let s=document.getElementById("state");s.innerHTML="<b>🚀 بدأت الجولة الأولى!</b><br><br>هذه نسخة تجريبية محلية. عند ربط Supabase ستتزامن اللعبة بين جميع الجوالات."}
function adminLogin(){let e=document.getElementById("email").value,p=document.getElementById("password").value;if(e==="admin@l3btna.local"&&p==="L3btna@2026!"){sessionStorage.admin="1";initAdmin()}else alert("بيانات الدخول غير صحيحة")}
function logout(){sessionStorage.removeItem("admin");location.reload()}
function initAdmin(){document.getElementById("login").classList.add("hidden");document.getElementById("sidebar").classList.remove("hidden");document.getElementById("dashboard").classList.remove("hidden");renderAdmin()}
function renderAdmin(){let d=data();document.getElementById("sales").textContent=d.orders.reduce((a,o)=>a+Number(o.amount),0)+" ر.س";document.getElementById("purchases").textContent=d.orders.length;document.getElementById("gameCount").textContent=d.games.length;document.getElementById("roomCount").textContent=d.rooms.length;document.getElementById("adminGames").innerHTML=d.games.map(g=>`<div class="admin-row"><span>${g.emoji} <b>${esc(g.name)}</b><small>${g.price} ريال • ${g.players}</small></span><span><button class="btn small" onclick="editGame('${g.id}')">تعديل</button> <button class="btn small danger" onclick="deleteGame('${g.id}')">حذف</button></span></div>`).join("");document.getElementById("ordersList").innerHTML=d.orders.length?d.orders.slice().reverse().map(o=>`<div class="admin-row"><span>${esc(o.game)}<small>${o.date}</small></span><b>${o.amount} ر.س</b></div>`).join(""):"<p class=muted>لا توجد مشتريات بعد.</p>";document.getElementById("roomsList").innerHTML=d.rooms.length?d.rooms.slice().reverse().map(r=>`<div class="admin-row"><span>🔗 ${r.code}<small>${esc(r.game)}</small></span><b>${r.players.length} لاعبين</b></div>`).join(""):"<p class=muted>لا توجد غرف بعد.</p>"}
let editId=null;function showAddGame(){editId=null;document.getElementById("modalTitle").textContent="إضافة لعبة";["gName","gDesc","gPrice","gPlayers"].forEach(i=>document.getElementById(i).value="");document.getElementById("modal").classList.remove("hidden")}
function editGame(id){let g=data().games.find(x=>x.id===id);editId=id;document.getElementById("modalTitle").textContent="تعديل لعبة";document.getElementById("gName").value=g.name;document.getElementById("gDesc").value=g.desc;document.getElementById("gPrice").value=g.price;document.getElementById("gPlayers").value=g.players;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function saveGame(){let d=data(),g={id:editId||("g"+Date.now()),name:document.getElementById("gName").value||"لعبة جديدة",desc:document.getElementById("gDesc").value||"لعبة جماعية جديدة",price:Number(document.getElementById("gPrice").value)||9,players:document.getElementById("gPlayers").value||"3–8",emoji:"🎮",type:"purple"};if(editId){let i=d.games.findIndex(x=>x.id===editId);d.games[i]={...d.games[i],...g}}else d.games.push(g);save(d);closeModal();renderAdmin()}
function deleteGame(id){if(!confirm("حذف اللعبة؟"))return;let d=data();d.games=d.games.filter(x=>x.id!==id);save(d);renderAdmin()}
renderGames();renderGame();if(location.pathname.endsWith("room.html"))renderRoom();if(location.pathname.endsWith("admin.html")&&sessionStorage.admin==="1")initAdmin();
/* Customer account + mobile menu */
function customerLogin(){
  const input=document.getElementById("customerPhone");
  if(!input)return;
  const phone=input.value.trim().replace(/\s+/g,"");
  if(!/^05\d{8}$/.test(phone)){alert("اكتب رقم جوال سعودي صحيح مثل 05xxxxxxxx");return}
  localStorage.setItem("l3btna_customer_phone",phone);
  updateMenuAccount();
  closeCustomerLogin();
}
function customerLogout(){
  localStorage.removeItem("l3btna_customer_phone");
  updateMenuAccount();
}
function updateMenuAccount(){
  const phone=localStorage.getItem("l3btna_customer_phone");
  const title=document.getElementById("menuAccountTitle");
  const sub=document.getElementById("menuAccountSub");
  const login=document.getElementById("menuLoginBtn");
  const logoutBtn=document.getElementById("menuLogoutBtn");
  if(title) title.textContent=phone ? "حساب العميل" : "زائر";
  if(sub) sub.textContent=phone ? phone : "سجّل الدخول للمتابعة";
  if(login) login.classList.toggle("hidden",!!phone);
  if(logoutBtn) logoutBtn.classList.toggle("hidden",!phone);
}
function openCustomerLogin(){const m=document.getElementById("customerLogin");if(m)m.classList.remove("hidden")}
function closeCustomerLogin(){const m=document.getElementById("customerLogin");if(m)m.classList.add("hidden")}
function setupMobileMenu(){
  const toggle=document.getElementById("menuToggle"), menu=document.getElementById("mobileMenu"), overlay=document.getElementById("menuOverlay"), close=document.getElementById("menuClose");
  if(!toggle||!menu)return;
  const setOpen=v=>{menu.classList.toggle("open",v);overlay?.classList.toggle("open",v)};
  toggle.addEventListener("click",()=>setOpen(true));
  close?.addEventListener("click",()=>setOpen(false));
  overlay?.addEventListener("click",()=>setOpen(false));
  document.querySelectorAll(".menu-links a").forEach(a=>a.addEventListener("click",()=>setOpen(false)));
  document.getElementById("menuLoginBtn")?.addEventListener("click",()=>{setOpen(false);openCustomerLogin()});
  document.getElementById("menuLogoutBtn")?.addEventListener("click",()=>{customerLogout();setOpen(false)});
  document.getElementById("customerLoginClose")?.addEventListener("click",closeCustomerLogin);
  document.getElementById("customerLoginSubmit")?.addEventListener("click",customerLogin);
  updateMenuAccount();
}
setupMobileMenu();
