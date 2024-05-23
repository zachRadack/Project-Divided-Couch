const tables = {
    "PER_ALL_PEOPLE_F": ["PERSON_ID", "PRIMARY_NID_NUMBER"],
    "PER_PERSON_NAMES_F": ["PERSON_ID", "LAST_NAME", "FIRST_NAME"],
    "PER_NUDGES": ["PERSON_ID", "NUDGE_ID", "NUDGE_TYPE_CODE"],
};

function findTable(column) {
    for (const table in tables) {
        if (tables[table].includes(column)) {
            return table;
        }
    }
    return null;
}

document.getElementById('inputArea').addEventListener('input', function () {
    const input = this.value.trim();
    const outputArea = document.getElementById('outputArea');

    if (input === "") {
        outputArea.textContent = "";
        return;
    }

    const columns = input.split(',').map(col => col.trim());
    if (columns.length < 2) {
        outputArea.textContent = "Please enter at least two columns.";
        return;
    }

    let tablesUsed = {};
    let selectStatements = [];
    let whereStatements = new Set();

    columns.forEach(column => {
        const table = findTable(column);
        if (table) {
            if (!tablesUsed[table]) {
                tablesUsed[table] = [];
            }
            tablesUsed[table].push(column);
        } else {
            outputArea.textContent = `Column "${column}" not found in any table.`;
            return;
        }
    });

    let tableAliases = Object.keys(tablesUsed).map((table, index) => ({
        table,
        alias: `t${index + 1}`
    }));

    tableAliases.forEach(({ table, alias }) => {
        selectStatements.push(...tablesUsed[table].map(col => `${alias}.${col}`));
    });

    for (let i = 0; i < tableAliases.length - 1; i++) {
        whereStatements.add(`${tableAliases[i].alias}.PERSON_ID = ${tableAliases[i + 1].alias}.PERSON_ID`);
    }

    const sqlQuery = `
select 
${selectStatements.join(',\n')}
from
${tableAliases.map(({ table, alias }) => `${table} ${alias}`).join(',\n')}
where
${[...whereStatements].join('\nand\n')}`;

    outputArea.textContent = sqlQuery;
});
