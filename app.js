document.addEventListener("DOMContentLoaded", function () {
    populateClasses();
    showStudentsList();
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('portalSection').style.display = 'block';
    } else {
        alert('Invalid credentials, please try again.');
    }
}

function showAddStudentForm() {
    document.getElementById('addStudentPopup').style.display = 'block';
}

function showAddClassForm() {
    document.getElementById('addClassPopup').style.display = 'block';
}

function addStudent() {
    const newStudentName = document.getElementById('newStudentName').value;
    const newStudentRoll = document.getElementById('newStudentRoll').value;

    if (!newStudentName || !newStudentRoll) {
        alert("Please provide both name and roll number.");
        return;
    }

    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.options[classSelector.selectedIndex].value;
    const studentsList = document.getElementById('studentsList');

    const listItem = document.createElement('li');
    listItem.setAttribute('data-roll-number', newStudentRoll);
    listItem.innerHTML = `<strong>${newStudentName}</strong> (Roll No. ${newStudentRoll})`;

    const absentButton = createButton('A', 'absent', () => markAttendance('absent', listItem, selectedClass));
    const presentButton = createButton('P', 'present', () => markAttendance('present', listItem, selectedClass));
    const leaveButton = createButton('L', 'leave', () => markAttendance('leave', listItem, selectedClass));

    listItem.appendChild(absentButton);
    listItem.appendChild(presentButton);
    listItem.appendChild(leaveButton);

    studentsList.appendChild(listItem);
    saveStudentsList(selectedClass);
    closePopup();
}

function addClass() {
    const newClassName = document.getElementById('newClassName').value;

    if (!newClassName) {
        alert("Please provide a class name.");
        return;
    }

    const classSelector = document.getElementById('classSelector');
    const option = document.createElement('option');
    option.value = newClassName;
    option.text = newClassName;

    classSelector.add(option);
    saveClasses();
    closePopup();
}

function showStudentsList() {
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.options[classSelector.selectedIndex].value;
    const studentsList = document.getElementById('studentsList');

    studentsList.innerHTML = '';
    const students = getStudentsList(selectedClass);

    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-roll-number', student.rollNumber);
        listItem.innerHTML = `<strong>${student.name}</strong> (Roll No. ${student.rollNumber})`;

        const absentButton = createButton('A', 'absent', () => markAttendance('absent', listItem, selectedClass));
        const presentButton = createButton('P', 'present', () => markAttendance('present', listItem, selectedClass));
        const leaveButton = createButton('L', 'leave', () => markAttendance('leave', listItem, selectedClass));

        listItem.appendChild(absentButton);
        listItem.appendChild(presentButton);
        listItem.appendChild(leaveButton);

        studentsList.appendChild(listItem);
    });
    updateSummary();
}

function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    return button;
}

function markAttendance(status, listItem, selectedClass) {
    const rollNumber = listItem.getAttribute('data-roll-number');
    const students = getStudentsList(selectedClass);
    const student = students.find(student => student.rollNumber === rollNumber);

    if (student) {
        student.attendanceStatus = status;
    }

    saveStudentsList(selectedClass);
    updateSummary();
}

function updateSummary() {
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.options[classSelector.selectedIndex].value;
    const students = getStudentsList(selectedClass);

    const totalStudents = students.length;
    const totalPresent = students.filter(student => student.attendanceStatus === 'present').length;
    const totalAbsent = students.filter(student => student.attendanceStatus === 'absent').length;
    const totalLeave = students.filter(student => student.attendanceStatus === 'leave').length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalPresent').textContent = totalPresent;
    document.getElementById('totalAbsent').textContent = totalAbsent;
    document.getElementById('totalLeave').textContent = totalLeave;
}

function submitAttendance() {
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.options[classSelector.selectedIndex].value;
    const students = getStudentsList(selectedClass);

    const totalStudents = students.length;
    const totalPresent = students.filter(student => student.attendanceStatus === 'present').length;
    const totalAbsent = students.filter(student => student.attendanceStatus === 'absent').length;
    const totalLeave = students.filter(student => student.attendanceStatus === 'leave').length;

    const date = new Date();
    const attendanceDate = date.toLocaleDateString();
    const attendanceTime = date.toLocaleTimeString();

    document.getElementById('attendanceDate').textContent = attendanceDate;
    document.getElementById('attendanceTime').textContent = attendanceTime;
    document.getElementById('attendanceClass').textContent = selectedClass;
    document.getElementById('attendanceTotalStudents').textContent = totalStudents;
    document.getElementById('attendancePresent').textContent = totalPresent;
    document.getElementById('attendanceAbsent').textContent = totalAbsent;
    document.getElementById('attendanceLeave').textContent = totalLeave;

    document.getElementById('resultSection').style.display = 'block';
}

function closePopup() {
    document.getElementById('addStudentPopup').style.display = 'none';
    document.getElementById('addClassPopup').style.display = 'none';
}

function saveClasses() {
    const classSelector = document.getElementById('classSelector');
    const classes = Array.from(classSelector.options).map(option => option.value);
    localStorage.setItem('classes', JSON.stringify(classes));
}

function populateClasses() {
    const classSelector = document.getElementById('classSelector');
    const classes = JSON.parse(localStorage.getItem('classes')) || [];

    classes.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.text = className;
        classSelector.add(option);
    });
}

function saveStudentsList(className) {
    const students = Array.from(document.getElementById('studentsList').children).map(listItem => {
        return {
            name: listItem.querySelector('strong').textContent.split(' (')[0],
            rollNumber: listItem.getAttribute('data-roll-number'),
            attendanceStatus: listItem.querySelector('.absent').disabled ? 'absent' : 
                              listItem.querySelector('.present').disabled ? 'present' : 'leave'
        };
    });

    localStorage.setItem(`students_${className}`, JSON.stringify(students));
}

function getStudentsList(className) {
    return JSON.parse(localStorage.getItem(`students_${className}`)) || [];
}

function searchData() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const classSelector = document.getElementById('classSelector');
    const classes = Array.from(classSelector.options).map(option => option.value);

    // Search for matching classes
    const matchingClasses = classes.filter(className => className.toLowerCase().includes(searchInput));

    // Display matching classes and their students
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    matchingClasses.forEach(className => {
        const students = getStudentsList(className);

        students.forEach(student => {
            if (student.name.toLowerCase().includes(searchInput) || className.toLowerCase().includes(searchInput)) {
                const listItem = document.createElement('li');
                listItem.setAttribute('data-roll-number', student.rollNumber);
                listItem.innerHTML = `<strong>${student.name}</strong> (Roll No. ${student.rollNumber})`;

                const absentButton = createButton('A', 'absent', () => markAttendance('absent', listItem, className));
                const presentButton = createButton('P', 'present', () => markAttendance('present', listItem, className));
                const leaveButton = createButton('L', 'leave', () => markAttendance('leave', listItem, className));

                listItem.appendChild(absentButton);
                listItem.appendChild(presentButton);
                listItem.appendChild(leaveButton);

                studentsList.appendChild(listItem);
            }
        });
    });

    updateSummary();
}
