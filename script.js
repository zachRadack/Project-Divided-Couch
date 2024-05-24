document.getElementById('inputColumns').addEventListener('input', buildQuery);

function buildQuery() {
    const input = document.getElementById('inputColumns').value;
    const outputArea = document.getElementById('outputArea');
    const columns = input.split(',').map(col => col.trim()).filter(col => col);

    if (columns.length === 0) {
        outputArea.textContent = '';
        return;
    }

    const tables = {
        "PER_ALL_PEOPLE_F": ["PERSON_ID", "PRIMARY_NID_NUMBER"],
        "PER_PERSON_NAMES_F": ["PERSON_ID", "LAST_NAME", "FIRST_NAME"],
        "PER_NUDGES": ["PERSON_ID", "NUDGE_ID", "NUDGE_TYPE_CODE"],
        "PER_people": ["NUDGE_ID", "NUDGE_TYPE_CODE","columnB"],
    };

    let selectedTables = new Set();
    let columnMap = {};

    columns.forEach(col => {
        for (let table in tables) {
            if (tables[table].includes(col)) {
                selectedTables.add(table);
                columnMap[col] = table;
            }
        }
    });

    selectedTables = Array.from(selectedTables);

    if (selectedTables.length < 2) {
        outputArea.textContent = 'Not enough columns to form a join.';
        return;
    }

    const query = `
        SELECT 
        ${columns.map(col => `${columnMap[col]}.${col}`).join(',\n')}
        FROM
        ${selectedTables.map((table, index) => `${table} t${index + 1}`).join(',\n')}
        WHERE
        ${selectedTables.map((table, index) => {
            if (index === selectedTables.length - 1) return '';
            return `t${index + 1}.PERSON_ID = t${index + 2}.PERSON_ID`;
        }).filter(Boolean).join('\nAND\n')}
    `;

    outputArea.textContent = query.trim();
}
