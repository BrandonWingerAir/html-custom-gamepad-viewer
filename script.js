document.addEventListener('DOMContentLoaded', () => {
    const brakeOverlay = document.getElementById('frontBrakeOverlay');
    const engineOverlay = document.getElementById('engineOverlay');
    const overlay = document.getElementById('colorOverlay');

    const deadZone = 0.2;

    // Listen for gamepad connection
    window.addEventListener('gamepadconnected', (event) => {
    console.log(`Gamepad connected: ${event.gamepad.id}`);

    function updateOverlayRight(triggerValue) {
        const clipPercentage = triggerValue * 100; // Convert trigger value (0 to 1) to percentage
        brakeOverlay.style.clipPath = `polygon(calc(100% - ${clipPercentage}%) 0, 100% 0, 100% 100%, calc(100% - ${clipPercentage}%) 100%)`;
    }

    function updateOverlayHeight(triggerValue) {
        const clipPercentage = triggerValue * 100; // Convert trigger value (0 to 1) to percentage
        engineOverlay.style.clipPath = `polygon(0 ${100 - clipPercentage}%, 100% ${100 - clipPercentage}%, 100% 100%, 0 100%)`;
    }

    function normalizeInput(value, deadZone) {
        // If the value is within the dead zone, treat it as zero
        if (Math.abs(value) < deadZone) {
            return 0;
        }

        // Normalize the value to adjust for the dead zone
        const sign = Math.sign(value); // Preserve direction
        const adjustedValue = (Math.abs(value) - deadZone) / (1 - deadZone);

        return sign * adjustedValue; // Return normalized value with direction
    }

    const dot = document.getElementById('dot');

    function updateDotPosition(x, y) {
        const circle = document.querySelector('.circle');
        const radius = circle.offsetWidth / 2;
        
        const posX = (x * radius) + radius;
        const posY = (y * radius) + radius;

        dot.style.left = `${posX}px`;
        dot.style.top = `${posY}px`;
    }

    function updateOverlay() {
        const gamepad = navigator.getGamepads()[event.gamepad.index];

        if (gamepad) {
            // Left Stick (Handlebar Steering Control)
            let leftStickX = gamepad.axes[0]; // (value from -1 to 1) 

            leftStickX = normalizeInput(leftStickX, deadZone);
            
            // Calculate percentage from center (0) to right (1)
            const steerRightPercentage = Math.max(0, leftStickX) * 100;      

            overlay.style.clipPath = `polygon(0 0, ${steerRightPercentage}% 0, ${steerRightPercentage}% 100%, 0 100%)`;

            // Right Stick (Rider Lean Control)
            let rightStickX = gamepad.axes[2];
            let rightStickY = gamepad.axes[3];

            rightStickX = normalizeInput(rightStickX, deadZone);
            rightStickY = normalizeInput(rightStickY, deadZone);
        
            updateDotPosition(rightStickX, rightStickY);

            // Button: B (Rear Brake)
            if (gamepad.buttons[1].pressed) {
                document.getElementById("button-a").style.opacity = "1";
            } else {
                document.getElementById("button-a").style.opacity = "0.5";
            }

            // Left Trigger (Front Brake)
            const leftTrigger = gamepad.buttons[6].value;        

            updateOverlayRight(leftTrigger);

            // Right Trigger (Gas Throttle)
            const rightTrigger = gamepad.buttons[7].value;        

            updateOverlayHeight(rightTrigger);
        }

        requestAnimationFrame(updateOverlay);
    }

    updateOverlay(); // Start the loop
    });

    // Handle gamepad disconnection
    window.addEventListener('gamepaddisconnected', (event) => {
    console.log(`Gamepad disconnected: ${event.gamepad.id}`);
    });
});