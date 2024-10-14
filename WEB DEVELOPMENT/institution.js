
// Sorting function
function sortTable(columnIndex) {
    const table = document.getElementById("fixturesTable");
    const rows = Array.from(table.rows).slice(1);
    const sortedRows = rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].innerText;
        const cellB = b.cells[columnIndex].innerText;
        return cellA.localeCompare(cellB);
    });
    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
}

// Filtering function
document.getElementById("searchInput").addEventListener("keyup", function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#fixturesTable tbody tr");
    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const match = cells.some(cell => cell.innerText.toLowerCase().includes(filter));
        row.style.display = match ? "" : "none";
    });
});

// Row highlighting
const rows = document.querySelectorAll("#fixturesTable tbody tr");
rows.forEach(row => {
    row.addEventListener("mouseover", () => row.classList.add("highlight"));
    row.addEventListener("mouseout", () => row.classList.remove("highlight"));
});

// Function to delete a row
function deleteRow(event) {
    const row = event.target.closest('tr');
    row.remove();
}

// Function to edit a row
function editRow(event) {
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.querySelector('button')) return; // Skip the cell with buttons
        const input = document.createElement('input');
        input.type = 'text';
        input.value = cell.innerText;
        cell.innerText = '';
        cell.appendChild(input);
    });

    // Change the Edit button to Save
    const editButton = row.querySelector('.edit-btn');
    editButton.innerText = 'Save';
    editButton.removeEventListener('click', editRow);
    editButton.addEventListener('click', saveRow);
}

// Function to save a row
function saveRow(event) {
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.querySelector('button')) return; // Skip the cell with buttons
        const input = cell.querySelector('input');
        cell.innerText = input.value;
    });

    // Change the Save button back to Edit
    const saveButton = row.querySelector('.edit-btn');
    saveButton.innerText = 'Edit';
    saveButton.removeEventListener('click', saveRow);
    saveButton.addEventListener('click', editRow);
}

// Attach event listeners to delete and edit buttons
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', deleteRow);
});

document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', editRow);
});

// Function to add a new row to the Manage Teams table
function addTeam(event) {
    event.preventDefault(); // Prevent form submission

    const teamName = document.getElementById('teamName').value;
    const sportDiscipline = document.getElementById('sportDiscipline').value;
    const coachName = document.getElementById('coachName').value;

    const table = document.getElementById('teamsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const teamNameCell = newRow.insertCell(0);
    const sportDisciplineCell = newRow.insertCell(1);
    const coachNameCell = newRow.insertCell(2);
    const actionsCell = newRow.insertCell(3);

    teamNameCell.innerText = teamName;
    sportDisciplineCell.innerText = sportDiscipline;
    coachNameCell.innerText = coachName;

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', editRow);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', deleteRow);

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Clear the form
    document.getElementById('registerTeamForm').reset();
}

// Attach event listener to the register team form
document.getElementById('registerTeamForm').addEventListener('submit', addTeam);

// Function to add a new row to the fixtures table
async function addFixtureRow() {
    const response = await fetch('fixtures.json');
    const fixtures = await response.json();

    // Get the first fixture from the JSON file (or implement logic to get a specific fixture)
    const fixture = fixtures[0];

    const table = document.getElementById('fixturesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const dateCell = newRow.insertCell(0);
    const opponentCell = newRow.insertCell(1);
    const sportCell = newRow.insertCell(2);
    const venueCell = newRow.insertCell(3);
    const timeCell = newRow.insertCell(4);

    dateCell.innerText = fixture.date;
    opponentCell.innerText = fixture.opponent;
    sportCell.innerText = fixture.sport;
    venueCell.innerText = fixture.venue;
    timeCell.innerText = fixture.time;

    // Add event listeners for highlighting
    newRow.addEventListener("mouseover", () => newRow.classList.add("highlight"));
    newRow.addEventListener("mouseout", () => newRow.classList.remove("highlight"));
}

// Attach event listener to the add row button
document.getElementById('addRowButton').addEventListener('click', addFixtureRow);

// Function to fetch registered teams
function getRegisteredTeams() {
    const rows = document.querySelectorAll("#teamsTable tbody tr");
    const teams = [];
    rows.forEach(row => {
        const teamName = row.cells[0].innerText;
        teams.push(teamName);
    });
    return teams;
}

// Function to fetch past matches
function getPastMatches() {
    const rows = document.querySelectorAll("#results tbody tr");
    const matches = [];
    rows.forEach(row => {
        const team = row.cells[1].innerText;
        const opponent = row.cells[2].innerText;
        matches.push({ team, opponent });
    });
    return matches;
}

// Function to check if a match already exists
function matchExists(matches, team1, team2) {
    return matches.some(match => 
        (match.team === team1 && match.opponent === team2) || 
        (match.team === team2 && match.opponent === team1)
    );
}

// Function to generate random fixtures
function generateRandomFixtures() {
    const teams = getRegisteredTeams();
    const pastMatches = getPastMatches();
    const venues = ["Main Stadium", "Secondary Stadium", "Community Center"];
    const times = ["14:00", "16:30", "18:00", "20:00"];
    const fixtures = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            if (!matchExists(pastMatches, teams[i], teams[j])) {
                const date = new Date();
                date.setDate(date.getDate() + Math.floor(Math.random() * 30)); // Random date within the next 30 days
                const venue = venues[Math.floor(Math.random() * venues.length)];
                const time = times[Math.floor(Math.random() * times.length)];
                fixtures.push({
                    date: date.toISOString().split('T')[0],
                    opponent: teams[j],
                    sport: "Football", // Assuming sport is football for simplicity
                    venue: venue,
                    time: time
                });
            }
        }
    }
    return fixtures;
}

// Function to add a new row to the fixtures table
function addFixtureRow(fixture) {
    const table = document.getElementById('fixturesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const dateCell = newRow.insertCell(0);
    const opponentCell = newRow.insertCell(1);
    const sportCell = newRow.insertCell(2);
    const venueCell = newRow.insertCell(3);
    const timeCell = newRow.insertCell(4);

    dateCell.innerText = fixture.date;
    opponentCell.innerText = fixture.opponent;
    sportCell.innerText = fixture.sport;
    venueCell.innerText = fixture.venue;
    timeCell.innerText = fixture.time;

    // Add event listeners for highlighting
    newRow.addEventListener("mouseover", () => newRow.classList.add("highlight"));
    newRow.addEventListener("mouseout", () => newRow.classList.remove("highlight"));
}

// Function to seed fixtures
function seedFixtures() {
    const fixtures = generateRandomFixtures();
    fixtures.forEach(fixture => addFixtureRow(fixture));
}

// Attach event listener to the add row button
document.getElementById('addRowButton').addEventListener('click', seedFixtures);