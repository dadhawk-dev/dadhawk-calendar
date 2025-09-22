class CustomCalendar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.template = document.createElement('template');
        this.template.innerHTML = `
                <style>
                    :host {
                        --dh-scale:100;
                        font-size: calc(var(--dh-scale)/100*1rem);
                        width:  25em;
                        display: inline-block;
                        font-family: Arial, sans-serif;
                    }
                    .input-row {
                        display: grid;
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                        align-items: center;
                        gap: 0.3rem;
                        margin-bottom: 1em;
                    }
                    .input-row input{
                        min-width: 0; 
                        padding: 0.4rem;
                        border: 0.15em solid #ccc;
                        border-radius: 0.5em;
                        font-size: 1.4em;
                        text-align: center;
                    }
                    .input-row button {
                        min-width: 0;                        
                    }
                    .calendar {
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        padding: 1em;
                        position: relative;
                        transition: all 0.3s ease;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1em;
                    }
                    .month-year-container {
                        display: flex;
                        align-items: center;
                        gap: 0.5em;
                        font-weight: bold;
                    }
                    select {
                        font-weight: bold;
                        font-size: 1.2em;
                        color:#594c4c;
                    }
                    .nav-button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0 0.5em;
                        transition: transform 0.2s;
                    }
                    .nav-button:hover {
                        transform: scale(1.1);
                    }
                    .days-grid {
                        display: grid;
                        grid-template-columns: repeat(7, 1fr);
                        gap: 0.25em;
                        text-align: center;
                    }
                    .day-name {
                        font-weight: bold;
                        font-size: 0.8em;
                        text-transform: uppercase;
                        color: #666;
                        margin-bottom: 0.25em;
                    }
                    .day {
                        font-size: 0.9em;
                        border-radius: 0.3em;
                        transition: background 0.2s;
                        flex: 1 1 auto;
                        padding: 0.5em;
                    }
                    .day:hover {
                        cursor: pointer;
                    }
                    .selected {
                        background: #2196F3 !important;
                        color: white !important;
                        border-radius: 50%;
                        margin: 0 auto;
                        width: 2em;
                        height: 2em;                        
                        line-height: 2em;
                        font-size: 1em;
                    }
                    .today {
                        background: #4CAF50;
                        color: white !important;
                        border-radius: 50%;
                        margin: 0 auto;
                        width: 2em;
                        height: 2em;                        
                        line-height: 2em;
                        font-size: 1em;
                    }
                    .today-button {
                        padding: 0.8em 0 0.8em 0;
                        border: none;
                        border-radius: 8px;
                        background: #4CAF50;
                        color: white;
                        font-weight: bold;
                        font-size: 1em;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .today-button:hover {
                        background: #45a049;
                        transform: translateY(-1px);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                    /* Themes */
                    .calendar.light {
                        background: white;
                        color: #333;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .calendar.dark {
                        background: #1a1a1a;
                        color: #f0f0f0;
                        box-shadow: 0 2px 1em rgba(0,0,0,0.5);
                    }
                    .calendar.dark .today,
                    .calendar.dark .selected {
                        color: #1a1a1a;
                        background: #00ffcc;
                    }
                    .calendar.modern {
                        background: linear-gradient(145deg, #ffffff, #f0f0f0);
                        color: #2c3e50;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                        border-radius: 12px;
                    }
                    .calendar.retro {
                        background: #fff3cd;
                        color: #5a3e1b;
                        border: 2px solid #d9b583;
                        font-family: 'Courier New', Courier, monospace;
                    }
                </style>

                <div class="calendar light">
                    <!-- Date input + Time selects + Set button -->
                    <div class="input-row">
                         <input type="text" class="date-input" placeholder="dd.MM.yyyy" />
                         <input type="text" class="hour-select"/>
                         <input type="text" class="minute-select"/>
                         <button class="today-button">
                           <span role="img" aria-hidden="true">Today</span>
                         </button>
                      </div>
                    <!-- Calendar Header -->
                    <div class="header">
                        <button class="nav-button prev">&#9664;</button>
                        <div class="month-year-container">
                            <select class="month-select"></select>
                            <select class="year-select"></select>
                        </div>
                        <button class="nav-button next">&#9654;</button>
                    </div>
                    <!-- Days Grid -->
                    <div class="days-grid"></div>
                </div>
            `;
        this.shadow.appendChild(this.template.content.cloneNode(true));

        // Initialize state
        this.currentDate = new Date();
        this.today = new Date();
        this.selectedDate = null;
        this.noTime = this.hasAttribute('no-time');

        // Cache DOM elements
        this.calendarContainer = this.shadow.querySelector('.calendar');
        this.dateInput = this.shadow.querySelector('.date-input');
        this.hourSelect = this.shadow.querySelector('.hour-select');
        this.minuteSelect = this.shadow.querySelector('.minute-select');
        this.monthSelect = this.shadow.querySelector('.month-select');
        this.yearSelect = this.shadow.querySelector('.year-select');
        this.daysGrid = this.shadow.querySelector('.days-grid');
        this.prevBtn = this.shadow.querySelector('.prev');
        this.nextBtn = this.shadow.querySelector('.next');
        this.todayButton = this.shadow.querySelector('.today-button');
    }

    static get observedAttributes() {
        return ['theme', 'no-time', 'selected-date'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'theme') {
            this.applyTheme(newValue || 'light');
        } else if (name === 'no-time') {
            this.noTime = this.hasAttribute('no-time');
            const elements = this.shadow.querySelectorAll('.hour-select, .minute-select');
            elements.forEach(el => el.style.display = this.noTime ? 'none' : '');
            this.render();
        } else if (name === 'selected-date') {
            const parsedDate = new Date(newValue);
            if (!isNaN(parsedDate.getTime())) {
                this.selectedDate = parsedDate;
                this.currentDate = new Date(parsedDate);
            }
            this.render();
        }
    }

    focusOnInput() {
        this.dateInput.focus();
        this.dateInput.select();
    }

    connectedCallback() {
        this.applyTheme(this.getAttribute('theme') || 'light');
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Format input while typing

        this.dateInput.addEventListener('input', () => {
            let value = this.dateInput.value.replace(/\D/g, '');
            let formatted = '';
            if (value.length > 0) {
                formatted = value.slice(0, 2);
                if (value.length > 2) {
                    formatted += '.' + value.slice(2, 4);
                    if (value.length > 4) {
                        formatted += '.' + value.slice(4, 8);
                    }
                }
            }
            this.dateInput.value = formatted;
        });

        const isValidDate = (day, month, year) => {
            const date = new Date(year, month - 1, day);
            return (
                    date.getDate() === parseInt(day) &&
                    date.getMonth() === parseInt(month) - 1 &&
                    date.getFullYear() === parseInt(year)
                    );
        };

        const handleInputUpdate = () => {
            const val = this.dateInput.value;
            const parts = val.split('.');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                if (
                        !isNaN(day) && !isNaN(month) && !isNaN(year) &&
                        day >= 1 && day <= 31 &&
                        month >= 1 && month <= 12 &&
                        year >= 1900 && year <= 2050 &&
                        isValidDate(day, month, year)
                        ) {
                    this.currentDate = new Date(year, month - 1, 1);
                    this.selectedDate = new Date(year, month - 1, day);
                    this.render();
                    this.dispatchSelectionEvent();
                } else {
                    this.updateInputFromDate(this.selectedDate); // Revert
                }
            }
        };

        this.dateInput.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) { // <Enter>
                handleInputUpdate();
            } else if (e.keyCode === 27) { // <Esc>
                this.dispatchCancelEvent();
            }
        });
        this.hourSelect.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) { // <Enter>
                handleInputUpdate();
            } else if (e.keyCode === 27) { // <Esc>
                this.dispatchCancelEvent();
            }
        });
        this.minuteSelect.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) { // <Enter>
                handleInputUpdate();
            } else if (e.keyCode === 27) { // <Esc>
                this.dispatchCancelEvent();
            }
        });
        // Navigation
        this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextBtn.addEventListener('click', () => this.changeMonth(1));

        this.yearSelect.addEventListener('change', () => {
            const year = parseInt(this.yearSelect.value);
            const month = parseInt(this.monthSelect.value);
            this.currentDate.setFullYear(year, month);
            this.render();
        });

        this.monthSelect.addEventListener('change', () => {
            const month = parseInt(this.monthSelect.value);
            const year = parseInt(this.yearSelect.value);
            this.currentDate.setFullYear(year, month);
            this.render();
        });

        // Day selection
        this.daysGrid.addEventListener('click', (e) => {
            const dayEl = e.target.closest('.day');
            if (!dayEl || !dayEl.textContent.trim())
                return;

            const day = parseInt(dayEl.textContent);
            const month = this.currentDate.getMonth();
            const year = this.currentDate.getFullYear();

            this.daysGrid.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            const dayNum = dayEl.querySelector('div');
            if (dayNum)
                dayNum.classList.add('selected');

            this.selectedDate = new Date(year, month, day);

            if (!this.noTime) {
                this.selectedDate.setHours(parseInt(this.hourSelect.value) || 0);
                this.selectedDate.setMinutes(parseInt(this.minuteSelect.value) || 0);
                this.populateTime();
            }

            this.updateInputFromDate(this.selectedDate);
            this.dispatchSelectionEvent();
        });

        // Today button
        this.todayButton.addEventListener('click', () => {
            if (this.isSameDay(this.currentDate, this.today)) {
                if (!this.selectedDate || !this.isSameDay(this.selectedDate, this.today)) {
                    this.daysGrid.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                    const todayElement = this.daysGrid.querySelector('.today');
                    if (todayElement) {
                        todayElement.classList.add('selected');
                        this.selectedDate = new Date(this.today);
                        if (!this.noTime) {
                            this.selectedDate.setHours(new Date().getHours());
                            this.selectedDate.setMinutes(new Date().getMinutes());
                            this.populateTime();
                        }
                        this.updateInputFromDate(this.selectedDate);
                        this.dispatchSelectionEvent();
                    }
                }
                return;
            }
            this.currentDate = new Date();
            this.today = new Date();
            this.selectedDate = new Date();
            if (!this.noTime) {
                this.selectedDate.setHours(new Date().getHours());
                this.selectedDate.setMinutes(new Date().getMinutes());
            }
            this.updateInputFromDate(this.selectedDate);
            this.render();
        });

        // Time selects
        if (!this.noTime) {
            this.hourSelect.addEventListener('change', () => {
                const hour = parseInt(this.hourSelect.value);
                if (this.selectedDate) {
                    this.selectedDate.setHours(hour);
                }
            });
            this.minuteSelect.addEventListener('change', () => {
                const minute = parseInt(this.minuteSelect.value);
                if (this.selectedDate) {
                    this.selectedDate.setMinutes(minute);
                }
            });
        }
    }

    dispatchSelectionEvent() {
        if (this.selectedDate) {
            this.dispatchEvent(new CustomEvent('date-selected', {
                detail: {
                    date: this.selectedDate,
                    formatted: this.formatDate(this.selectedDate),
                    hour: this.noTime ? undefined : this.selectedDate.getHours(),
                    minute: this.noTime ? undefined : this.selectedDate.getMinutes(),
                    timeFormatted: this.noTime ? undefined : this.formatTime(this.selectedDate)
                },
                bubbles: true,
                composed: true
            }));
        }
    }

    dispatchCancelEvent() {
        this.dispatchEvent(new CustomEvent('date-cancel', {
            detail: {

            },
            bubbles: true,
            composed: true
        }));
    }

    isValidDate(day, month, year) {
        const date = new Date(year, month - 1, day);
        return (
                date.getDate() === day &&
                date.getMonth() === month - 1 &&
                date.getFullYear() === year
                );
    }

    updateInputFromDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed
        const year = date.getFullYear();
        this.dateInput.value = `${day}.${month}.${year}`;
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();
    }

    populateTime() {
        this.hourSelect.innerHTML = '';
        for (let i = 0; i < 24; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            if (this.selectedDate && i === this.selectedDate.getHours()) {
                option.selected = true;
            }
            this.hourSelect.appendChild(option);
        }

        this.minuteSelect.innerHTML = '';
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString().padStart(2, '0');
            if (this.selectedDate && i === this.selectedDate.getMinutes()) {
                option.selected = true;
            }
            this.minuteSelect.appendChild(option);
        }
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.render();
    }

    applyTheme(theme) {
        const themes = ['light', 'dark', 'modern', 'retro'];
        themes.forEach(cls => this.calendarContainer.classList.remove(cls));
        if (themes.includes(theme)) {
            this.calendarContainer.classList.add(theme);
        } else {
            this.calendarContainer.classList.add('light');
        }
    }

    render() {
        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        this.updateInputFromDate(this.currentDate);

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        this.monthSelect.innerHTML = '';
        monthNames.forEach((name, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = name;
            if (index === month)
                option.selected = true;
            this.monthSelect.appendChild(option);
        });

        const startYear = year - 10;
        const endYear = year + 10;
        this.yearSelect.innerHTML = '';
        for (let y = startYear; y <= endYear; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            if (y === year)
                option.selected = true;
            this.yearSelect.appendChild(option);
        }

        this.daysGrid.innerHTML = '';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        //const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        dayNames.forEach(day => {
            const div = document.createElement('div');
            div.className = 'day day-name';
            div.textContent = day;
            this.daysGrid.appendChild(div);
        });

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            this.daysGrid.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            const dayNum = document.createElement('div');
            dayNum.textContent = i;

            if (
                    i === this.today.getDate() &&
                    month === this.today.getMonth() &&
                    year === this.today.getFullYear()
                    ) {
                dayNum.className = 'today';
            }

            if (this.selectedDate &&
                    i === this.selectedDate.getDate() &&
                    month === this.selectedDate.getMonth() &&
                    year === this.selectedDate.getFullYear()) {
                dayNum.classList.add('selected');
            }

            dayDiv.appendChild(dayNum);
            this.daysGrid.appendChild(dayDiv);
        }

        if (!this.noTime)
            this.populateTime();
    }
}

customElements.define('custom-calendar', CustomCalendar);


