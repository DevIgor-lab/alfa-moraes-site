/* Alfa Moraes Engenharia — configurações editáveis */
var WA_NUMBER = "5511999999999"; // troque pelo WhatsApp real (55 + DDD + número)
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function waLink(text) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
}
document.querySelectorAll("[data-wa]").forEach(function (a) {
  a.href = waLink(a.getAttribute("data-wa"));
  a.target = "_blank";
  a.rel = "noopener";
});

/* menu mobile e submenu de serviços */
var nav = document.getElementById("nav");
var burger = document.getElementById("burger");
if (burger) {
  burger.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });
}
document.querySelectorAll(".has-sub > button").forEach(function (b) {
  b.addEventListener("click", function () {
    var p = b.parentElement, open = p.classList.toggle("open");
    b.setAttribute("aria-expanded", open);
  });
});
document.addEventListener("click", function (e) {
  document.querySelectorAll(".has-sub.open").forEach(function (s) {
    if (!s.contains(e.target)) { s.classList.remove("open"); s.firstElementChild.setAttribute("aria-expanded", "false"); }
  });
});

/* hero: águia gritando (reinicia ao atualizar ou voltar à página) e carrossel de vídeos */
var medal = document.getElementById("medal");
if (medal) {
  if (reduce) { medal.src = medal.getAttribute("data-still"); }
  else {
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) { var s = medal.src; medal.src = ""; medal.src = s; }
    });
  }
}
var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-media video"));
var dotsBox = document.getElementById("dots");
var capt = document.getElementById("caption");
if (slides.length) {
  var cur = 0, timer = null;
  slides.forEach(function (v, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ver vídeo " + (i + 1) + ": " + v.getAttribute("data-label"));
    b.addEventListener("click", function () { show(i, true); });
    dotsBox.appendChild(b);
    v.addEventListener("ended", function () { if (i === cur) show((cur + 1) % slides.length); });
  });
  var dots = dotsBox.children;
  function show(i, manual) {
    slides[cur].classList.remove("on"); dots[cur].classList.remove("on");
    var old = slides[cur];
    cur = i;
    var v = slides[cur];
    v.currentTime = 0; v.classList.add("on"); dots[cur].classList.add("on");
    capt.textContent = v.getAttribute("data-label");
    if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    setTimeout(function () { if (old !== slides[cur]) old.pause(); }, 1300);
  }
  show(0);
  document.addEventListener("visibilitychange", function () {
    var v = slides[cur];
    if (reduce) return;
    if (document.hidden) v.pause(); else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  });
}

/* filtro do portfólio */
var fbtns = document.querySelectorAll(".filters button");
fbtns.forEach(function (b) {
  b.addEventListener("click", function () {
    fbtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    var f = b.getAttribute("data-f");
    document.querySelectorAll(".work").forEach(function (w) {
      w.hidden = !(f === "todos" || w.getAttribute("data-t") === f);
    });
  });
});

/* formulário: monta a mensagem e abre o WhatsApp */
var form = document.getElementById("orcamento");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var t = "Olá! Meu nome é " + v("f-nome") + ". Gostaria de um orçamento de: " + v("f-serv") + "." +
      (v("f-local") ? " Local e tipo de imóvel: " + v("f-local") + "." : "") +
      (v("f-msg") ? " " + v("f-msg") : "") + " Meu WhatsApp: " + v("f-tel");
    window.open(waLink(t), "_blank", "noopener");
  });
}
var yr = document.getElementById("ano");
if (yr) yr.textContent = new Date().getFullYear();
