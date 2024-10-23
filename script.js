// Variables globales
let g = 9.81;
let t = 0;
let dt = 0.02;

// Parámetros del sistema
let m = 1;
let l = 1;
let k = 10;
let k1 = 10;
let k2 = 10;
let I = 1/12*m*l**2; // momento de inercia

// Gráficas
let graficaTheta;
let graficaX;
let animacionID;

// Inicialización
window.onload = function() {
    inicializarControles();
    inicializarGraficas();
    actualizarEcuaciones();
    iniciarSimulacion();
}

// Funciones de cálculo principales
function calcularLagrangiano(theta, x, thetaDot, xDot) {
    // Energía Cinética
    let T = (1/2)*I*thetaDot*thetaDot + (1/2)*m*xDot*xDot;
    
    // Energía Potencial
    let V = (1/2)*k*(l/2*theta)**2 + 
            (1/2)*k1*(l/2*theta + x)**2 + 
            (1/2)*k2*x*x + 
            m*g*x;
    
    return T - V;
}

// Función actualizada para calcular frecuencias naturales
function actualizarEcuacionesFrecuencias() {
    let frecuencias = calcularFrecuenciasNaturales();
    
    // Calcular coeficientes
    let a = I*m;
    let b = (-I*(k1 + k2) - m*(k*l*l/4 + k1*l*l/4));
    let c = ((k*l*l/4 + k1*l*l/4)*(k1 + k2) - Math.pow(k1*l/2, 2));
    


    // Actualizar MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function calcularFrecuenciasNaturales() {
    // Calcular coeficientes según las definiciones dadas
    let a = I*m;  // a = Im
    
    let b = (-I*(k1 + k2) - m*(k*l*l/4 + k1*l*l/4));  // b = (-I(k1 + k2) - m[kl²/4 + k1l²/4])
    
    let c = ((k*l*l/4 + k1*l*l/4)*(k1 + k2) - Math.pow(k1*l/2, 2));  // c = [kl²/4 + k1l²/4](k1 + k2) - (k1l/2)²
    
    // Calcular las frecuencias usando la fórmula cuadrática
    let omega1 = Math.sqrt((-b + Math.sqrt(b*b - 4*a*c))/(2*a));
    let omega2 = Math.sqrt((-b - Math.sqrt(b*b - 4*a*c))/(2*a));
    
    console.log('Freqs:', omega1, omega2);
    return [omega1, omega2];
    
}


function calcularRelacionAmplitudes(omega) {
    return -[I*omega*omega - k*(l*l/4) - k1*(l*l/4)]/(k1*l/2);
}
function calcularEcuacionesMovimiento(theta, x, thetaDot, xDot) {
    // Ecuación para theta derivada del Lagrangiano
    // Iθ̈ + kl²θ/4 + k₁l²θ/4 + k₁lx/2 = 0
    let thetaDotDot = -(k*l*l*theta/4 + k1*l*l*theta/4 + k1*l*x/2)/I;
    
    // Ecuación para x derivada del Lagrangiano
    // mẍ + k₁lθ/2 + (k₁ + k₂)x + mg = 0
    let xDotDot = -(k1*l*theta/2 + (k1 + k2)*x + m*g)/m;
    
    return [thetaDotDot, xDotDot];
}

function actualizarEcuaciones() {
    // Lagrangiano
    document.getElementById('lagrangiano').innerHTML = `
        <div class="math">
            <h4>Forma General:</h4>
            <div class="ecuacion-general">
                \\[L = \\frac{1}{2}I\\dot{\\theta}^2 + \\frac{1}{2}m\\dot{x}^2 - \\left[\\frac{1}{2}k\\left(\\frac{l}{2}\\theta\\right)^2 + \\frac{1}{2}k_1\\left(\\frac{l}{2}\\theta + x\\right)^2 + \\frac{1}{2}k_2x^2 + mgx\\right]\\]
            </div>
            <h4>Valores Actuales:</h4>
            <div class="valores-actuales">
                \\[L = \\frac{1}{2}(${I.toFixed(3)})\\dot{\\theta}^2 + \\frac{1}{2}(${m})\\dot{x}^2 - \\left[\\frac{1}{2}(${k})\\left(\\frac{${l}}{2}\\theta\\right)^2 + \\frac{1}{2}(${k1})\\left(\\frac{${l}}{2}\\theta + x\\right)^2 + \\frac{1}{2}(${k2})x^2 + (${m})(${g})x\\right]\\]
            </div>
        </div>
    `;

    // Ecuaciones de Movimiento
    document.getElementById('ecuacionesMovimiento').innerHTML = `
        <div class="math">
            <h4>Ecuaciones Diferenciales:</h4>
            <div class="ecuacion-general">
                \\[I\\ddot{\\theta} + \\frac{kl^2}{4}\\theta + \\frac{k_1l^2}{4}\\theta + \\frac{k_1l}{2}x = 0\\]
                \\[m\\ddot{x} + \\frac{k_1l}{2}\\theta + (k_1 + k_2)x + mg = 0\\]
            </div>
            <h4>Valores Actuales:</h4>
            <div class="valores-actuales">
                \\[${I.toFixed(3)}\\ddot{\\theta} + ${(k*l*l/4).toFixed(3)}\\theta + ${(k1*l*l/4).toFixed(3)}\\theta + ${(k1*l/2).toFixed(3)}x = 0\\]
                \\[${m}\\ddot{x} + ${(k1*l/2).toFixed(3)}\\theta + ${(k1 + k2)}x + ${(m*g).toFixed(3)} = 0\\]
            </div>
        </div>
    `;

    // Frecuencias Naturales
    let frecuencias = calcularFrecuenciasNaturales();
    document.getElementById('frecuenciasNaturales').innerHTML = `
        <div class="math">
            <h4>Forma General:</h4>
            <div class="ecuacion-general">
                <h5>Ecuación característica:</h5>
                \\[a\\omega^4 + b\\omega^2 + c = 0\\]
                <h5>Coeficientes:</h5>
                \\[a = Im\\]
                \\[b = (-I(k_1 + k_2) - m[\\frac{kl^2}{4} + \\frac{k_1l^2}{4}])\\]
                \\[c = [\\frac{kl^2}{4} + \\frac{k_1l^2}{4}](k_1 + k_2) - (\\frac{k_1l}{2})^2\\]
                <h5>Soluciones:</h5>
                \\[\\omega_{1,2} = \\sqrt{\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}}\\]
            </div>

            <h4>Valores Actuales:</h4>
            <div class="valores-actuales">
                <h5>Coeficientes calculados:</h5>
                \\[a = ${(I*m).toFixed(3)}\\]
                \\[b = ${(-I*(k1 + k2) - m*(k*l*l/4 + k1*l*l/4)).toFixed(3)}\\]
                \\[c = ${((k*l*l/4 + k1*l*l/4)*(k1 + k2) - Math.pow(k1*l/2, 2)).toFixed(3)}\\]
                
                <h5>Frecuencias resultantes:</h5>
                \\[\\omega_1 = ${frecuencias[0].toFixed(3)} \\text{ rad/s}\\]
                \\[\\omega_2 = ${frecuencias[1].toFixed(3)} \\text{ rad/s}\\]
            </div>
        </div>
    `;

    // Actualizar MathJax
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function simularModo(modo) {
    let frecuencias = calcularFrecuenciasNaturales();
    let omega = frecuencias[modo - 1];
    let relacionAmplitud = calcularRelacionAmplitudes(omega);
    
    let datosTheta = [];
    let datosX = [];
    
    // Generar datos para 10 segundos
    for(let t = 0; t <= 10; t += dt) {
        // Soluciones armónicas con la frecuencia natural correcta
        let theta = Math.cos(omega*t);
        let x = relacionAmplitud * Math.cos(omega*t);
        
        datosTheta.push({x: t, y: theta});
        datosX.push({x: t, y: x});
    }
    
    actualizarGraficas(datosTheta, datosX);
}

function simularGeneral() {
    let frecuencias = calcularFrecuenciasNaturales();
    let B1 = calcularRelacionAmplitudes(frecuencias[0]);
    let B2 = calcularRelacionAmplitudes(frecuencias[1]);
    
    // Parámetros iniciales (pueden ser modificados)
    let A1 = 0.5;
    let A2 = 0.3;
    let phi1 = 0;
    let phi2 = Math.PI/4;
    
    let datosTheta = [];
    let datosX = [];
    
    for(let t = 0; t <= 10; t += dt) {
        let theta = A1*Math.cos(frecuencias[0]*t + phi1) + 
                   A2*Math.cos(frecuencias[1]*t + phi2);
        let x = B1*A1*Math.cos(frecuencias[0]*t + phi1) + 
                B2*A2*Math.cos(frecuencias[1]*t + phi2);
        
        datosTheta.push({x: t, y: theta});
        datosX.push({x: t, y: x});
    }
    
    actualizarGraficas(datosTheta, datosX);
}

// Funciones de inicialización y actualización de la interfaz
// Función para inicializar controles y eventos
function inicializarControles() {
    // Obtener todos los inputs y el botón de actualización
    const parametros = ['masa', 'longitud', 'k', 'k1', 'k2'];
    const inputElements = {};
    
    parametros.forEach(id => {
        inputElements[id] = document.getElementById(id);
        // Validar entrada en tiempo real
        inputElements[id].addEventListener('input', function() {
            validarInput(this);
        });
    });

    // Añadir evento al botón de actualización
    document.getElementById('actualizarParametros').addEventListener('click', function() {
        actualizarTodoElSistema();
    });

    // También permitir actualización con Enter en cualquier input
    parametros.forEach(id => {
        inputElements[id].addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                actualizarTodoElSistema();
            }
        });
    });
}

// Función para validar input
function validarInput(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    let value = parseFloat(input.value);
    
    if (isNaN(value)) {
        input.value = input.defaultValue;
    } else {
        value = Math.max(min, Math.min(max, value));
        input.value = value;
    }
}

// Función para actualizar todo el sistema
function actualizarTodoElSistema() {
    // Obtener y validar todos los valores
    try {
        m = parseFloat(document.getElementById('masa').value);
        l = parseFloat(document.getElementById('longitud').value);
        k = parseFloat(document.getElementById('k').value);
        k1 = parseFloat(document.getElementById('k1').value);
        k2 = parseFloat(document.getElementById('k2').value);
        I = m*l*l/12; // Momento de inercia para una barra uniforme

        // Actualizar ecuaciones
        actualizarEcuaciones();
        
        // Limpiar y reiniciar gráficas
        actualizarGraficas([], []);
        
        // Reiniciar simulación
        if(animacionID) {
            cancelAnimationFrame(animacionID);
        }
        iniciarSimulacion();

        // Mostrar mensaje de éxito
        mostrarMensaje('Sistema actualizado correctamente', 'success');
    } catch (error) {
        console.error(error);
        mostrarMensaje('Error al actualizar el sistema. Verifique los valores ingresados.', 'error');
    }
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento para el mensaje si no existe
    let mensajeElement = document.getElementById('mensaje-sistema');
    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensaje-sistema';
        document.querySelector('.parametros-section').appendChild(mensajeElement);
    }

    // Configurar el mensaje
    mensajeElement.textContent = mensaje;
    mensajeElement.className = `mensaje ${tipo}`;
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
}
function actualizarParametros() {
    m = parseFloat(document.getElementById('masa').value);
    l = parseFloat(document.getElementById('longitud').value);
    k = parseFloat(document.getElementById('k').value);
    k1 = parseFloat(document.getElementById('k1').value);
    k2 = parseFloat(document.getElementById('k2').value);
    I = m*l*l/12; // Momento de inercia para una barra uniforme
    
    actualizarEcuaciones();
}

function actualizarGraficas(datosTheta, datosX) {
    graficaTheta.data.datasets[0].data = datosTheta;
    graficaX.data.datasets[0].data = datosX;
    
    graficaTheta.update();
    graficaX.update();
}

function dibujarSistema(ctx, theta, x) {
    // Limpiar el canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Configurar transformación para centrar el sistema
    ctx.save();
    ctx.translate(ctx.canvas.width/2, ctx.canvas.height/3);
    
    // Dibujar base/techo
    ctx.beginPath();
    ctx.moveTo(-100, -50);
    ctx.lineTo(100, -50);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar barra
    ctx.save();
    ctx.rotate(theta);
    ctx.beginPath();
    ctx.moveTo(-l*50, 0);
    ctx.lineTo(l*50, 0);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
    
    // Dibujar resortes
    dibujarResorte(ctx, -l*50, -50, -l*50*Math.cos(theta), -l*50*Math.sin(theta)); // Resorte izquierdo
    dibujarResorte(ctx, l*50*Math.cos(theta), l*50*Math.sin(theta), l*50, x); // Resorte derecho superior
    dibujarResorte(ctx, l*50, x, l*50, 100); // Resorte derecho inferior
    
    // Dibujar masa
    ctx.beginPath();
    ctx.arc(l*50, x, 10, 0, 2*Math.PI);
    ctx.fillStyle = '#f44336';
    ctx.fill();
    
    ctx.restore();
}

function dibujarResorte(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    let dx = x2 - x1;
    let dy = y2 - y1;
    let len = Math.sqrt(dx*dx + dy*dy);
    let ang = Math.atan2(dy, dx);
    let segs = 20;
    
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(ang);
    
    ctx.moveTo(0, 0);
    for(let i = 0; i < segs; i++) {
        let x = (i + 1) * len/segs;
        let y = 5 * Math.sin(i * Math.PI);
        ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

function iniciarSimulacion() {
    let canvas = document.getElementById('simulacion');
    let ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    let theta = 0;
    let x = 0;
    let thetaDot = 0;
    let xDot = 0;
    
    function animar() {
        // Calcular siguiente estado
        let [thetaDotDot, xDotDot] = calcularEcuacionesMovimiento(theta, x, thetaDot, xDot);
        
        thetaDot += thetaDotDot * dt;
        xDot += xDotDot * dt;
        theta += thetaDot * dt;
        x += xDot * dt;
        
        // Dibujar sistema
        dibujarSistema(ctx, theta, x);
        
        // Continuar animación
        animacionID = requestAnimationFrame(animar);
    }
    
    // Iniciar animación
    if(animacionID) {
        cancelAnimationFrame(animacionID);
    }
    animar();
}

// Inicialización de gráficas mejorada
function inicializarGraficas() {
    const configComun = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Tiempo (s)',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Amplitud',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    };

    // Gráfica para θ
    let ctxTheta = document.getElementById('graficaTheta').getContext('2d');
    graficaTheta = new Chart(ctxTheta, {
        ...configComun,
        data: {
            datasets: [{
                label: 'θ(t)',
                borderColor: 'rgb(75, 192, 192)',
                data: [],
                borderWidth: 2,
                pointRadius: 0
            }]
        }
    });

    // Gráfica para x
    let ctxX = document.getElementById('graficaX').getContext('2d');
    graficaX = new Chart(ctxX, {
        ...configComun,
        data: {
            datasets: [{
                label: 'x(t)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                borderWidth: 2,
                pointRadius: 0
            }]
        }
    });
}
// Función mejorada para simular modos
function simularModo(modo) {
    // Detener simulación anterior si existe
    if(animacionID) {
        cancelAnimationFrame(animacionID);
    }

    let frecuencias = calcularFrecuenciasNaturales();
    let omega = frecuencias[modo - 1];
    let relacionAmplitud = calcularRelacionAmplitudes(omega);
    
    // Limpiar datos anteriores
    let datosTheta = [];
    let datosX = [];
    
    // Generar datos para visualización
    const tiempoTotal = 10; // 10 segundos de simulación
    const puntos = Math.floor(tiempoTotal / dt);
    
    for(let i = 0; i <= puntos; i++) {
        let t = i * dt;
        let theta = Math.cos(omega * t);
        let x = relacionAmplitud * theta;
        
        datosTheta.push({x: t, y: theta});
        datosX.push({x: t, y: x});
    }
    
    // Actualizar gráficas
    graficaTheta.data.datasets[0].data = datosTheta;
    graficaX.data.datasets[0].data = datosX;
    
    graficaTheta.update();
    graficaX.update();
    
    // Actualizar visualización del sistema
    let canvas = document.getElementById('simulacion');
    let ctx = canvas.getContext('2d');
    
    function animar() {
        let tiempo = (Date.now() - tiempoInicio) / 1000;
        let theta = Math.cos(omega * tiempo);
        let x = relacionAmplitud * theta;
        
        dibujarSistema(ctx, theta, x);
        animacionID = requestAnimationFrame(animar);
    }
    
    let tiempoInicio = Date.now();
    animar();
}

// Función mejorada para simular solución general
function simularGeneral() {
    let frecuencias = calcularFrecuenciasNaturales();
    let B1 = calcularRelacionAmplitudes(frecuencias[0]);
    let B2 = calcularRelacionAmplitudes(frecuencias[1]);
    
    // Parámetros de la solución general
    const A1 = 0.5;
    const A2 = 0.3;
    const phi1 = 0;
    const phi2 = Math.PI/4;
    
    let datosTheta = [];
    let datosX = [];
    
    // Generar datos para la solución general
    const tiempoTotal = 10;
    const puntos = Math.floor(tiempoTotal / dt);
    
    for(let i = 0; i <= puntos; i++) {
        let t = i * dt;
        let theta = A1*Math.cos(frecuencias[0]*t + phi1) + 
                   A2*Math.cos(frecuencias[1]*t + phi2);
        let x = B1*A1*Math.cos(frecuencias[0]*t + phi1) + 
                B2*A2*Math.cos(frecuencias[1]*t + phi2);
        
        datosTheta.push({x: t, y: theta});
        datosX.push({x: t, y: x});
    }
    
    // Actualizar gráficas
    graficaTheta.data.datasets[0].data = datosTheta;
    graficaX.data.datasets[0].data = datosX;
    
    graficaTheta.update();
    graficaX.update();
    
    // Actualizar visualización del sistema
    let canvas = document.getElementById('simulacion');
    let ctx = canvas.getContext('2d');
    
    function animar() {
        let tiempo = (Date.now() - tiempoInicio) / 1000;
        let theta = A1*Math.cos(frecuencias[0]*tiempo + phi1) + 
                   A2*Math.cos(frecuencias[1]*tiempo + phi2);
        let x = B1*A1*Math.cos(frecuencias[0]*tiempo + phi1) + 
                B2*A2*Math.cos(frecuencias[1]*tiempo + phi2);
        
        dibujarSistema(ctx, theta, x);
        animacionID = requestAnimationFrame(animar);
    }
    
    let tiempoInicio = Date.now();
    animar();
}

// Función para detener/reanudar la simulación
function toggleSimulacion() {
    if(animacionID) {
        cancelAnimationFrame(animacionID);
        animacionID = null;
    } else {
        iniciarSimulacion();
    }
}

// Función para reiniciar la simulación
function reiniciarSimulacion() {
    if(animacionID) {
        cancelAnimationFrame(animacionID);
    }
    t = 0;
    iniciarSimulacion();
}

// Añadir listeners para botones de control
window.addEventListener('load', function() {
    document.getElementById('toggleSimulacion')?.addEventListener('click', toggleSimulacion);
    document.getElementById('reiniciarSimulacion')?.addEventListener('click', reiniciarSimulacion);
    
    // Ajustar canvas al redimensionar ventana
    window.addEventListener('resize', function() {
        let canvas = document.getElementById('simulacion');
        if(canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    });
});