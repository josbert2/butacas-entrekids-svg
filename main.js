import './style.css';
var horizontalLabels = false; // false = vertical, true = horizontal
var orientationRowColumns = true; // false = vertical, true = horizontal


function createSVGElement(tagName, attributes) {
   const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
   for (const key in attributes) {
       element.setAttribute(key, attributes[key]);
   }
   return element;
}

function createSeat(x, y, width, height, color) {
   const seat = createSVGElement('rect', {
       x: x,
       y: y,
       width: width,
       height: height,
       fill: color,
   });
   return seat;
}

function deleteRow() {
    const selectedSeatInput = document.getElementById('selectedSeat');
    const seatId = selectedSeatInput.dataset.seatId;
    const [_, column, row] = seatId.split('-');

    const seatsContainer = document.getElementById('seatsContainer');
    const seatsInRow = seatsContainer.querySelectorAll(`rect[id$="-${row}"]`);

    if (seatsInRow.length === 0) {
        alert('Selecciona un asiento en la fila que quieres eliminar.');
        return;
    }

    seatsInRow.forEach(seat => {
        seat.remove();
        checkRow(row);
    });

    selectedSeatInput.value = '';
    selectedSeatInput.dataset.seatId = '';
    
    recalculateSeatIds();
}
function deleteSeat() {
    const selectedSeatInput = document.getElementById('selectedSeat');
    const seatId = selectedSeatInput.dataset.seatId;
    const seat = document.getElementById(seatId);

    if (!seat) {
        alert('Selecciona un asiento primero.');
        return;
    }

    const [_, column, row] = seatId.split('-');
    //const [_, row, column] = seatId.split('-');
    const columnLetter = column.replace(/[0-9]/g, '');
    const number = column.replace(/[A-Z]/g, '');

    console.log(number)


    seat.remove();
    selectedSeatInput.value = '';
    selectedSeatInput.dataset.seatId = '';

      // Verificar si la fila aún tiene asientos después de la eliminación.
    checkColumn(columnLetter);  // Verificar si la columna aún tiene asientos después de la eliminación.
    checkRow(number);  // Verificar si la fila aún tiene asientos después de la eliminación.
    //recalculateSeatIds();
}
function checkColumn(column) {
    const seatsContainer = document.getElementById('seatsContainer');
    const seatsInColumn = seatsContainer.querySelectorAll(`rect[id^="seat-${column}"]`);

    if (seatsInColumn.length === 0) {
        const columnLabel = document.getElementById(horizontalLabels ? `column-label-${column}` : `row-label-${column}`);
        if (columnLabel) {
            columnLabel.remove();
        }
    }
}

function checkRow(row) {
    const seatsContainer = document.getElementById('seatsContainer');
    const allSeats = Array.from(seatsContainer.querySelectorAll(`rect[id^="seat-"]`));
    const seatsInRow = allSeats.filter(seat => seat.id.endsWith(row));

    if (seatsInRow.length === 0) {
        const rowLabel = document.getElementById(horizontalLabels ? `row-label-${row}` : `column-label-${row}`);
        if (rowLabel) {
            rowLabel.remove();
        }
    }
}
function recalculateSeatIds() {
    const seatsContainer = document.getElementById('seatsContainer');
    const seats = Array.from(seatsContainer.getElementsByTagName('rect'));

    seats.forEach((seat, i) => {
        const row = Math.floor(i / 10) + 1;
        const column = String.fromCharCode((i % 10) + 65); // 65 es el código ASCII para 'A'
        const newSeatId = `seat-${column}${row}`;
        seat.setAttribute('id', newSeatId);
    });
}

















function addRow() {
    const seatsContainer = document.getElementById('seatsContainer');
    const svg = seatsContainer.querySelector('svg');
    const rows = svg.querySelectorAll(`text[id^="row-label"]`).length;
    const columns = svg.querySelectorAll(`text[id^="column-label"]`).length;
    const seatWidth = 20;
    const seatHeight = 20;
    const seatGap = 5;
    generateSeats(rows + 1, columns, seatWidth, seatHeight, seatGap, seatsContainer, orientationRowColumns);
}

function addColumn() {
    const seatsContainer = document.getElementById('seatsContainer');
    const svg = seatsContainer.querySelector('svg');
    const rows = svg.querySelectorAll(`text[id^="row-label"]`).length;
    const columns = svg.querySelectorAll(`text[id^="column-label"]`).length;
    const seatWidth = 20;
    const seatHeight = 20;
    const seatGap = 5;
    generateSeats(rows, columns + 1, seatWidth, seatHeight, seatGap, seatsContainer, orientationRowColumns);
}






// esta funcion hace la inversion de orientacion 
function generateSeats(rows, columns, seatWidth, seatHeight, seatGap, container, horizontalLabels = orientationRowColumns) {
    
    const margin = 50;
    
    const svgWidth = (columns + 1) * (seatWidth + seatGap) + seatGap + margin;
    const svgHeight = (rows + 1) * (seatHeight + seatGap) + seatGap + margin;

    

    const svg = createSVGElement('svg', {
        width: svgWidth,
        height: svgHeight,
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterLabels = horizontalLabels ? letters.slice(0, columns) : letters.slice(0, rows);
    const numberLabels = Array.from({length: columns}, (_, i) => i + 1);

    for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= columns; j++) {
            if (horizontalLabels ? (i === 0 && j > 0) : (j === 0 && i > 0)) {
                const text = createSVGElement('text', {
                    x: j * (seatWidth + seatGap) + seatGap + seatWidth / 2,
                    y: i * (seatHeight + seatGap) + seatGap + seatHeight / 2,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                    'font-size': '14px',
                });
                text.textContent = letterLabels[horizontalLabels ? (j - 1) : (i - 1)];
                text.setAttribute('id', `row-label-${letterLabels[horizontalLabels ? (j - 1) : (i - 1)]}`);
                svg.appendChild(text);
            } else if (horizontalLabels ? (j === 0 && i > 0) : (i === 0 && j > 0)) {
                const text = createSVGElement('text', {
                    x: j * (seatWidth + seatGap) + seatGap + seatWidth / 2,
                    y: i * (seatHeight + seatGap) + seatGap + seatHeight / 2,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                    'font-size': '14px',
                });
                text.textContent = numberLabels[horizontalLabels ? (i - 1) : (j - 1)];
                text.setAttribute('id', `column-label-${numberLabels[horizontalLabels ? (i - 1) : (j - 1)]}`);
                svg.appendChild(text);
            } else if (i > 0 && j > 0) {
                const x = j * (seatWidth + seatGap) + seatGap;
                const y = i * (seatHeight + seatGap) + seatGap;
                const seat = createSeat(x, y, seatWidth, seatHeight, 'blue');
                const seatId = `seat-${letterLabels[horizontalLabels ? (j - 1) : (i - 1)]}${numberLabels[horizontalLabels ? (i - 1) : (j - 1)]}`;
                seat.setAttribute('id', seatId);
                seat.addEventListener('click', seatClickHandler);
                svg.appendChild(seat);
            }
        }
    }

    // Agregar el botón "+" al final de cada fila
    for (let i = 1; i <= rows; i++) {
        const plus = createSVGElement('text', {
            x: (columns + 1) * (seatWidth + seatGap) + seatGap + seatWidth / 2,
            y: i * (seatHeight + seatGap) + seatGap + seatHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'middle',
            'font-size': '14px',
        });
        plus.textContent = '+';
        plus.setAttribute('id', `add-seat-row-${i}`);
        plus.addEventListener('click', () => addSeatToRow(i));
        svg.appendChild(plus);
    }
    
    // Añade botón "+" al final de cada columna
    for (let j = 1; j <= columns; j++) {
        const plus = createSVGElement('text', {
            x: j * (seatWidth + seatGap) + seatGap + seatWidth / 2,
            y: (rows + 1) * (seatHeight + seatGap) + seatGap + seatHeight / 2,
            'text-anchor': 'middle',
            'alignment-baseline': 'middle',
            'font-size': '14px',
        });
        plus.textContent = '+';
        plus.setAttribute('id', `add-seat-column-${j}`);
        plus.addEventListener('click', () => addSeatToColumn(j));
        svg.appendChild(plus);
    }

    container.appendChild(svg);
} 

function addSeatToRow(row) {
    const seatsContainer = document.getElementById('seatsContainer');
    const svg = seatsContainer.querySelector('svg');
    const seatWidth = 20;
    const seatHeight = 20;
    const seatGap = 5;

    // Calculate the existing number of columns
    const columns = svg.querySelectorAll(`rect[id^="seat-"]`).length / row;

    // Create a new seat
    const x = (columns + 1) * (seatWidth + seatGap) + seatGap;
    const y = row * (seatHeight + seatGap) + seatGap;
    const seat = createSeat(x, y, seatWidth, seatHeight, 'blue');
    const seatId = `seat-${String.fromCharCode(columns + 65)}${row}`; // 65 is ASCII for 'A'
    seat.setAttribute('id', seatId);

    // Add the new seat to SVG
    svg.appendChild(seat);

    // Update SVG size to accommodate the new seat
    svg.setAttribute('width', (columns + 2) * (seatWidth + seatGap) + seatGap);

    // Move the '+' to the new position
    const plus = svg.querySelector(`text[id="plus-row-${row}"]`);
    plus.setAttribute('x', (columns + 2) * (seatWidth + seatGap) + seatGap);

    // Shift down all rows below the new row
    for (let i = row + 1; i <= rows; i++) {
        svg.querySelectorAll(`rect[id^="seat-${String.fromCharCode(i + 64)}"]`).forEach(seat => {
            const y = parseInt(seat.getAttribute('y')) + seatHeight + seatGap;
            seat.setAttribute('y', y);
        });
        const plus = svg.querySelector(`text[id="plus-row-${i}"]`);
        plus.setAttribute('y', (i + 2) * (seatHeight + seatGap) + seatGap);
    }
}


function addSeatToColumn(column) {
    const seatsContainer = document.getElementById('seatsContainer');
    const svg = seatsContainer.querySelector('svg');
    const seatWidth = 20;
    const seatHeight = 20;
    const seatGap = 5;

    // Calculate the existing number of rows
    const rows = svg.querySelectorAll(`rect[id^="seat-"]`).length / column;

    // Create a new seat
    const x = column * (seatWidth + seatGap) + seatGap;
    const y = (rows + 1) * (seatHeight + seatGap) + seatGap;
    const seat = createSeat(x, y, seatWidth, seatHeight, 'blue');
    const seatId = `seat-${String.fromCharCode(column + 64)}${rows + 1}`; // 65 is ASCII for 'A'
    seat.setAttribute('id', seatId);

    // Add the new seat to SVG
    svg.appendChild(seat);

    // Update SVG size to accommodate the new seat
    svg.setAttribute('height', (rows + 2) * (seatHeight + seatGap) + seatGap);

    // Move the '+' to the new position
    const plus = svg.querySelector(`text[id="plus-col-${column}"]`);
    plus.setAttribute('y', (rows + 2) * (seatHeight + seatGap) + seatGap);

    // Shift right all columns after the new column
    for (let i = column + 1; i <= columns; i++) {
        svg.querySelectorAll(`rect[id^="seat-${String.fromCharCode(i + 64)}"]`).forEach(seat => {
            const x = parseInt(seat.getAttribute('x')) + seatWidth + seatGap;
            seat.setAttribute('x', x);
        });
        const plus = svg.querySelector(`text[id="plus-col-${i}"]`);
        plus.setAttribute('x', (i + 2) * (seatWidth + seatGap) + seatGap);
    }
}
/*function generateSeats(rows, columns, seatWidth, seatHeight, seatGap, container) {
    const svgWidth = (columns + 1) * (seatWidth + seatGap) + seatGap;
    const svgHeight = (rows + 1) * (seatHeight + seatGap) + seatGap;

    const svg = createSVGElement('svg', {
        width: svgWidth,
        height: svgHeight,
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterLabels = letters.slice(0, columns);
    const numberLabels = Array.from({length: rows}, (_, i) => i + 1);

    for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= columns; j++) {
            if (i === 0 && j > 0) {
                const text = createSVGElement('text', {
                    x: j * (seatWidth + seatGap) + seatGap + seatWidth / 2,
                    y: seatHeight,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                    'font-size': '14px',
                });
                text.textContent = letterLabels[j - 1];
                text.setAttribute('id', `column-label-${letterLabels[j - 1]}`);
                svg.appendChild(text);
            } else if (j === 0 && i > 0) {
                const text = createSVGElement('text', {
                    x: seatWidth / 2,
                    y: i * (seatHeight + seatGap) + seatGap + seatHeight / 2,
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle',
                    'font-size': '14px',
                });
                text.textContent = numberLabels[i - 1];
                text.setAttribute('id', `row-label-${numberLabels[i - 1]}`);
                svg.appendChild(text);
            } else if (i > 0 && j > 0) {
                const x = j * (seatWidth + seatGap) + seatGap;
                const y = i * (seatHeight + seatGap) + seatGap;
                const seat = createSeat(x, y, seatWidth, seatHeight, 'blue');
                const seatId = `seat-${letterLabels[j - 1]}${numberLabels[i - 1]}`;
                seat.setAttribute('id', seatId);
                seat.addEventListener('click', seatClickHandler);
                svg.appendChild(seat);
            }
        }
    }

    container.appendChild(svg);
} */
function seatClickHandler(e) {
   const seat = e.target;
   const input = document.getElementById('selectedSeat');
   input.value = seat.id;
   input.dataset.seatId = seat.id;
}

function applyCustomAttribute() {
   const selectedSeatInput = document.getElementById('selectedSeat');
   const customAttributeInput = document.getElementById('customAttribute');
   const customAttributeValueInput = document.getElementById('customAttributeValue');
   const seatId = selectedSeatInput.dataset.seatId;

   if (!seatId) {
       alert('Selecciona un asiento primero.');
       return;
   }

   const seat = document.getElementById(seatId);
   const customAttribute = customAttributeInput.value.trim();
   const customAttributeValue = customAttributeValueInput.value.trim();

   if (customAttribute && customAttributeValue) {
       seat.setAttribute(`data-${customAttribute}`, customAttributeValue);
   } else {
       alert('Por favor, completa el nombre y el valor del atributo.');
   }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const seatsContainer = document.getElementById('seatsContainer');
    const applyAttributeButton = document.getElementById('applyAttribute');
    const deleteSeatButton = document.getElementById('deleteSeat');
    //const deleteRowButton = document.getElementById('deleteRow');

    const addRowButton = document.getElementById('addRow');
    const addColumnButton = document.getElementById('addColumn');


    generateSeats(2,21, 20, 20, 5, seatsContainer);
    applyAttributeButton.addEventListener('click', applyCustomAttribute);
    deleteSeatButton.addEventListener('click', deleteSeat);
    addRowButton.addEventListener('click', addRow);
    addColumnButton.addEventListener('click', addColumn);
    //deleteRowButton.addEventListener('click', deleteRow);
});