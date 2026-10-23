// edit every personal note here so the whole site sounds like you
const MESSAGES = [
  { type: 'heart', text: 'you make every day feel softer' },
  { type: 'heart', text: 'i am so lucky you picked me' },
  { type: 'heart', text: 'kinda you are my favorite person' },
  { type: 'heart', text: 'your smile is my favorite thing' },
  { type: 'heart', text: 'i love being on your team' },
  { type: 'heart', text: 'you make ordinary days feel magic' },
  { type: 'heart', text: 'i will always make time for us' },
  { type: 'heart', text: 'i am listening and learning always' },
  {
    type: 'apology',
    paragraphs: [
      'i have been thinking about what happened and about how it might have made you feel and i want you to know that i am truly sorry',
      'i am sorry for the part i played in making your heart feel heavy you deserve to feel heard cared for and safe with me and i know i have not always shown that in the way you needed',
      'i do not want to brush past your feelings or make excuses i want to listen properly understand you better and take responsibility for the things i need to change',
      'you matter to me more than being right or having the last word ever could i want to keep learning how to love you in the thoughtful gentle way you deserve',
      'thank you for being patient with me and for letting me try to make things right i love you and i am so sorry'
    ]
  },
  {
    type: 'love',
    paragraphs: [
      'kinda i wish i could put into words just how much i love you because somehow every time i try it still feels too small',
      'you are so beautiful to me in all the little ways you laugh your smile the way you care about people and the way you make a room feel warmer just by being in it',
      'you are clever and sweet and funny and so incredibly cute and to me you are perfect just the way you are i hope you never feel like you have to be anything else for me to adore you',
      'i love our little moments the silly talks the quiet ones and all the ordinary days that are better just because i get to share them with you',
      'you are not just someone i love you are my favorite person my safe place and the girl i feel lucky to choose again every single day',
      'i love you so much exactly as you are and i will keep reminding you whenever you need to hear it'
    ]
  },
  { type: 'final', text: 'بحبك كنده' }
];

const screens = [...document.querySelectorAll('.screen')];
const opening = document.querySelector('#opening');
const game = document.querySelector('#game');
const apology = document.querySelector('#apology');
const loveLetter = document.querySelector('#love-letter');
const finalScreen = document.querySelector('#final');
const garden = document.querySelector('#heart-garden');
const counter = document.querySelector('#counter');
const progress = document.querySelector('#progress');
const progressFill = document.querySelector('#progress-fill');
const notePop = document.querySelector('#note-pop');
const apologyScroll = document.querySelector('#apology-scroll');
const loveScroll = document.querySelector('#love-scroll');
const loveSong = document.querySelector('#love-song');
const musicToggle = document.querySelector('#music-toggle');
const musicStatus = document.querySelector('#music-status');
let heartsCollected = 0;
let noteTimer;

// drop a photo of you two into the photo spot by replacing its placeholder in index.html with an img using a relative src such as images/us.jpg

function showScreen(target) {
  for (const screen of screens) {
    const active = screen === target;
    screen.classList.toggle('is-active', active);
    screen.setAttribute('aria-hidden', String(!active));
    screen.inert = !active;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLetterAfterScrollHint(target, toast) {
  showScreen(target);
  target.classList.add('is-preparing');
  toast.classList.remove('is-leaving');
  window.setTimeout(() => {
    toast.classList.add('is-leaving');
    window.setTimeout(() => target.classList.remove('is-preparing'), 320);
  }, 4500);
}

async function toggleMusic() {
  musicStatus.textContent = '';
  if (!loveSong.paused) {
    loveSong.pause();
    return;
  }
  try {
    await loveSong.play();
  } catch {
    musicStatus.textContent = 'add your mp3 as song.mp3 in the site folder ♡';
  }
}

loveSong.addEventListener('play', () => {
  musicToggle.setAttribute('aria-pressed', 'true');
  musicToggle.innerHTML = 'music on <span aria-hidden="true">♫</span>';
});
loveSong.addEventListener('pause', () => {
  musicToggle.setAttribute('aria-pressed', 'false');
  musicToggle.innerHTML = 'music off <span aria-hidden="true">♫</span>';
});
musicToggle.addEventListener('click', toggleMusic);

function addParagraphs(container, paragraphs) {
  container.replaceChildren();
  for (const message of paragraphs) {
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    container.append(paragraph);
  }
}

const apologyMessage = MESSAGES.find((message) => message.type === 'apology');
const loveMessage = MESSAGES.find((message) => message.type === 'love');
const finalMessage = MESSAGES.find((message) => message.type === 'final');
const heartMessages = MESSAGES.filter((message) => message.type === 'heart');
addParagraphs(document.querySelector('#apology-copy'), apologyMessage.paragraphs);
addParagraphs(document.querySelector('#love-copy'), loveMessage.paragraphs);
document.querySelector('#final-title').textContent = finalMessage.text;

function makeHeart() {
  const heart = document.createElement('button');
  const size = 35 + Math.random() * 23;
  const top = 12 + Math.random() * 66;
  const left = 12 + Math.random() * 72;
  const colors = ['#f28eaa', '#f4a4b6', '#e77f9c', '#f6b4bf', '#d97d91'];
  heart.type = 'button';
  heart.className = 'heart-target';
  heart.setAttribute('aria-label', 'pop a heart');
  heart.innerHTML = '<span aria-hidden="true">♥</span>';
  heart.style.setProperty('--tap-size', `${Math.max(size + 27, 70)}px`);
  heart.style.setProperty('--heart-size', `${size}px`);
  heart.style.setProperty('--heart-color', colors[Math.floor(Math.random() * colors.length)]);
  heart.style.setProperty('--duration', `${3.2 + Math.random() * 2.6}s`);
  heart.style.setProperty('--delay', `${-Math.random() * 3}s`);
  heart.style.left = `${left}%`;
  heart.style.top = `${top}%`;
  heart.addEventListener('click', () => popHeart(heart));
  garden.append(heart);
}

function updateProgress() {
  counter.innerHTML = `${heartsCollected} of 8 <span aria-hidden="true">${heartsCollected === 8 ? '♥' : '♡'}</span>`;
  progressFill.style.width = `${(heartsCollected / 8) * 100}%`;
  progress.setAttribute('aria-valuenow', String(heartsCollected));
}

function popHeart(heart) {
  if (heart.classList.contains('popped') || heartsCollected >= 8) return;
  heart.classList.add('popped');
  heartsCollected += 1;
  updateProgress();

  notePop.textContent = heartMessages[(heartsCollected - 1) % heartMessages.length].text;
  notePop.classList.add('is-visible');
  window.clearTimeout(noteTimer);
  noteTimer = window.setTimeout(() => notePop.classList.remove('is-visible'), 2100);

  window.setTimeout(() => {
    heart.remove();
    if (heartsCollected < 8 && garden.childElementCount < 5) makeHeart();
  }, 240);

  if (heartsCollected === 8) {
    window.setTimeout(() => {
      notePop.classList.remove('is-visible');
      showLetterAfterScrollHint(apology, document.querySelector('#apology-toast'));
      revealConfetti();
      apologyScroll.scrollTop = 0;
      document.querySelector('#apology-next').classList.remove('is-ready');
    }, 650);
  }
}

function revealConfetti() {
  const layer = document.querySelector('#confetti');
  if (!layer) return;
  const colors = ['#f28eaa', '#eaa2ad', '#e7bd89', '#da788f', '#fff0e3'];
  layer.replaceChildren();
  for (let index = 0; index < 30; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-heart';
    piece.textContent = index % 3 === 0 ? '♡' : '♥';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--confetti-color', colors[index % colors.length]);
    piece.style.setProperty('--confetti-size', `${14 + Math.random() * 19}px`);
    piece.style.setProperty('--confetti-time', `${2.8 + Math.random() * 2}s`);
    piece.style.setProperty('--confetti-delay', `${Math.random() * .9}s`);
    piece.style.setProperty('--confetti-drift', `${-65 + Math.random() * 130}px`);
    piece.style.setProperty('--confetti-spin', `${-330 + Math.random() * 660}deg`);
    layer.append(piece);
  }
}

function checkRead(scrollElement, button) {
  const reachedEnd = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 24;
  if (reachedEnd) button.classList.add('is-ready');
}

apologyScroll.addEventListener('scroll', () => checkRead(apologyScroll, document.querySelector('#apology-next')));
loveScroll.addEventListener('scroll', () => checkRead(loveScroll, document.querySelector('#final-heart')));

document.querySelector('#open-heart').addEventListener('click', () => {
  if (loveSong.paused) toggleMusic();
  garden.replaceChildren();
  heartsCollected = 0;
  updateProgress();
  for (let index = 0; index < 6; index += 1) makeHeart();
  showScreen(game);
});

document.querySelector('#apology-next').addEventListener('click', () => {
  showLetterAfterScrollHint(loveLetter, document.querySelector('#love-toast'));
  loveScroll.scrollTop = 0;
  document.querySelector('#final-heart').classList.remove('is-ready');
  window.setTimeout(() => checkRead(loveScroll, document.querySelector('#final-heart')), 250);
});

document.querySelector('#final-heart').addEventListener('click', () => {
  showScreen(finalScreen);
  makeFinalHearts();
});

function makeFinalHearts() {
  const layer = document.querySelector('.final-screen');
  for (let index = 0; index < 14; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'final-float-heart';
    heart.textContent = index % 2 ? '♡' : '♥';
    heart.style.left = `${4 + Math.random() * 92}%`;
    heart.style.setProperty('--float-delay', `${Math.random() * 4}s`);
    heart.style.setProperty('--float-time', `${5 + Math.random() * 5}s`);
    heart.style.setProperty('--float-size', `${15 + Math.random() * 25}px`);
    layer.append(heart);
  }
}
