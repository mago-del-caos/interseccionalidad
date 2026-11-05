document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. CONFIGURACIÓN COMPARTIDA DE LA RULETA
    // ==========================================
    const opciones = [
        "Estatus Socio-económico", "País de Origen", "Creencias Religiosas",
        "Identidad de Género", "Orientación Sexual", "Edad",
        "Grupo Étnico", "Discapacidad"
    ];

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

            ctx.beginPath();
            ctx.fillStyle = colores[i];
            ctx.moveTo(radio, radio);
            ctx.arc(radio, radio, radio, anguloInicial, anguloFinal);
            ctx.fill();
            ctx.stroke();

            ctx.save();
            ctx.translate(radio, radio);
            ctx.rotate(anguloInicial + arco / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#333";
            ctx.font = "bold 14px Arial";
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

            const fuerza = parseInt(inputFuerza.value);
            const gradosGiro = (Math.random() * 360) + (360 * fuerza) + 1080; 
            const tiempoGiro = 3000 + (fuerza * 200); 
            let inicio = null;

            function animarGiro(tiempoActual) {
                if (!inicio) inicio = tiempoActual;
                const progreso = tiempoActual - inicio;
                const porcentajeEfectivo = 1 - Math.pow(1 - (progreso / tiempoGiro), 3);
                
                anguloFuerza = (gradosGiro * porcentajeEfectivo * Math.PI) / 180;
                dibujarRuleta(ctxFuerza, canvasFuerza, anguloFuerza);

                if (progreso < tiempoGiro) {
                    requestAnimationFrame(animarGiro);
                } else {
                    girandoFuerza = false;
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

            if (typeof confetti !== "undefined") {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }

            setTimeout(() => {
                alert(`¿Qué desigualdad se puede presentar por ${ganador.toUpperCase()}?`);
            }, 500);
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
                btnControl.textContent = "Detener Manualmente";
                btnControl.style.backgroundColor = "#d32f2f"; 
                textoResultado.textContent = "";
                animarGiroContinuo();
            } else {
                girandoManual = false;
                cancelAnimationFrame(idAnimacion);
                btnControl.textContent = "Iniciar Giro";
                btnControl.style.backgroundColor = "#9c27b0"; 
                
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
            { id: 2, texto: "Sufrir xenofobia al migrar en busca de trabajo" },
            { id: 3, texto: "Creencias Religiosas" },
            { id: 3, texto: "Ser excluido por usar prendas asociadas a tu fe" },
            { id: 4, texto: "Identidad de Género" },
            { id: 4, texto: "Que no se respete tu nombre en un trámite legal" },
            { id: 5, texto: "Orientación Sexual" },
            { id: 5, texto: "Discriminación por tener pareja del mismo sexo" },
            { id: 6, texto: "Edad" },
            { id: 6, texto: "Rechazo laboral por ser considerado 'muy mayor'" },
            { id: 7, texto: "Grupo Étnico" },
            { id: 7, texto: "Trato médico desigual por tu color de piel" },
            { id: 8, texto: "Discapacidad" },
            { id: 8, texto: "Falta de rampas de acceso en un edificio público" }
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
            carta.textContent = cartaInfo.texto;
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
                    cartasVolteadas[0].classList.add('encontrada');
                    cartasVolteadas[1].classList.add('encontrada');
                    cartasVolteadas[0].removeEventListener('click', voltearCarta);
                    cartasVolteadas[1].removeEventListener('click', voltearCarta);
                    
                    paresEncontrados++;
                    cartasVolteadas = [];
                    tableroBloqueado = false;

                    if (paresEncontrados === 8) {
                        setTimeout(() => alert("¡Felicidades! Has relacionado correctamente todos los conceptos con sus ejemplos."), 500);
                    }
                } else {
                    setTimeout(() => {
                        cartasVolteadas[0].classList.remove('volteada');
                        cartasVolteadas[1].classList.remove('volteada');
                        cartasVolteadas = [];
                        tableroBloqueado = false;
                    }, 1200);
                }
            }
        }
    }
});
