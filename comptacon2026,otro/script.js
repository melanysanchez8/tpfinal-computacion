const pinceles = {};
let pincelActual;
let pincelNombre = "aero1";
let grupoActual = 1;

const GruposPinceles = {
    1: { nombre: "aerosoles", pinceles: ["aero1", "aero3", "aero4", "aero5", "aero6", "aero7", "aero10", "aero16"] },
    2: { nombre: "Puntos", pinceles: ["puntos1", "puntos2", "puntos3", "puntos11"] },
    3: { nombre: "idk", pinceles: ["idk1", "idk2", "idk6", "idk7", "idk8", "idk10", "idk11", "idk12", "idk15", "idk55", "idk56"] },
    4: { nombre: "drips", pinceles: ["drip1", "drip2", "drip3", "drip4", "drip5", "drip6", "drip8"] },
    5: { nombre: "lineas", pinceles: ["lineas5", "lineas7", "lineas9", "lineas13", "lineas14", "lineas22", "lineas23", "lineas35"] }
};

const coloresBase = {
    yellow: [217, 181, 37],
    red: [82, 31, 25],
    green: [94, 106, 81],
    black: [24, 19, 25],
    white: [241, 226, 206],
    purple: [20, 6, 61],
    blue: [45, 41, 76]
};

// 6 Paletas predefinidas 
const paletas = [
    // Paleta 1
    {
        yellow: 10,
        red: 25,
        black: 15,
        white: 25,
        purple: 25,
    },
    // Paleta 2
    {
        blue: 10,
        green: 25,
        white: 35,
        black: 15,
        yellow: 15,
    },
    // Paleta 3
    {
        red: 20,
        yellow: 30,
        black: 25,
        purple: 10,
        blue: 15,
    },
    // Paleta 4
    {
        yellow: 20,
        purple: 30,
        white: 10,
        black: 15,
        red: 25,
    },
    // Paleta 5
    {
        green: 40,
        red: 25,
        purple: 15,
        blue: 10,
        white: 10,
    },
    // Paleta 6
    {
        white: 40,
        yellow: 20,
        blue: 15,
        purple: 10,
        red: 15,
    }
];

let paletaActual = {};
let paletaIndex = 0;

function elegirPaletaAleatoria(excluirIndex = -1) {
    const indices = paletas
        .map((_, index) => index)
        .filter((index) => index !== excluirIndex);

    if (!indices.length) {
        return 0;
    }

    return indices[Math.floor(Math.random() * indices.length)];
}

let mic;
let fft;
let audioIniciado = false;
let lastSoundDetectionTime = 0;
let soundDetectionDelay = 200;
let soundDuration = 0;
let lastSignificantSoundTime = 0;
let soundThreshold = 0.01;

let usosPinceles = {};

let maximoPorPincel = 100;
let mapaZonas = {};
let maximoPorZona = 1000;
let tamañoCelda = 100;

let lastDrawTime = 0;
let drawDelay = 100;
let sketchStarted = true;
let lastStartSoundTime = 0;
let lastResetSoundTime = 0;
let startSoundCooldown = 1000;
let startTriggerActive = false;
let lastAudioVolume = 0;

let resetCandidateActive = false;
let resetCandidateStartTime = 0;
let resetCandidatePeakVolume = 0;
let resetSoundThreshold = 0.18;
let resetSoundSilenceThreshold = 0.04;
let resetSoundMinDuration = 25;
let resetSoundMaxDuration = 120;

function preload() {
    pinceles.aero1 = loadImage("imagenes/aero1.png");
    pinceles.aero3 = loadImage("imagenes/aero3.png");
    pinceles.aero4 = loadImage("imagenes/aero4.png");
    pinceles.aero5 = loadImage("imagenes/aero5.png");
    pinceles.aero6 = loadImage("imagenes/aero6.png");
    pinceles.aero7 = loadImage("imagenes/aero7.png");
    pinceles.aero10 = loadImage("imagenes/aero10.png");
    pinceles.aero16 = loadImage("imagenes/aero16.png");

    pinceles.drip1 = loadImage("imagenes/drip1.png");
    pinceles.drip2 = loadImage("imagenes/drip2.png");
    pinceles.drip3 = loadImage("imagenes/drip3.png");
    pinceles.drip4 = loadImage("imagenes/drip4.png");
    pinceles.drip5 = loadImage("imagenes/drip5.png");
    pinceles.drip6 = loadImage("imagenes/drip6.png");
    pinceles.drip8 = loadImage("imagenes/drip8.png");

    pinceles.lineas5 = loadImage("imagenes/lineas5.png");
    pinceles.lineas7 = loadImage("imagenes/lineas7.png");
    pinceles.lineas9 = loadImage("imagenes/lineas9.png");
    pinceles.lineas11 = loadImage("imagenes/lineas11.png");
    pinceles.lineas13 = loadImage("imagenes/lineas13.png");
    pinceles.lineas14 = loadImage("imagenes/lineas14.png");
    pinceles.lineas22 = loadImage("imagenes/lineas22.png");
    pinceles.lineas23 = loadImage("imagenes/lineas23.png");
    pinceles.lineas35 = loadImage("imagenes/lineas35.png");

    pinceles.puntos1 = loadImage("imagenes/puntos1.png");
    pinceles.puntos2 = loadImage("imagenes/puntos2.png");
    pinceles.puntos3 = loadImage("imagenes/puntos3.png");
    pinceles.puntos11 = loadImage("imagenes/puntos11.png");

    pinceles.idk1 = loadImage("imagenes/idk1.png");
    pinceles.idk2 = loadImage("imagenes/idk2.png");
    pinceles.idk6 = loadImage("imagenes/idk6.png");
    pinceles.idk7 = loadImage("imagenes/idk7.png");
    pinceles.idk8 = loadImage("imagenes/idk8.png");
    pinceles.idk10 = loadImage("imagenes/idk10.png");
    pinceles.idk11 = loadImage("imagenes/idk11.png");
    pinceles.idk12 = loadImage("imagenes/idk12.png");
    pinceles.idk15 = loadImage("imagenes/idk15.png");
    pinceles.idk55 = loadImage("imagenes/idk55.png");
    pinceles.idk56 = loadImage("imagenes/idk56.png");

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    
    let pincelesList = Object.keys(pinceles);
    pincelActual = pinceles[pincelesList[0]];
    pincelNombre = pincelesList[0];

    if (typeof p5 !== "undefined" && typeof p5.AudioIn === "function") {
        mic = new p5.AudioIn();
        fft = new p5.FFT();
        fft.setInput(mic);
    } else {
        mic = null;
        fft = null;
        console.warn("p5.sound no está disponible; se usará solo audio.");
    }
    
    cargarPaleta(elegirPaletaAleatoria());
}

function seleccionarGrupo(numero) {
    if (!GruposPinceles[numero]) return;

    grupoActual = numero;
    const primerPincel = GruposPinceles[numero].pinceles[0];
    pincelNombre = primerPincel;
    pincelActual = pinceles[primerPincel] || pincelActual;
}

function elegirPincelDelGrupo() {
    const grupo = GruposPinceles[grupoActual];
    if (!grupo || !grupo.pinceles || !grupo.pinceles.length) {
        return null;
    }

    const disponibles = grupo.pinceles.filter((nombre) => (usosPinceles[nombre] || 0) < maximoPorPincel);
    if (!disponibles.length) {
        return null;
    }

    const indice = Math.floor(Math.random() * disponibles.length);
    return disponibles[indice];
}

// Cargar una paleta específica
function cargarPaleta(index) {
    if (index < 0 || index >= paletas.length) return;
    
    paletaIndex = index;
    let paletaDatos = paletas[index];
    paletaActual = {};
    
    let totalTrazosGlobalPermitidos = 3000; // porcentaje global de cada color para todo el sketch
    
    for (let color in paletaDatos) {
        let porcentaje = paletaDatos[color];
        
        paletaActual[color] = {
            rgb: coloresBase[color],
            porcentaje: porcentaje,
            trazosMaximos: Math.floor((porcentaje / 100) * totalTrazosGlobalPermitidos),
            trazosActuales: 0
        };
    }
    
    console.log("Paleta " + (index + 1) + " cargada:", paletaActual);
}

// Obtener un color disponible de la paleta actual
function obtenerColorDisponible(tamañoDinamico) {
    let pesos = {};
    let totalPeso = 0;
    
    for (let color in paletaActual) {
        let datos = paletaActual[color];
        let restante = datos.trazosMaximos - datos.trazosActuales;

        if (restante <= 0) {
            continue;
        }

        if (color === "white" && tamañoDinamico > 220) {
            continue;
        }

        if (color === "white" && tamañoDinamico <= 220) {
            pesos[color] = restante;
            totalPeso += restante;
            continue;
        }

        pesos[color] = restante;
        totalPeso += restante;
    }
    
    if (totalPeso <= 0) {
        return null;
    }
    
    let puntoAleatorio = random(totalPeso);
    let acumulado = 0;

    for (let color in pesos) {
        acumulado += pesos[color];
        if (puntoAleatorio < acumulado) {
            return color;
        }
    }

    return Object.keys(pesos)[0];
}

function iniciarNuevoSketchSiCorresponde() {
    if (!mic || !fft || sketchStarted) return;

    let volumen = mic.getLevel();
    let currentTime = millis();

    if (startTriggerActive && volumen > soundThreshold && currentTime - lastStartSoundTime > startSoundCooldown) {
        lastStartSoundTime = currentTime;
        background(255);
        mapaZonas = {};
        usosPinceles = {};
        paletaActual = {};
        cargarPaleta(elegirPaletaAleatoria(paletaIndex));
        sketchStarted = true;
        audioIniciado = true;
        console.log("Nuevo sketch iniciado con un sonido.");
    }
}

function reiniciarSketchConClick() {
    if (!mic || !fft || !audioIniciado) return;

    let volumen = mic.getLevel();
    let currentTime = millis();

    if (volumen > resetSoundThreshold && !resetCandidateActive) {
        resetCandidateActive = true;
        resetCandidateStartTime = currentTime;
        resetCandidatePeakVolume = volumen;
        lastAudioVolume = volumen;
        return;
    }

    if (!resetCandidateActive) {
        lastAudioVolume = volumen;
        return;
    }

    if (volumen > resetCandidatePeakVolume) {
        resetCandidatePeakVolume = volumen;
    }

    const duration = currentTime - resetCandidateStartTime;
    const subidaRepentina = resetCandidatePeakVolume > lastAudioVolume * 2.5;

    if (volumen < resetSoundSilenceThreshold || duration >= resetSoundMaxDuration) {
        const esGolpeCortoYAgudo =
            resetCandidatePeakVolume >= resetSoundThreshold &&
            duration >= resetSoundMinDuration &&
            duration <= resetSoundMaxDuration &&
            subidaRepentina &&
            currentTime - lastResetSoundTime > startSoundCooldown;

        if (esGolpeCortoYAgudo) {
            lastResetSoundTime = currentTime;
            background(255);
            mapaZonas = {};
            usosPinceles = {};
            paletaActual = {};
            cargarPaleta(elegirPaletaAleatoria(paletaIndex));
            console.log("Sketch reiniciado con un golpe corto y agudo.");
        }

        resetCandidateActive = false;
        resetCandidatePeakVolume = 0;
        resetCandidateStartTime = 0;
    }

    lastAudioVolume = volumen;
}

function detectarSonido() {
    if (!mic || !fft) return;

    let currentTime = millis();
    if (currentTime - lastSoundDetectionTime < soundDetectionDelay) {
        return;
    }

    let volumen = mic.getLevel();
    if (volumen > soundThreshold) {
        soundDuration = currentTime - lastSignificantSoundTime;
        lastSignificantSoundTime = currentTime;
    } else {
        soundDuration = 0;
    }

    if (volumen < soundThreshold) {
        return;
    }

    let spectrum = fft.analyze();
    let binSize = 22050 / spectrum.length;

    let dominantFrequency = 0;
    let dominantMagnitude = 0;

    for (let i = 0; i < spectrum.length; i++) {
        if (spectrum[i] > dominantMagnitude) {
            dominantMagnitude = spectrum[i];
            dominantFrequency = i * binSize;
        }
    }

    let nuevoGrupo = 1;

    if (dominantFrequency >= 165 && dominantFrequency <= 200) {
        nuevoGrupo = 5;
    } else if (dominantFrequency >= 220 && dominantFrequency <= 300) {
        nuevoGrupo = 1;
    } else if (dominantFrequency >= 320 && dominantFrequency <= 450) {
        nuevoGrupo = 2;
    } else if (dominantFrequency >= 500 && dominantFrequency <= 700) {
        nuevoGrupo = 4;
    } else if (dominantFrequency >= 750) {
        nuevoGrupo = 3;
    }

    if (nuevoGrupo !== grupoActual) {
        grupoActual = nuevoGrupo;
        const primerPincel = GruposPinceles[nuevoGrupo].pinceles[0];
        pincelNombre = primerPincel;
        pincelActual = pinceles[primerPincel] || pincelActual;
    }

    lastSoundDetectionTime = currentTime;
}

function draw() {
    if (!mic) return;

    if (!sketchStarted) {
        iniciarNuevoSketchSiCorresponde();
        return;
    }

    if (!audioIniciado || !mic) return;

    detectarSonido();
    reiniciarSketchConClick();

    let volumen = mic.getLevel();
    if (volumen < 0.005) return;

    let currentTime = millis();
    if (currentTime - lastDrawTime < drawDelay) {
        return;
    }
    lastDrawTime = currentTime;

    let x = random(-10, width + 10);
    let y = random(-10, height + 10);
    dibujarTrazo(x, y, volumen);
}

function dibujarTrazo(x, y, volumen = 0.2) {
    const nombrePincel = elegirPincelDelGrupo();
    if (!nombrePincel || !pinceles[nombrePincel]) return;

    let celdaX = Math.floor(x / tamañoCelda);
    let celdaY = Math.floor(y / tamañoCelda);
    let claveZona = celdaX + "_" + celdaY;

    if (!mapaZonas[claveZona]) {
        mapaZonas[claveZona] = 0;
    }

    if (mapaZonas[claveZona] >= maximoPorZona) {
        return;
    }

    let aleatorioTamaño = random();
    let tamañoDinamico;

    const esLinea = nombrePincel.startsWith("linea") || nombrePincel.startsWith("lineas");

    if (esLinea) {
        if (aleatorioTamaño < 0.2) {
            tamañoDinamico = random(200, 260);
        } else if (aleatorioTamaño < 0.7) {
            tamañoDinamico = random(280, 380);
        } else {
            tamañoDinamico = random(420, 620);
        }
    } else {
        if (aleatorioTamaño < 0.25) {
            tamañoDinamico = random(200, 240);
        } else if (aleatorioTamaño < 0.75) {
            tamañoDinamico = random(250, 320);
        } else {
            tamañoDinamico = random(330, 450);
        }
    }

    tamañoDinamico = constrain(tamañoDinamico, 200, esLinea ? 620 : 450);

    let rotacion = random(0, TWO_PI);

    let colorNombre = obtenerColorDisponible(tamañoDinamico);
    if (!colorNombre) {
        return;
    }

    let colorRGB = paletaActual[colorNombre].rgb;

    push();
    translate(x, y);
    rotate(rotacion);
    tint(colorRGB[0], colorRGB[1], colorRGB[2]);
    imageMode(CENTER);
    image(pinceles[nombrePincel], 0, 0, tamañoDinamico, tamañoDinamico);
    imageMode(CORNER);
    noTint();
    pop();

    usosPinceles[nombrePincel] = (usosPinceles[nombrePincel] || 0) + 1;
    mapaZonas[claveZona]++;
    paletaActual[colorNombre].trazosActuales++;

    pincelNombre = nombrePincel;
    pincelActual = pinceles[nombrePincel];
}

function mousePressed() {
    if (audioIniciado) {
        return false;
    }

    if (!mic || typeof userStartAudio !== "function") {
        console.warn("No hay micrófono listo o la API de audio no está disponible.");
        return false;
    }

    userStartAudio().then(() => {
        mic.start();
        audioIniciado = true;
        console.log("Micrófono activado. Haz ruido para dibujar.");
    }).catch(e => {
        console.error("Error al iniciar el audio:", e);
    });

    return false;
}
//actualizado

