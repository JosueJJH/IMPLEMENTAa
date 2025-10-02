// 🎯 Elementos principales
const inputText = document.getElementById("inputText");
const conversionType = document.getElementById("conversionType");
const convertBtn = document.getElementById("convertBtn");
const outputArea = document.getElementById("outputArea");
const secreto = document.getElementById("secreto");
const exampleButtons = document.querySelectorAll(".example-btn"); 
const copyBtn = document.getElementById("copyBtn"); // Nuevo botón de Copiar

// 🔤 Mapa de Código Morse (usado para codificar y DECODIFICAR)
const morseMap = {
    a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.",
    g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..",
    m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
    s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
    y: "-.--", z: "--..",
    1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....",
    6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
    "=": "-...-", "+": ".-.-.", "-": "-....-",
    "ñ": "--.--", 
    "á": ".--.-", "é": "..-..", "í": "..", "ó": "---.", "ú": "..--", 
    " ": "/"
};

// 🎯 Invertir Mapa de Morse para Decodificación
const morseDecodeMap = Object.fromEntries(
    Object.entries(morseMap).map(([key, value]) => [value, key])
);

// --------------------------------------------------------
// --- LÓGICA DE CONVERSIÓN (TEXTO A CÓDIGO) ---
// --------------------------------------------------------
function encodeToCode(text, type) {
    switch (type) {
        case "binary":
            return text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(" ");
        case "ascii":
            return text.split("").map(c => c.charCodeAt(0)).join(" ");
        case "hex":
            return text.split("").map(c => c.charCodeAt(0).toString(16).toUpperCase()).join(" ");
        case "base64":
            return btoa(text);
        case "morse":
            return text.toLowerCase().split("").map(c => morseMap[c] || "<?>").join(" ");
        default:
            return "Error: Tipo de conversión no válido.";
    }
}

// --------------------------------------------------------
// --- LÓGICA DE DECODIFICACIÓN (CÓDIGO A TEXTO) ---
// --------------------------------------------------------
function decodeToText(code, type) {
    const parts = code.trim().split(/\s+/); // Divide por espacios o cualquier separador
    let result = "";

    switch (type) {
        case "binary":
            // Cada parte es un byte (8 bits)
            parts.forEach(byte => {
                // Parsea el binario a decimal y luego a carácter
                result += String.fromCharCode(parseInt(byte, 2));
            });
            return result.replace(/\u0000/g, ' '); // Reemplaza null chars por espacio
            
        case "ascii":
            // Cada parte es un valor decimal ASCII
            parts.forEach(decimal => {
                result += String.fromCharCode(parseInt(decimal, 10));
            });
            return result;
            
        case "hex":
            // Cada parte es un valor hexadecimal
            parts.forEach(hex => {
                result += String.fromCharCode(parseInt(hex, 16));
            });
            return result;

        case "base64":
            try {
                // Utiliza la función nativa atob para decodificar
                return atob(code);
            } catch (e) {
                return "Error en Base64: Formato inválido.";
            }
            
        case "morse":
            // Los códigos Morse están separados por espacios. 
            // La barra "/" representa un espacio de palabra.
            const morseParts = code.trim().split(" ");
            morseParts.forEach(symbol => {
                result += morseDecodeMap[symbol] || "";
            });
            return result;
            
        default:
            return "Error: Tipo de decodificación no válido.";
    }
}


// --------------------------------------------------------
// --- EVENT LISTENERS ---
// --------------------------------------------------------

// 🎯 Función principal de Conversión/Decodificación
convertBtn.addEventListener("click", () => {
    const text = inputText.value.trim();
    const type = conversionType.value;
    let result = "";

    if (!text) {
        outputArea.textContent = "Por favor, ingresa el texto o código.";
        return;
    }

    // Comprueba si la conversión es de Texto a Código o de Código a Texto
    if (type.startsWith("decode")) {
        // Lógica de decodificación (Código a Texto)
        result = decodeToText(text, type.split('_')[1]); 
    } else {
        // Lógica de codificación (Texto a Código)
        result = encodeToCode(text, type);
    }

    outputArea.textContent = result || "(resultado aquí)";
    handleEasterEggs(text);
});

// 🎯 Manejo de Botones de Ejemplo
exampleButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputText.value = button.getAttribute('data-text');
        convertBtn.click(); 
    });
});

// 🎯 Función de Copiar al Portapapeles
copyBtn.addEventListener('click', () => {
    const textToCopy = outputArea.textContent;
    if (textToCopy && textToCopy !== "(resultado aquí)") {
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.textContent = '✅ Copiado!';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copiar';
            }, 1500);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert("Error al copiar el texto.");
        });
    } else {
        alert("No hay resultado para copiar.");
    }
});


// --------------------------------------------------------
// 🧪 Función para Easter Eggs y Trampas (Asegurando Persistencia)
// --------------------------------------------------------
function handleEasterEggs(text) {
    const lowerText = text.toLowerCase();
    
    // --- Modo NEON/Secreto (PERSISTENTE) ---
    if (lowerText.includes("josué") || lowerText.includes("neoncode")) {
        document.body.classList.add("neon");
        secreto.style.display = "block";
        if (lowerText.includes("josué") && !document.body.classList.contains("josue-alerted")) {
            alert("¡Modo Josué activado! Bienvenido al laboratorio secreto 🧪");
            document.body.classList.add("josue-alerted"); 
        }
    }

    // --- Modo Matrix (PERSISTENTE) ---
    if (lowerText.includes("matrix")) {
        document.body.classList.add("matrix-mode");
        if (!document.body.classList.contains("matrix-alerted")) {
             alert("Bienvenido a la simulación 🧬");
             document.body.classList.add("matrix-alerted");
        }
    }
    
    // --- Comando de Salida ÚNICO ---
    if (lowerText.includes("normal") || lowerText.includes("reset")) {
        document.body.classList.remove("neon");
        document.body.classList.remove("matrix-mode");
        secreto.style.display = "none";
        document.body.classList.remove("josue-alerted");
        document.body.classList.remove("matrix-alerted");
    }

    // --- Trampa del Botón (no persistente) ---
    if (lowerText.includes("trampa")) {
        convertBtn.style.position = "absolute";
        convertBtn.style.left = Math.random() * 80 + "%";
        convertBtn.style.top = Math.random() * 80 + "%";
        alert("¡Ups! El botón se volvió travieso 😈");
    } else {
        convertBtn.style.position = "static";
        convertBtn.style.left = "auto";
        convertBtn.style.top = "auto";
    }
}