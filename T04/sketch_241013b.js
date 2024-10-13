let ball = {
  x: 200,
  y: 200,
  radius: 20,
  speedX: 0,
  speedY: 0,
  gravityX: 0,
  gravityY: 0.5, // Gravedad hacia abajo
  bounce: -0.3, // Coeficiente de rebote base
  friction: 0.98, // Fricción
  dynamicFriction: 0.95, // Fricción dinámica
  mass: 1, // Masa de la pelota
  airResistance: 0.01, // Resistencia del aire
  angle: 0, // Ángulo de rotación
  angularSpeed: 0.05, // Velocidad angular
};

let movingObject = {
  x: 300,
  y: 400,
  width: 100,
  height: 20,
  speedX: 2 // Velocidad de movimiento horizontal
};

let angle = 0; // Ángulo de rotación en múltiplos de 90 grados
const velocityThreshold = 0.1; // Umbral de velocidad para detener la rotación
const bounceThreshold = 0.1; // Umbral de velocidad para dejar de rebotar

let gravityEnabled = true; // Activar/desactivar gravedad
let frictionEnabled = true; // Activar/desactivar fricción
let bounceEnabled = true; // Activar/desactivar rebote
let guideVisible = true; // Variable para controlar la visibilidad de la guía

function setup() {
  createCanvas(600, 600); // Aumentar el tamaño del lienzo

  // Crear el botón para cambiar la dirección de la gravedad
  let button = createButton('Invertir vector gravedad');
  button.position(10, height + 10); // Ubicación fuera del área donde está la pelota
  button.mousePressed(changeGravityDirection);

  // Crear un selector para activar/desactivar la gravedad
  let gravitySelector = createSelect();
  gravitySelector.position(10, height + 50); // Ubicación fuera del área donde está la pelota
  gravitySelector.option('Gravedad: Sí');
  gravitySelector.option('Gravedad: No');
  gravitySelector.changed(() => {
    gravityEnabled = gravitySelector.value() === 'Gravedad: Sí';
    ball.gravityY = gravityEnabled ? 0.5 : 0; // Ajustar gravedad según selección
    ball.gravityX = gravityEnabled ? 0 : 0; // Restablecer gravedad X
    // Detener la pelota si la gravedad está desactivada
    if (!gravityEnabled) {
      ball.speedX = 0;
      ball.speedY = 0;
    }
  });

  // Crear un selector para activar/desactivar el rebote
  let bounceSelector = createSelect();
  bounceSelector.position(10, height + 110); // Ubicación fuera del área donde está la pelota
  bounceSelector.option('Rebote: Sí');
  bounceSelector.option('Rebote: No');
  bounceSelector.changed(() => {
    bounceEnabled = bounceSelector.value() === 'Rebote: Sí';
  });

  // Crear un selector para activar/desactivar la fricción
  let frictionSelector = createSelect();
  frictionSelector.position(10, height + 150); // Ubicación fuera del área donde está la pelota
  frictionSelector.option('Fricción: Sí');
  frictionSelector.option('Fricción: No');
  frictionSelector.changed(() => {
    frictionEnabled = frictionSelector.value() === 'Fricción: Sí';
  });

  // Botón para mostrar/ocultar la guía
  let guideButton = createButton('Mostrar/Ocultar Guía');
  guideButton.position(10, height + 190);
  guideButton.mousePressed(() => {
    guideVisible = !guideVisible; // Alternar visibilidad
  });
}

function draw() {
  background(255); // Color de fondo blanco

  drawDynamicBackground(); // Llamada para dibujar el fondo dinámico

  // Actualizar la posición de la bola solo si la gravedad está habilitada
  if (gravityEnabled) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Aplicar gravedad
    ball.speedX += ball.gravityX; // Afectar velocidad X por la gravedad
    ball.speedY += ball.gravityY; // Afectar velocidad Y por la gravedad

    // Aplicar roce para reducir la velocidad con el tiempo si está habilitada
    if (frictionEnabled) {
      ball.speedX *= ball.friction;
      ball.speedY *= ball.friction;
    }

    // Aplicar resistencia del aire
    ball.speedX -= ball.speedX * ball.airResistance; // Resistencia en la dirección X
    ball.speedY -= ball.speedY * ball.airResistance; // Resistencia en la dirección Y

    // Aplicar fricción dinámica cuando la velocidad es baja
    if (abs(ball.speedX) < 0.5 && frictionEnabled) {
      ball.speedX *= ball.dynamicFriction;
    }
    if (abs(ball.speedY) < 0.5 && frictionEnabled) {
      ball.speedY *= ball.dynamicFriction;
    }

    // Revisar si la bola toca los bordes y rebotar
    if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      if (bounceEnabled && abs(ball.speedY) > bounceThreshold) {
        ball.speedY *= ball.bounce; // Aplicar rebote
      } else {
        ball.speedY = 0; // Detener movimiento vertical si el rebote está desactivado
      }
    }
    if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      if (bounceEnabled && abs(ball.speedX) > bounceThreshold) {
        ball.speedX *= ball.bounce; // Aplicar rebote
      } else {
        ball.speedX = 0; // Detener movimiento horizontal si el rebote está desactivado
      }
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      if (bounceEnabled && abs(ball.speedY) > bounceThreshold) {
        ball.speedY *= ball.bounce; // Aplicar rebote
      } else {
        ball.speedY = 0; // Detener movimiento vertical si el rebote está desactivado
      }
    }
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      if (bounceEnabled && abs(ball.speedX) > bounceThreshold) {
        ball.speedX *= ball.bounce; // Aplicar rebote
      } else {
        ball.speedX = 0; // Detener movimiento horizontal si el rebote está desactivado
      }
    }
  }

  // Actualizar la posición del objeto móvil
  movingObject.x += movingObject.speedX;

  // Cambiar dirección del objeto si alcanza los bordes
  if (movingObject.x < 0 || movingObject.x + movingObject.width > width) {
    movingObject.speedX *= -1; // Invertir la dirección
  }

  // Dibujar el objeto móvil
  fill(0, 255, 0);
  rect(movingObject.x, movingObject.y, movingObject.width, movingObject.height);

  // Colisiones entre la pelota y el objeto móvil
  if (
    ball.x + ball.radius > movingObject.x &&
    ball.x - ball.radius < movingObject.x + movingObject.width &&
    ball.y + ball.radius > movingObject.y &&
    ball.y - ball.radius < movingObject.y + movingObject.height
  ) {
    // Generar un coeficiente de rebote aleatorio entre 0.1 y 0.9
    let randomBounce = random(0.1, 0.9);
    ball.speedY *= -randomBounce; // Rebote vertical al colisionar
    ball.y = movingObject.y - ball.radius; // Colocar la pelota encima del objeto
  }

  // Dibujar la bola
  fill(255, 0, 0);
  ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);

  // Mostrar la guía si está activa
  if (guideVisible) {
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text("Controles:\n- invertir vector gravedad: invierte la dirección de la gravedad.\n- Gravedad: Activa o desactiva la gravedad.\n- Rebote: Activa o desactiva el rebote.\n- Fricción: Activa o desactiva la fricción.\n\nHaz clic para lanzar la pelota.", 10, height - 100);
  }
}

// Función para cambiar la dirección de la gravedad
function changeGravityDirection() {
  ball.gravityY = -ball.gravityY; // Cambiar dirección de la gravedad
}

// Función para dibujar un fondo dinámico
function drawDynamicBackground() {
  fill(150, 200, 255); // Color azul claro
  rect(0, height - 100, width, 100); // Simulando el suelo

  // Dibujar algunas líneas para simular movimiento
  stroke(0, 150); // Color negro con cierta transparencia
  strokeWeight(1);
  for (let i = 0; i < width; i += 20) {
    line(i, 0, i, height); // Líneas verticales
  }
  for (let j = 0; j < height; j += 20) {
    line(0, j, width, j); // Líneas horizontales
  }
}
