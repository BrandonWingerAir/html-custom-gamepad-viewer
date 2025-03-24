document.addEventListener('DOMContentLoaded', () => {
    const brakeOverlay = document.getElementById('frontBrakeOverlay');
    const engineOverlay = document.getElementById('engineOverlay');
    const overlayLeft = document.getElementById('colorOverlayLeft');
    const overlayRight = document.getElementById('colorOverlayRight');
    const leanDot = document.getElementById('dot');

    const deadZone = 0.2;

    let leanControlX = 2;
    let leanControlY = 3;

    let steerControlX = 0;

    // Toggle controls menu when "H" key is pressed
    const controlsMenu = document.getElementById('controls-section');

    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'h') {
            controlsMenu.style.display = controlsMenu.style.display === 'none' ? 'block' : 'none';
        }
    });

    // Listen for gamepad connection
    window.addEventListener('gamepadconnected', (event) => {
        console.log(`Gamepad connected: ${event.gamepad.id}`);
        document.getElementById("connectController").style.display = 'none';

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

        function updateOverlay() {
            const gamepad = navigator.getGamepads()[event.gamepad.index];

            // Controls Display
            if (gamepad) {
                // Handlebar Steering Control
                let leftStickX = gamepad.axes[steerControlX]; // (value from -1 to 1) 
                leftStickX = normalizeInput(leftStickX, deadZone);
                
                const steerRightPercentage = Math.max(0, leftStickX) * 100; // From center (0) to right (1)
                overlayRight.style.clipPath = `polygon(0 0, ${steerRightPercentage}% 0, ${steerRightPercentage}% 100%, 0 100%)`;

                const steerLeftPercentage = Math.max(0, -leftStickX) * 100; // From center (0) to left (-1)
                overlayLeft.style.clipPath = `polygon(${100 - steerLeftPercentage}% 0, 100% 0, 100% 100%, ${100 - steerLeftPercentage}% 100%)`;

                // Rider Lean Control
                function updateDotPosition(x, y) {
                    const circle = document.querySelector('.circle');
                    const radius = circle.offsetWidth / 2;
                    
                    const posX = (x * radius) + radius;
                    const posY = (y * radius) + radius;
            
                    leanDot.style.left = `${posX}px`;
                    leanDot.style.top = `${posY}px`;
                }

                let rightStickX = gamepad.axes[leanControlX];
                let rightStickY = gamepad.axes[leanControlY];

                rightStickX = normalizeInput(rightStickX, deadZone);
                rightStickY = normalizeInput(rightStickY, deadZone);
            
                updateDotPosition(rightStickX, rightStickY);

                // Button: A (Rear Brake)
                if (gamepad.buttons[0].pressed) {
                    document.getElementById("button-a").style.opacity = "1";
                } else {
                    document.getElementById("button-a").style.opacity = "0.5";
                }

                // Button: Right Bumper (Foot Drag)
                if (gamepad.buttons[5].pressed) {
                    document.getElementById("buttonFootDrag").style.opacity = "1";
                } else {
                    document.getElementById("buttonFootDrag").style.opacity = "0.5";
                }

                // Button: Left Bumper (Clutch)
                if (gamepad.buttons[4].pressed) {
                    document.getElementById("button-left-bumper").style.opacity = "1";
                } else {
                    document.getElementById("button-left-bumper").style.opacity = "0.5";
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

    // Map Controls
    const steerControlBox = document.getElementById('steerControl');
    const leanControlBox = document.getElementById('leanControl');

    steerControlBox.addEventListener('change', (event) => {
        if (event.target.value == 'left_stick') {
            steerControlX = 0;
            leanControlX = 2;
            leanControlY = 3;
            leanControlBox.value = 'right_stick'
        } else if (event.target.value == 'right_stick') {
            steerControlX = 2;
            leanControlX = 0;
            leanControlY = 1;
            leanControlBox.value = 'left_stick'
        }
    });
    
    leanControlBox.addEventListener('change', (event) => {
        if (event.target.value == 'right_stick') {
            steerControlX = 0;
            leanControlX = 2;
            leanControlY = 3;
            steerControlBox.value = 'left_stick';
        } else if (event.target.value == 'left_stick') {
            steerControlX = 2;
            leanControlX = 0;
            leanControlY = 1;
            steerControlBox.value = 'right_stick';
        }
    });

    // Handle gamepad disconnection
    window.addEventListener('gamepaddisconnected', (event) => {
        console.log(`Gamepad disconnected: ${event.gamepad.id}`);
        document.getElementById('connectController').style.display = 'none';
    });
});