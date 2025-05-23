// Elements
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const tabs = document.querySelectorAll('.tab');
const dropdown = document.getElementById('dropdown-settings');
const settingsBtn = document.getElementById('settings-btn');
const aboutBtn = document.getElementById('about-btn');

const pomodoroInput = document.getElementById('pomodoro-input');
const shortInput = document.getElementById('short-input');
const longInput = document.getElementById('long-input');
const applySettingsBtn = document.getElementById('apply-settings');

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Timer vars
let mode = 'pomodoro'; // pomodoro, short, long
let durations = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};
let timer = durations[mode];
let interval = null;
let isRunning = false;

function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function switchMode(newMode) {
  mode = newMode;
  timer = durations[mode];
  updateTimerDisplay(timer);
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  pauseTimer();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  interval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateTimerDisplay(timer);
    } else {
      clearInterval(interval);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      // Auto switch to short break and play sound
      if (mode === 'pomodoro') {
        switchMode('short');
        playBell();
        startTimer();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(interval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  timer = durations[mode];
  updateTimerDisplay(timer);
}

function playBell() {
  const bell = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  bell.play();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchMode(tab.dataset.mode);
  });
});

// Settings dropdown toggle
settingsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (dropdown.style.display === 'flex') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'flex';
  }
});

// Apply settings
applySettingsBtn.addEventListener('click', () => {
  let p = parseInt(pomodoroInput.value);
  let s = parseInt(shortInput.value);
  let l = parseInt(longInput.value);
  if (p > 0 && s > 0 && l > 0) {
    durations.pomodoro = p * 60;
    durations.short = s * 60;
    durations.long = l * 60;
    switchMode(mode);
    dropdown.style.display = 'none';
  } else {
    alert('Please enter valid positive numbers.');
  }
});

// About scroll to footer
aboutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('footer-section').scrollIntoView({ behavior: 'smooth' });
});

// Task Manager
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const span = document.createElement('span');
    span.textContent = taskText;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      taskList.removeChild(taskDiv);
    });

    taskDiv.appendChild(span);
    taskDiv.appendChild(removeBtn);

    taskList.appendChild(taskDiv);
    taskInput.value = '';
  }
});

// Initialize
updateTimerDisplay(timer);
