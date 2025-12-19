/********************
 * KỶ NIỆM
 ********************/
const memories = [
    {
        id: 1,
        icon: '📍',
        img: 'images/22_12_24.jpg',
        date: '22/12/2024',
        text: 'Kỷ niệm 2 năm nè.'
    },
    {
        id: 2,
        icon: '🌊',
        img: 'images/21_06_24.jpg',
        date: '21/01/2024',
        text: 'Vũng Tàu năm trước, mưa điên luonnn.'
    },
    {
        id: 3,
        icon: '🎓',
        img: 'images/22_11_25.jpg',
        date: '22/11/2025',
        text: 'Chụp hình tốt nghiệp thì cười lên.'
    },
    {
        id: 4,
        icon: '📸',
        img: 'images/24_04_23.jpg',
        date: '24/04/2023',
        text: 'Quên này là gì ròiiii.'
    },
    {
        id: 5,
        icon: '🎄',
        img: 'images/24_12_22.jpg',
        date: '24/12/2022',
        text: 'Noel đầu tiên nè phải không ta.'
    }
];

// Tạo bộ bài (8 thẻ)
const deck = [...memories, ...memories].sort(() => 0.5 - Math.random());

/********************
 * DOM
 ********************/
const intro = document.getElementById('intro');
const game = document.getElementById('game');
const end = document.getElementById('end');
const board = document.getElementById('board');
const startBtn = document.getElementById('startBtn');
const timerEl = document.getElementById('timer');
const music = document.getElementById('music');

const overlay = document.getElementById('memoryOverlay');
const memoryImage = document.getElementById('memoryImage');
const memoryDate = document.getElementById('memoryDate');
const memoryText = document.getElementById('memoryText');
const closeMemory = document.getElementById('closeMemory');

/********************
 * STATE
 ********************/
let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let seconds = 0;
let timerInterval;

let messageIndex = 0;

let wrongCount = 0;
const sadIcons = ['😢', '🥺', '💔'];

const sadMessages = [
    'Sai gòiiiiiii =)))))))))))',
    'Sai nữa hả :))??',
    'Ê, sai quài nhaaaa :)))))',
    'Tức áaaaaa :))))))'

];


/********************
 * START GAME
 ********************/
startBtn.addEventListener('click', startGame);

function startGame() {
    intro.style.display = 'none';
    game.style.display = 'block';

    // 🎵 PHÁT NHẠC SAU CLICK
    music.currentTime = 0;
    music.volume = 0.6;

    const playPromise = music.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            console.log('Trình duyệt chặn autoplay');
        });
    }

    startTimer();
    createCards();
}


/********************
 * TIMER
 ********************/
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.innerText = `⏱️ ${seconds} giây`;
    }, 1000);
}

/********************
 * CREATE CARDS
 ********************/
function createCards() {
    board.innerHTML = '';

    deck.forEach(memory => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.dataset.id = memory.id;
        card.dataset.icon = memory.icon;
        card.dataset.img = memory.img;
        card.dataset.date = memory.date;
        card.dataset.text = memory.text;

        // 👇 CẤU TRÚC FLIP CARD
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${memory.icon}</div>
            </div>
        `;

        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}


/********************
 * FLIP CARD
 ********************/
function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    lockBoard = true;

    const firstBack = firstCard.querySelector('.card-back');
    const secondBack = card.querySelector('.card-back');

    // ===== LẬT ĐÚNG =====
    if (firstCard.dataset.id === card.dataset.id) {
        matchedPairs++;

        firstCard.classList.add('matched');
        card.classList.add('matched');

        createHearts(card);

        setTimeout(() => {
            showMemory(card);
        }, 2000);

        return; // resetTurn nằm trong nút "Tiếp tục"
    }

    // ===== LẬT SAI =====
    wrongCount++;

    const sadIcon = sadIcons[Math.floor(Math.random() * sadIcons.length)];

    // 👉 CHẮC CHẮN SẼ RESET
    setTimeout(() => {
        firstBack.innerText = sadIcon;
        secondBack.innerText = sadIcon;

        firstCard.classList.add('shake');
        card.classList.add('shake');

        // 👉 SAU MỖI 3 LẦN SAI
        if (wrongCount % 3 === 0) {
            showSadMessage();
        }

        setTimeout(() => {
            firstBack.innerText = firstCard.dataset.icon;
            secondBack.innerText = card.dataset.icon;

            firstCard.classList.remove('flipped', 'shake');
            card.classList.remove('flipped', 'shake');

            resetTurn(); // ✅ LUÔN ĐƯỢC GỌI
        }, 600);
    }, 400);
}





/********************
 * SHOW MEMORY
 ********************/
function showMemory(card) {
    memoryImage.src = card.dataset.img;
    memoryDate.innerText = card.dataset.date;
    memoryText.innerText = card.dataset.text;

    overlay.style.display = 'flex';

    closeMemory.onclick = () => {
        overlay.style.display = 'none';

        // ✅ MỞ KHÓA GAME TẠI ĐÂY
        resetTurn();

        if (matchedPairs === memories.length) {
            finishGame();
        }
    };
}


/********************
 * RESET
 ********************/
function resetTurn() {
    [firstCard, lockBoard] = [null, false];
}

/********************
 * END GAME
 ********************/
function finishGame() {
    clearInterval(timerInterval);
    game.style.display = 'none';
    end.style.display = 'block';

    const startDate = new Date('2022-12-22');
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    document.getElementById('loveDays').innerText =
        `Chúng ta đã bên nhau ${days} ngày 💕`;
}

function goFireworks() {
    window.location.href = 'fireworks.html';
}

function createHearts(card) {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerText = '💖';

        const rect = card.getBoundingClientRect();
        heart.style.left = rect.left + rect.width / 2 + 'px';
        heart.style.top = rect.top + rect.height / 2 + 'px';

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }
}

function showSadMessage() {
    const msg = document.createElement('div');
    msg.className = 'sad-message';

    msg.innerText = sadMessages[messageIndex];
    messageIndex = (messageIndex + 1) % sadMessages.length;

    document.body.appendChild(msg);

    setTimeout(() => msg.remove(), 1600);
}


