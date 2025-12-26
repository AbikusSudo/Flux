// app.js - Основной JavaScript для Flux документации

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Flux Documentation loaded');
    
    // Инициализация компонентов
    initTheme();
    initNavigation();
    initFAQ();
    initSearch();
    initCodeBlocks();
    initScrollSpy();
    initSubscriptions();
    
    // Установка текущей даты
    setCurrentDate();
    
    // Добавление прогресс-бара
    addProgressBar();
});

// Управление темой
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('flux-theme') || 'light';
    
    // Установка начальной темы
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️ Светлая тема';
    }
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            
            localStorage.setItem('flux-theme', isDark ? 'dark' : 'light');
            this.textContent = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
            
            // Отправка события для обновления компонентов
            document.dispatchEvent(new CustomEvent('themeChange', {
                detail: { theme: isDark ? 'dark' : 'light' }
            }));
        });
    }
}

// Навигация
function initNavigation() {
    // Подсветка активной ссылки
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Добавление номеров страниц
    const pageOrder = {
        'index.html': 1,
        'overview.html': 2,
        'installation.html': 3,
        'technical.html': 4,
        'faq.html': 5,
        'development.html': 6,
        'guide.html': 7,
        'subs.html': 8,
        'donate.html': 9
    };
    
    const currentPageNum = pageOrder[currentPage];
    if (currentPageNum) {
        const pageInfo = document.querySelector('.page-info');
        if (pageInfo) {
            const pageNames = {
                'index.html': 'Главная',
                'overview.html': 'Обзор',
                'installation.html': 'Установка',
                'technical.html': 'Техническая',
                'faq.html': 'FAQ',
                'development.html': 'Разработка',
                'guide.html': 'Гайд',
                'subs.html': 'Подписки'
            };
            pageInfo.innerHTML = `Страница ${currentPageNum} из 8<br><small>${pageNames[currentPage]}</small>`;
        }
    }
    
    // Клавиатурная навигация
    document.addEventListener('keydown', function(e) {
        // Alt + стрелки для навигации
        if (e.altKey) {
            switch(e.key) {
                case 'ArrowLeft':
                    navigateTo('prev');
                    break;
                case 'ArrowRight':
                    navigateTo('next');
                    break;
                case 'h':
                    window.location.href = 'index.html';
                    break;
                case 'm':
                    window.location.href = 'donate.html';
                    break;
                case 's':
                    document.getElementById('searchInput')?.focus();
                    break;
                case 'p':
                    if (window.location.pathname.includes('subs.html')) {
                        break;
                    }
                    break;
            }
        }
    });
}

// Навигация между страницами
function navigateTo(direction) {
    const pages = [
        'index.html',
        'overview.html',
        'installation.html',
        'technical.html',
        'faq.html',
        'development.html',
        'guide.html',
        'subs.html',
        'donate.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    const currentIndex = pages.indexOf(currentPage);
    
    if (currentIndex === -1) return;
    
    let targetIndex;
    if (direction === 'prev' && currentIndex > 0) {
        targetIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < pages.length - 1) {
        targetIndex = currentIndex + 1;
    } else {
        return;
    }
    
    window.location.href = pages[targetIndex];
}

// FAQ система
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            item.classList.toggle('active');
            
            // Закрытие других FAQ
            if (item.classList.contains('active')) {
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Кнопки управления FAQ
    document.getElementById('expandAllFAQ')?.addEventListener('click', function() {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.add('active');
        });
    });
    
    document.getElementById('collapseAllFAQ')?.addEventListener('click', function() {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
    });
}

// Поиск по странице
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // Показать всё если поиск пустой
            document.querySelectorAll('.searchable').forEach(el => {
                el.style.display = '';
            });
            document.querySelectorAll('.subscription-item').forEach(el => {
                el.style.display = '';
            });
            return;
        }
        
        // Поиск по элементам с классом searchable
        document.querySelectorAll('.searchable').forEach(el => {
            const text = el.textContent.toLowerCase();
            el.style.display = text.includes(searchTerm) ? '' : 'none';
        });
        
        // Поиск по подпискам
        document.querySelectorAll('.subscription-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Подсветка кода
function initCodeBlocks() {
    document.querySelectorAll('pre code').forEach(block => {
        // Простая подсветка ключевых слов
        const code = block.textContent;
        const highlighted = highlightCode(code);
        block.innerHTML = highlighted;
        
        // Добавление кнопки копирования
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-small btn-secondary';
        copyBtn.textContent = '📋 Копировать';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '10px';
        copyBtn.style.right = '10px';
        copyBtn.style.fontSize = '0.8rem';
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        block.parentNode.parentNode.insertBefore(wrapper, block.parentNode);
        wrapper.appendChild(block.parentNode);
        wrapper.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(code).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Скопировано!';
                copyBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove('btn-success');
                }, 2000);
            });
        });
    });
}

// Простая подсветка синтаксиса
function highlightCode(code) {
    const patterns = {
        keyword: /\b(function|return|const|let|var|if|else|for|while|class|import|from|export|default)\b/g,
        string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
        comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
        number: /\b\d+(\.\d+)?\b/g
    };
    
    let highlighted = code;
    
    highlighted = highlighted.replace(patterns.keyword, '<span class="code-keyword">$&</span>');
    highlighted = highlighted.replace(patterns.string, '<span class="code-string">$&</span>');
    highlighted = highlighted.replace(patterns.comment, '<span class="code-comment">$&</span>');
    highlighted = highlighted.replace(patterns.number, '<span class="code-number">$&</span>');
    
    return highlighted;
}

// Инициализация подписок
function initSubscriptions() {
    // Кнопки фильтрации
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            
            // Убрать активный класс со всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Добавить активный класс текущей кнопке
            this.classList.add('active');
            
            // Показать/скрыть подписки
            document.querySelectorAll('.subscription-item').forEach(item => {
                if (type === 'all') {
                    item.style.display = '';
                } else {
                    const itemType = item.dataset.type;
                    item.style.display = itemType === type ? '' : 'none';
                }
            });
        });
    });
    
    // Кнопки копирования
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const url = this.dataset.url;
            navigator.clipboard.writeText(url).then(() => {
                const originalText = this.textContent;
                this.textContent = '✅ Скопировано!';
                this.style.background = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            });
        });
    });
    
    // Поиск в подписках
    const subsSearch = document.getElementById('subsSearch');
    if (subsSearch) {
        subsSearch.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            
            document.querySelectorAll('.subscription-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
}

// Копирование всех подписок
function copyAllSubscriptions() {
    let allText = '';
    
    document.querySelectorAll('.subscription-url code').forEach(code => {
        allText += code.textContent + '\n';
    });
    
    navigator.clipboard.writeText(allText).then(() => {
        showNotification('Все подписки скопированы в буфер обмена!', 'success');
    });
}

// Слежение за скроллом
function initScrollSpy() {
    const headings = document.querySelectorAll('h2, h3');
    const toc = document.getElementById('tableOfContents');
    
    if (!toc || headings.length === 0) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (!id) return;
                
                const link = toc.querySelector(`a[href="#${id}"]`);
                if (link) {
                    if (entry.isIntersecting) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        },
        { rootMargin: '-20% 0px -70% 0px' }
    );
    
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = heading.textContent
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-');
        }
        observer.observe(heading);
    });
}

// Установка текущей даты
function setCurrentDate() {
    const dateElements = document.querySelectorAll('.current-date');
    if (dateElements.length > 0) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const formattedDate = now.toLocaleDateString('ru-RU', options);
        
        dateElements.forEach(el => {
            el.textContent = formattedDate;
        });
    }
}

// Добавление прогресс-бара чтения
function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    const contentStart = document.querySelector('h1');
    if (contentStart) {
        contentStart.parentNode.insertBefore(progressBar, contentStart);
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
}

function updateProgressBar() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const trackLength = docHeight - winHeight;
    const progress = (scrollTop / trackLength) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} fade-in`;
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">×</button>
        </div>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(notification, container.firstChild);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Генерация ссылок для гайда
window.generateTurboLink = function() {
    const url = document.getElementById('vpnUrl').value;
    if (!url || !url.startsWith('http')) {
        showNotification('Введите корректный URL', 'warning');
        return;
    }
    
    const encoded = encodeURIComponent(url);
    const turboLink = `https://translate.yandex.ru/?source_lang=en&target_lang=en&text=${encoded}`;
    
    document.getElementById('generatedLink').value = turboLink;
    document.getElementById('linkResult').style.display = 'block';
};

window.copyGeneratedLink = function() {
    const link = document.getElementById('generatedLink').value;
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Ссылка скопирована в буфер обмена!', 'success');
    });
};

// Глобальные утилиты
window.FluxUtils = {
    navigateTo,
    showNotification,
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text);
    },
    toggleTheme: function() {
        document.getElementById('themeToggle')?.click();
    },
    copyAllSubscriptions
};

// Инициализация пагинации
function initPagination() {
    const itemsPerPage = 10;
    const subscriptionItems = document.querySelectorAll('.subscription-item');
    const totalPages = Math.ceil(subscriptionItems.length / itemsPerPage);
    
    if (totalPages <= 1) return;
    
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => showPage(i, subscriptionItems, itemsPerPage));
        paginationContainer.appendChild(button);
    }
    
    const container = document.querySelector('.subscriptions-container');
    if (container) {
        container.appendChild(paginationContainer);
    }
    
    // Показать первую страницу
    showPage(1, subscriptionItems, itemsPerPage);
}

function showPage(pageNumber, items, itemsPerPage) {
    const start = (pageNumber - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    items.forEach((item, index) => {
        item.style.display = (index >= start && index < end) ? '' : 'none';
    });
    
    // Обновить активную кнопку пагинации
    document.querySelectorAll('.pagination button').forEach((btn, index) => {
        btn.classList.toggle('active', index === pageNumber - 1);
    });
}