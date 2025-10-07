document.addEventListener('DOMContentLoaded', () => {
    // --- Efeito digitação no título ---
    const titulo = document.querySelector('#nomeLoja');
    if (titulo) {
        let i = 0;
        const textoOriginal = titulo.textContent;
        titulo.textContent = '';
        setTimeout(function digitar() {
            if (i < textoOriginal.length) {
                titulo.textContent += textoOriginal.charAt(i++);
                setTimeout(digitar, 100);
            }
        }, 500);
    }

    // --- Contador de visitas ---
    let visitas = (parseInt(localStorage.getItem('visitas')) || 0) + 1;
    localStorage.setItem('visitas', visitas);
    if (visitas === 1) mostrarNotificacao('🎊 Bem-vindo à Imaginaria Store! Use IMAGINE15 para 15% de desconto!');

    // --- Função global de notificação ---
    function mostrarNotificacao(msg) {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `<div class="notification-content"><span>${msg}</span><button onclick="this.parentElement.parentElement.remove()">×</button></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    // --- Atualizar contador do carrinho ---
    function atualizarContadorCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItens = carrinho.reduce((t, i) => t + i.quantidade, 0);
        const contador = document.getElementById('carrinho-count');
        if (contador) {
            contador.textContent = totalItens;
            if (totalItens > 0) {
                Object.assign(contador.style, { display: 'inline-block', background: '#ff4444', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8em', marginLeft: '5px' });
            } else contador.style.display = 'none';
        }
    }
    atualizarContadorCarrinho();

    // --- Função confete ---
    function lancarConfete() {
        const cores = ['#D0F4BD','#B5C0F5','#FFD700','#FF6B6B','#4ECDC4'];
        for(let i=0;i<100;i++){
            const c = document.createElement('div');
            Object.assign(c.style, {position:'fixed', width:'10px', height:'10px', borderRadius:'50%', top:'0', left:`${Math.random()*100}vw`, backgroundColor:cores[Math.floor(Math.random()*cores.length)], pointerEvents:'none', zIndex:'9999'});
            document.body.appendChild(c);
            const anim = c.animate([{transform:'translateY(0) rotate(0deg)', opacity:1},{transform:`translateY(${window.innerHeight}px) rotate(${Math.random()*360}deg)`, opacity:0}],{duration:1000+Math.random()*2000, easing:'cubic-bezier(0.1,0.8,0.2,1)'});
            anim.onfinish = ()=>c.remove();
        }
    }

    // --- Event delegation para botões de compra ---
    document.addEventListener('click', e => {
        if(e.target.classList.contains('btn-comprar')){
            const b = e.target;

            // ripple
            const circle = document.createElement('span');
            const d = Math.max(b.clientWidth,b.clientHeight), r = d/2;
            Object.assign(circle.style,{width:`${d}px`, height:`${d}px`, left:`${e.clientX-b.getBoundingClientRect().left-r}px`, top:`${e.clientY-b.getBoundingClientRect().top-r}px`});
            circle.classList.add('ripple');
            const oldRipple = b.querySelector('.ripple'); if(oldRipple) oldRipple.remove();
            b.appendChild(circle);

            // efeito clique
            b.style.transform='scale(0.95)';
            setTimeout(()=>b.style.transform='',150);

            // dados do produto
            const id = b.getAttribute('data-produto-id'), nome = b.getAttribute('data-produto-nome'), preco = parseFloat(b.getAttribute('data-produto-preco'));
            if(!id || !nome || isNaN(preco)) return console.warn('Produto sem atributos corretos');

            // carrinho
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            const pExist = carrinho.find(p=>p.id===id);
            if(pExist) pExist.quantidade++; else carrinho.push({id,nome,preco,quantidade:1});
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContadorCarrinho();
            mostrarNotificacao(`🎉 ${nome} adicionado ao carrinho!`);

            // efeito botão
            const txt = b.innerHTML;
            b.innerHTML='✅ ADICIONADO!';
            b.style.background='linear-gradient(45deg,#45a049,#4CAF50)';
            lancarConfete();
            setTimeout(()=>{b.innerHTML=txt;b.style.background='linear-gradient(45deg,#4CAF50,#45a049)';},2000);
        }
    });

    // --- Ticker ---
    const ticker = document.querySelector('.ticker-wrapper');
    if(ticker){
        ticker.addEventListener('mouseenter',()=>ticker.style.animationPlayState='paused');
        ticker.addEventListener('mouseleave',()=>ticker.style.animationPlayState='running');
        ticker.addEventListener('click',()=>{
            const promocoes=["🔥 PROMOÇÃO RELÂMPAGO: 5% DE DESCONTO NO LANÇAMENTO DO MELHOR CHEFE DO MUNDO!","🚚 FRETE GRÁTIS PARA TODO BRASIL!","💳 PARCELE EM ATÉ 12X SEM JUROS!","🎁 CUPOM: IMAGINE10 - 10% DE DESCONTO!","⭐ PRODUTOS LOUCOS TODA SEMANA!"];
            mostrarNotificacao(promocoes[Math.floor(Math.random()*promocoes.length)]);
        });
    }

    // --- Intersection Observer para animações de entrada ---
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
            }
        });
    }, {threshold:0.1, rootMargin:'0px 0px -50px 0px'});
    document.querySelectorAll('.produto-card,.feature-card').forEach(el=>{
        Object.assign(el.style,{opacity:'0', transform:'translateY(20px)', transition:'opacity 0.6s ease, transform 0.6s ease'});
        observer.observe(el);
    });

    // --- Efeitos visuais ---
    document.querySelectorAll('.produto-card').forEach(card=>{
        card.addEventListener('mouseenter',()=>card.style.transform='translateY(-8px) scale(1.02)');
        card.addEventListener('mouseleave',()=>card.style.transform='translateY(0) scale(1)');
    });
    document.querySelectorAll('h1,h2,h3').forEach(t=>{
        t.addEventListener('mouseenter',()=>t.style.textShadow='0 0 10px #B5C0F5,0 0 20px #D0F4BD');
        t.addEventListener('mouseleave',()=>t.style.textShadow='none');
    });
});

// --- Scroll suave ---
function scrollToSection(id){
    const sec=document.getElementById(id);
    if(sec) sec.scrollIntoView({behavior:'smooth',block:'start'});
}
