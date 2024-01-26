$(document).ready(function () {
    let explode = false;
    let successAttempts = 0;
    let bombChecker;

    $('.game-on').on('click', function () {
        $(this).fadeOut(2000);
        startCountdown();
        setTimeout(createSquares, 2000);
    });

    function startCountdown() {
        const countdownElement = $(".count-down");
        let timeInSeconds = 20;

        function updateCountdown() {
            let minutes = Math.floor(timeInSeconds / 60);
            let seconds = timeInSeconds % 60;
            const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            countdownElement.text(formattedTime);
            if (timeInSeconds <= 0) {
                clearInterval(intervalId);
                explode = true;
            } else {
                timeInSeconds--;
                if (timeInSeconds < 10) {
                    $(".bomb-container").css("animation", "tilt-n-move-shaking 0.40s infinite");
                }
            }
        }

        const intervalId = setInterval(updateCountdown, 1000);
    }

    function createSquares() {
        const container = $("#container").empty();
        const correctIndex = Math.floor(Math.random() * 4);
        const color = getRandomColor();
        const colorOfTheRight = adjustColorToneRGB(color, 10);

        for (let i = 0; i < 4; i++) {
            const square = $("<button>").addClass("square").css("backgroundColor", i === correctIndex ? colorOfTheRight : color);
            square.on("click", function () {
                if (i === correctIndex) {
                    successAttempts++;
                    $("#attempts").html(`Successful attempts: ${successAttempts}/5`);
                    if (successAttempts === 5){
                        clearInterval(bombChecker);
                        $('#diffused').show();
                    } 
                    explode = false;
                } else {
                    explode = true;
                    checkExplosion();
                }
                createSquares();
            });
            container.append(square);
        }
    }

    function getRandomColor() {
        const generateComponent = () => Math.floor(Math.random() * 256);
        return `rgb(${generateComponent()}, ${generateComponent()}, ${generateComponent()})`;
    }

    function adjustColorToneRGB(color, amount) {
        const extractComponents = color => color.match(/\d+/g).map(Number);
        const [red, green, blue] = extractComponents(color);
        const adjustComponent = component => Math.min(255, Math.max(0, component + amount));
        return `rgb(${adjustComponent(red)}, ${adjustComponent(green)}, ${adjustComponent(blue)})`;
    }

    function checkExplosion() {
        if (explode) {
            clearInterval(bombChecker);
            $("super-container").hide();
            $("#explosion").show();
            $('#myImage').fadeIn(10000);
            document.getElementById('explosionAudio').play();
        }
    }

    bombChecker = setInterval(checkExplosion, 1000);
});