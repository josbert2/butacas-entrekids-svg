import './style.css';

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

function generateSeats(rows, columns, seatWidth, seatHeight, seatGap, container) {
   const svgWidth = columns * (seatWidth + seatGap) + seatGap;
   const svgHeight = rows * (seatHeight + seatGap) + seatGap;

   const svg = createSVGElement('svg', {
       width: svgWidth,
       height: svgHeight,
   });

   for (let i = 0; i < rows; i++) {
       for (let j = 0; j < columns; j++) {
           const x = j * (seatWidth + seatGap) + seatGap;
           const y = i * (seatHeight + seatGap) + seatGap;
           const seat = createSeat(x, y, seatWidth, seatHeight, 'blue');
           const seatId = `seat-${i + 1}-${j + 1}`;
            seat.setAttribute('id', seatId);
            seat.addEventListener('click', seatClickHandler);
            svg.appendChild(seat);

       }
   }

   container.appendChild(svg);
}

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

   generateSeats(5, 10, 20, 20, 5, seatsContainer);
   applyAttributeButton.addEventListener('click', applyCustomAttribute);
});