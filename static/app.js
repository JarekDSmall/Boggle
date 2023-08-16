document.addEventListener('DOMContentLoaded', function() {
    const wordForm = document.querySelector('#word-form');
    const wordInput = document.querySelector('#word-input');
    const resultMessage = document.querySelector('#result-message');
    const playAgainButton = document.querySelector('#play-again');
    const timerDisplay = document.querySelector('#timer');

    let timer = 60; // Timer in seconds

    function updateTimerDisplay() {
        timerDisplay.textContent = `Time remaining: ${timer} seconds`;
    }

    const countdown = setInterval(function() {
        if (timer > 0) {
            timer--;
            updateTimerDisplay();
        } else {
            clearInterval(countdown);
            wordInput.disabled = true;
            resultMessage.textContent = 'Time\'s up! Game over.';
        }
    }, 1000);

    updateTimerDisplay();

    wordForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        resultMessage.textContent = '';

        const word = wordInput.value.trim();
        if (word === '') {
            return;
        }

        const response = await fetch('/check-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });

        const data = await response.json();
        resultMessage.textContent = getResultMessage(data.result);
    });

    playAgainButton.addEventListener('click', async function() {
        const response = await fetch('/play-again', {
            method: 'POST'
        });

        const data = await response.json();
        if (data.result === 'ok') {
            window.location.reload();
        }
    });

    function getResultMessage(result) {
        if (result === 'ok') {
            return 'Valid word!';
        } else if (result === 'not-on-board') {
            return 'Word is not on the board.';
        } else if (result === 'not-word') {
            return 'Not a valid word.';
        }
        return '';
    }
});
