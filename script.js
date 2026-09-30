const storage = {
  read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn(`NEXORA could not read "${key}" from local storage.`, error);
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`NEXORA could not save "${key}" to local storage.`, error);
      showToast('Your browser could not save this change. It will last for this visit.');
    }
  }
};

const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

function closeMenu() {
  primaryNav?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  primaryNav?.classList.toggle('is-open', isOpen);
});

document.querySelectorAll('.nav-link, .primary-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('is-active', item === link));
  });
});

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = storage.read('nexora-theme', 'dark');

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.classList.toggle('theme-light', isLight);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f5f4f9' : '#08090f');
  themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  const icon = themeToggle?.querySelector('svg');
  if (icon) {
    icon.innerHTML = isLight
      ? '<path d="M20.2 15.6A8.3 8.3 0 0 1 8.4 3.8 8.5 8.5 0 1 0 20.2 15.6Z"/>'
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
  }
}

applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.classList.contains('theme-light') ? 'dark' : 'light';
  applyTheme(nextTheme);
  storage.write('nexora-theme', nextTheme);
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const counters = document.querySelectorAll('.counter');
if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      if (!Number.isFinite(target)) {
        observer.unobserve(counter);
        return;
      }
      const duration = 1100;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        counter.textContent = `${Math.round(target * eased)}${counter.dataset.suffix || ''}`;
        if (progress < 1) window.requestAnimationFrame(animate);
      };
      window.requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.5 });
  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = `${counter.dataset.target || 0}${counter.dataset.suffix || ''}`;
  });
}

const todayLabel = document.querySelector('#today-label');
if (todayLabel) {
  todayLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()).toUpperCase();
}

const taskList = document.querySelector('#task-list');
const taskSummary = document.querySelector('#task-summary');
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskDefaults = [
  { id: 'task-review-notes', text: 'Review notes from yesterday', completed: true },
  { id: 'task-design-module', text: 'Finish design systems module', completed: false },
  { id: 'task-break', text: 'Take an actual screen break', completed: false },
  { id: 'task-build', text: 'Ship one small thing', completed: false }
];
let tasks = storage.read('nexora-tasks', null);
if (!Array.isArray(tasks) || !tasks.every((task) => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.completed === 'boolean')) {
  tasks = taskDefaults;
}

function renderTasks() {
  if (!taskList || !taskSummary) return;
  taskList.replaceChildren();
  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' is-complete' : ''}`;
    item.dataset.taskId = task.id;

    const check = document.createElement('button');
    check.type = 'button';
    check.className = 'task-check';
    check.setAttribute('aria-label', task.completed ? `Mark "${task.text}" incomplete` : `Complete "${task.text}"`);
    check.setAttribute('aria-pressed', String(task.completed));
    check.textContent = task.completed ? '✓' : '';

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'task-delete';
    remove.setAttribute('aria-label', `Delete "${task.text}"`);
    remove.textContent = '×';

    item.append(check, text, remove);
    taskList.append(item);
  });
  const completedCount = tasks.filter((task) => task.completed).length;
  taskSummary.textContent = `${completedCount} of ${tasks.length} done`;
}

function saveTasks() {
  storage.write('nexora-tasks', tasks);
  renderTasks();
}

renderTasks();

taskForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput?.value.trim();
  if (!text) {
    taskInput?.focus();
    return;
  }
  tasks.unshift({ id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, completed: false });
  saveTasks();
  taskForm.reset();
  taskInput?.focus();
  showToast('One small step, added to your day.');
});

taskList?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const item = target.closest('.task-item');
  if (!item) return;
  const task = tasks.find((entry) => entry.id === item.dataset.taskId);
  if (!task) return;

  if (target.closest('.task-check')) {
    task.completed = !task.completed;
    saveTasks();
    return;
  }
  if (target.closest('.task-delete')) {
    tasks = tasks.filter((entry) => entry.id !== task.id);
    saveTasks();
    showToast('Task removed. Make space for what matters.');
  }
});

const skillButtons = document.querySelectorAll('.skill-row');
const projectCards = document.querySelectorAll('.project-card');
const filterNote = document.querySelector('.filter-note');
const resetFilter = document.querySelector('.reset-filter');
let activeSkill = '';

function filterProjects(skill) {
  activeSkill = skill;
  projectCards.forEach((card) => {
    const skills = (card.dataset.skills || '').split(/\s+/);
    card.classList.toggle('is-filtered-out', Boolean(skill) && !skills.includes(skill));
  });
  skillButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.skill === skill)));
  if (filterNote) filterNote.textContent = skill ? `Projects using ${skill.toLowerCase()}` : 'Showing all projects';
  if (resetFilter) resetFilter.hidden = !skill;
}

skillButtons.forEach((button) => button.addEventListener('click', () => {
  const skill = button.dataset.skill || '';
  filterProjects(activeSkill === skill ? '' : skill);
}));
resetFilter?.addEventListener('click', () => filterProjects(''));

const projectDialog = document.querySelector('#project-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCategory = document.querySelector('#dialog-category');
const dialogDescription = document.querySelector('#dialog-description');

document.querySelector('.projects-grid')?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const likeButton = target.closest('.project-like');
  if (likeButton) {
    const isSaved = likeButton.getAttribute('aria-pressed') !== 'true';
    likeButton.setAttribute('aria-pressed', String(isSaved));
    showToast(isSaved ? 'Project saved to your inspiration board.' : 'Project removed from your saved list.');
    return;
  }

  const projectButton = target.closest('.project-open');
  if (!projectButton || !projectDialog || !dialogTitle || !dialogCategory || !dialogDescription) return;
  const card = projectButton.closest('.project-card');
  if (!card) return;
  dialogTitle.textContent = card.dataset.title || 'Project details';
  dialogCategory.textContent = card.dataset.category || 'NEXORA PROJECT';
  dialogDescription.textContent = card.dataset.description || '';
  if (typeof projectDialog.showModal === 'function') {
    projectDialog.showModal();
  } else {
    projectDialog.setAttribute('open', '');
  }
});

document.querySelector('.dialog-close')?.addEventListener('click', () => projectDialog?.close());
projectDialog?.addEventListener('click', (event) => {
  if (event.target === projectDialog) projectDialog.close();
});
document.querySelector('#dialog-contact')?.addEventListener('click', () => projectDialog?.close());

const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');

const replies = [
  { matches: ['focus', 'distract', 'concentrat'], answer: 'Try a tiny reset: choose one task, set a 20-minute timer, and make your phone boring for a bit. What would feel good to finish first?' },
  { matches: ['plan', 'schedule', 'organize', 'time'], answer: 'Let’s keep it kind to your future self. Pick one must-do, one nice-to-do, then give yourself a real break. What’s the one thing that matters most today?' },
  { matches: ['stuck', 'start', 'overwhelm', 'huge'], answer: 'Big things get friendlier when they get smaller. Write down the first action that takes less than 10 minutes — no perfect plan required. What’s your first tiny step?' },
  { matches: ['explain', 'concept', 'learn', 'understand'], answer: 'Happy to unpack it! Start with the part that feels fuzzy, and we’ll work through it one idea at a time. What concept are you exploring?' },
  { matches: ['tired', 'break', 'burnout', 'rest'], answer: 'Rest counts as progress, too. Try stepping away for a few minutes — a stretch, some water, or just looking out a window. You can come back when you’re ready.' }
];

function makeMessage(text, sender, pending = false) {
  const wrapper = document.createElement('div');
  wrapper.className = `message message-${sender}${pending ? ' is-pending' : ''}`;
  if (sender === 'ai') {
    const avatar = document.createElement('span');
    avatar.className = 'message-avatar';
    avatar.textContent = '✳';
    wrapper.append(avatar);
  }
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  wrapper.append(paragraph);
  return wrapper;
}

function getReply(message) {
  const normalized = message.toLowerCase();
  const match = replies.find((entry) => entry.matches.some((keyword) => normalized.includes(keyword)));
  if (match) return match.answer;
  return 'That’s a good thing to explore. Try turning it into one question or one small next step, and we’ll start there. What feels like the most useful place to begin?';
}

function sendMessage(message) {
  if (!chatMessages || !message.trim()) return;
  chatMessages.append(makeMessage(message.trim(), 'user'));
  const pendingMessage = makeMessage('Thinking this through with you', 'ai', true);
  chatMessages.append(pendingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  window.setTimeout(() => {
    pendingMessage.replaceWith(makeMessage(getReply(message), 'ai'));
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 850);
}

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput?.value.trim();
  if (!message) {
    chatInput?.focus();
    return;
  }
  sendMessage(message);
  chatForm.reset();
  chatInput?.focus();
});

document.querySelectorAll('.chat-suggestion').forEach((button) => {
  button.addEventListener('click', () => {
    const prompt = button.textContent?.includes('focus')
      ? 'Help me focus on one thing today'
      : 'Can you help me understand a concept?';
    sendMessage(prompt);
  });
});

const navSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const navLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (navLink) {
        document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('is-active', link === navLink));
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  navSections.forEach((section) => navObserver.observe(section));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 680) closeMenu();
});
