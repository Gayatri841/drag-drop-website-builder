const draggables = document.querySelectorAll('.draggable');
const canvas = document.getElementById('canvas');
const form = document.getElementById('properties-form');

let selectedElement = null;

// DRAG START
draggables.forEach(elem => {
  elem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('type', e.target.getAttribute('data-type'));
  });
});

// DROP HANDLER
canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  let newElem;

  if (type === 'text') {
    newElem = document.createElement('p');
    newElem.textContent = 'Editable text';
  } else if (type === 'image') {
    newElem = document.createElement('img');
    newElem.src = 'https://via.placeholder.com/100';
    newElem.style.width = '100px';
  } else if (type === 'button') {
    newElem = document.createElement('button');
    newElem.textContent = 'Click Me';
  }

  newElem.style.margin = '10px';
  newElem.setAttribute('contenteditable', 'true');
  newElem.addEventListener('click', () => {
    selectedElement = newElem;
    populateForm(newElem);
  });

  canvas.appendChild(newElem);
});

// FILL FORM FIELDS ON SELECT
function populateForm(elem) {
  if (elem.tagName === 'IMG') {
    form['edit-img-url'].value = elem.src;
    form['edit-text'].value = '';
  } else {
    form['edit-text'].value = elem.textContent;
    form['edit-img-url'].value = '';
  }

  form['edit-font-size'].value = parseInt(window.getComputedStyle(elem).fontSize);
  form['edit-color'].value = rgbToHex(window.getComputedStyle(elem).color);
}

// APPLY FORM CHANGES
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!selectedElement) return;

  const text = form['edit-text'].value;
  const fontSize = form['edit-font-size'].value;
  const color = form['edit-color'].value;
  const imgUrl = form['edit-img-url'].value;

  if (selectedElement.tagName !== 'IMG') {
    selectedElement.textContent = text;
  } else {
    selectedElement.src = imgUrl;
  }

  selectedElement.style.fontSize = fontSize + 'px';
  selectedElement.style.color = color;
});

// HELPER: Convert RGB to HEX
function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}