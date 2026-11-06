document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. DATOS COMPARTIDOS DE LA RULETA
    // ==========================================
    const opciones = [
        "Estatus Socio-económico", "País de Origen", "Creencias Religiosas",
        "Identidad de Género", "Orientación Sexual", "Edad",
        "Grupo Étnico", "Discapacidad"
    ];

    // Colores pastel que combinan con el lila del fondo
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
            
            // Borde sutil
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.stroke();

            // Dibujar texto alineado a la nueva tipografía
            ctx.save();
            ctx.translate(radio, radio);
            ctx.rotate(anguloInicial + arco / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#2a0845"; // Lila oscuro para contraste
            ctx.font = "600 14px 'Poppins', sans-serif";
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
            // Rotación base + aleatoriedad + multiplicador por la fuerza
            const gradosGiro = (Math.random() * 360) + (360 * fuerza) + 1440; 
            const tiempoGiro = 3000 + (fuerza * 250);
