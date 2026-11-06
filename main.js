document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. DATOS COMPARTIDOS DE LA RULETA
    // ==========================================
    const opciones = [
        "Estatus Socio-económico", "País de Origen", "Creencias Religiosas",
        "Identidad de Género", "Orientación Sexual", "Edad",
        "Grupo Étnico", "Discapacidad"
    ];

    // Colores que combinan con la paleta lila/neón
    const colores = [
        "#ffb3ba", "#e0bbe4", "#957dad", "#aee5f5", 
        "#b5e8b0", "#fff2aa", "#ffd59e", "#ff9a9e"
    ];

    function dibujarRuleta(ctx, canvas, anguloActual) {
        const radio = canvas.width / 2;
        const arco = (2 * Math.PI) / opciones.length;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < opciones.length; i++) {
            const anguloInicial = anguloActual + i * arco;
            const anguloFinal = anguloInicial + arco;

            // Dibujar rebanada
            ctx.beginPath();
            ctx.fillStyle = colores[i];
            ctx.moveTo(radio, radio);
            ctx.arc(radio, radio, radio, anguloInicial, anguloFinal);
            ctx.fill();
            
            // Borde oscuro para resaltar en el diseño neón
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#0f0518";
            ctx.stroke();

            // Dibujar texto alineado a la tipografía Poppins
            ctx.save();
            ctx.translate(radio, radio);
            ctx.rotate(anguloInicial + arco / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#0f0518"; 
            ctx.font = "800 14px 'Poppins', sans-serif";
            ctx.fillText(opciones[i], radio - 20, 5);
            ctx.restore();
        }
    }

    // ==========================================
    // 2. LÓGICA: RULETA CON FUERZA (ruleta.html)
    // ==========================================
    const btnGirar = document.getElementById("btn-girar");
    if (btnGirar) {
        const canvasFuerza = document.getElementById("ruleta");
        const ctxFuerza = canvasFuerza.getContext("2d");
        const inputFuerza = document.getElementById("fuerza");
        let anguloFuerza = 0;
        let girandoFuerza = false;

        dibujarRuleta(ctxFuerza, canvasFuerza, anguloFuerza);

        btnGirar.addEventListener("click", () => {
            if (girandoFuerza) return;
            girandoFuerza = true;
            
            // Cambiar ícono a estado de carga
            btnGirar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Girando...';

            const fuerza = parseInt(inputFuerza.value);
            const gradosGiro = (Math.random() * 360) + (360 * fuerza) + 1440; 
            const tiempoGiro = 3000 + (fuerza * 250); 
            let inicio = null;

            function animarGiro(tiempoActual) {
                if (!inicio) inicio = tiempoActual;
                const progreso = tiempoActual - inicio;
                const porcentajeEfectivo = 1 - Math.pow(1 - (progreso / tiempoGiro), 3.5);
                
                anguloFuerza = (gradosGiro * porcentajeEfectivo * Math.PI) / 180;
                dibujarRuleta(ctxFuerza, canvasFuerza, anguloFuerza);

                if (progreso < tiempoGiro) {
                    requestAnimationFrame(animarGiro);
                } else {
                    girandoFuerza = false;
                    btnGirar.innerHTML = '<i class="fa-solid fa-bolt"></i> ¡Girar Ruleta!';
                    determinarGanadorFuerza();
                }
            }
            requestAnimationFrame(animarGiro);
        });

        function determinarGanadorFuerza() {
            const arcoPlano = (2 * Math.PI) / opciones.length;
            const anguloNormalizado = anguloFuerza % (2 * Math.PI);
            let indice = Math.floor(((1.5 * Math.PI) - anguloNormalizado + (2 * Math.PI)) % (2 * Math.PI) / arcoPlano);
            
            const ganador = opciones[indice];

            // Disparar confeti con colores de la paleta
            if (typeof confetti !== "undefined") {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#d500f9', '#9c27b0', '#00e5ff']
                });
            }

            setTimeout(() => {
                alert(`¿Qué desigualdad se puede presentar por ${ganador.toUpperCase()}?`);
            }, 600);
        }
    }

    // ==========================================
    // 3. LÓGICA: SELECTOR MANUAL (elige.html)
    // ==========================================
    const btnControl = document.getElementById("btn-control");
    if (btnControl) {
        const canvasManual = document.getElementById("ruleta");
        const ctxManual = canvasManual.getContext("2d");
        const textoResultado = document.getElementById("resultado");
        let anguloManual = 0;
        let girandoManual = false;
        let idAnimacion;

        dibujarRuleta(ctxManual, canvasManual, anguloManual);

        function animarGiroContinuo() {
            anguloManual += 0.05; 
            dibujarRuleta(ctxManual, canvasManual, anguloManual);
            idAnimacion = requestAnimationFrame(animarGiroContinuo);
        }

        btnControl.addEventListener("click", () => {
            if (!girandoManual) {
                girandoManual = true;
                btnControl.innerHTML = '<i class="fa-solid fa-stop"></i> Detener';
                btnControl.style.background = "linear-gradient(90deg, #d32f2f, #ff1744)"; 
                btnControl.style.boxShadow = "0 0 20px #ff1744";
                textoResultado.textContent = "";
                animarGiroContinuo();
            } else {
                girandoManual = false;
                cancelAnimationFrame(idAnimacion);
                btnControl.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar Giro';
                btnControl.style.background = "linear-gradient(90deg, var(--morado-brillante), var(--lila-neon))"; 
                btnControl.style.boxShadow = "0 0 15px var(--lila-neon)";
                
                const arcoPlano = (2 * Math.PI) / opciones.length;
                const anguloNormalizado = anguloManual % (2 * Math.PI);
                let indice = Math.floor(((1.5 * Math.PI) - anguloNormalizado + (2 * Math.PI)) % (2 * Math.PI) / arcoPlano);
                
                textoResultado.textContent = `Has seleccionado: ${opciones[indice]}`;
            }
        });
    }

    // ==========================================
    // 4. LÓGICA: MEMORAMA (memorama.html)
    // ==========================================
    const tablero = document.getElementById("tablero");
    if (tablero) {
        const conceptosYEjemplos = [
            { id: 1, texto: "Estatus Socio-económico" },
            { id: 1, texto: "No poder costear el acceso a la universidad" },
            { id: 2, texto: "País de Origen" },
            { id: 2, texto: "Sufrir xenofobia al migrar por trabajo" },
            { id: 3, texto: "Creencias Religiosas" },
            { id: 3, texto: "Exclusión por usar prendas de tu fe" },
            { id: 4, texto: "Identidad de Género" },
            { id: 4, texto: "No respetar tu nombre en trámites" },
            { id: 5, texto: "Orientación Sexual" },
            { id: 5, texto: "Discriminación por tener pareja del mismo sexo" },
            { id: 6, texto: "Edad" },
            { id: 6, texto: "Rechazo laboral por ser considerado 'muy mayor'" },
            { id: 7, texto: "Grupo Étnico" },
            { id: 7, texto: "Trato médico desigual por tu color de piel" },
            { id: 8, texto: "Discapacidad" },
            { id: 8, texto: "Falta de rampas en un edificio público" }
        ];

        let cartasVolteadas = [];
        let tableroBloqueado = false;
        let paresEncontrados = 0;

        function barajar(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const mazoBarajado = barajar([...conceptosYEjemplos]);

        mazoBarajado.forEach(cartaInfo => {
            const carta = document.createElement('div');
            carta.classList.add('carta');
            carta.dataset.id = cartaInfo.id;
            
            // Span para prevenir efecto espejo en CSS 3D
            const spanTexto = document.createElement('span');
            spanTexto.textContent = cartaInfo.texto;
            carta.appendChild(spanTexto);

            carta.addEventListener('click', voltearCarta);
            tablero.appendChild(carta);
        });

        function voltearCarta() {
            if (tableroBloqueado || this === cartasVolteadas[0]) return;
            
            this.classList.add('volteada');
            cartasVolteadas.push(this);

            if (cartasVolteadas.length === 2) {
                tableroBloqueado = true;
                if (cartasVolteadas[0].dataset.id === cartasVolteadas[1].dataset.id) {
                    setTimeout(() => {
                        cartasVolteadas[0].classList.add('encontrada');
                        cartasVolteadas[1].classList.add('encontrada');
                        cartasVolteadas[0].removeEventListener('click', voltearCarta);
                        cartasVolteadas[1].removeEventListener('click', voltearCarta);
                        
                        paresEncontrados++;
                        cartasVolteadas = [];
                        tableroBloqueado = false;

                        if (paresEncontrados === 8) {
                            setTimeout(() => alert("¡Excelente! Has relacionado todos los conceptos correctamente."), 600);
                        }
                    }, 500);
                } else {
                    setTimeout(() => {
                        cartasVolteadas[0].classList.remove('volteada');
                        cartasVolteadas[1].classList.remove('volteada');
                        cartasVolteadas = [];
                        tableroBloqueado = false;
                    }, 1500);
                }
            }
        }
    }
});
