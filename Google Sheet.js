

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('jama-form');
  const cashInput = document.getElementById('cash');
  const quantityInput = document.getElementById('quantity');
  const rateInput = document.getElementById('rate');
  const totalDisplay = document.getElementById('total');
  const remainingDisplay = document.getElementById('remaining');
  const dateDayDisplay = document.getElementById('date-day');
  const dropdown = document.getElementById('dropdown');

  function updateTotal() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const total = quantity * rate;
    totalDisplay.textContent = `कुल मूल्य: ${total.toFixed(2)}`;
    updateRemaining();
  }

  function updateRemaining() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const total = quantity * rate;
    const cash = parseFloat(cashInput.value) || 0;
    const remaining = total - cash;
    remainingDisplay.textContent = `आज के बाक़ी: ${remaining.toFixed(2)}`;
  }

  function getDayInHindi(day) {
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    return days[day];
  }

  function displayDateAndDay() {
    const today = new Date();
    const day = today.getDay();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dayInHindi = getDayInHindi(day);
    dateDayDisplay.textContent = ` ${date}-${month}-${year},  ${dayInHindi}`;
    return `${date}-${month}-${year}`;
  }

  function setDropdownValue() {
    const savedDropdownValue = localStorage.getItem('dropdown');
    const savedDate = localStorage.getItem('submission_date');
    const today = new Date();
    const currentDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    if (savedDropdownValue && savedDate === currentDate) {
      dropdown.value = savedDropdownValue;
    } else {
      dropdown.value = '';
      localStorage.removeItem('dropdown');
      localStorage.removeItem('submission_date');
    }
  }

  function clearIfZero(event) {
    if (event.target.value === '0') {
      event.target.value = '';
    }
  }

  function restoreIfEmpty(event) {
    if (event.target.value === '') {
      event.target.value = '0';
    }
  }

  quantityInput.addEventListener('input', updateTotal);
  rateInput.addEventListener('input', updateTotal);
  cashInput.addEventListener('input', updateRemaining);

  quantityInput.addEventListener('focus', clearIfZero);
  quantityInput.addEventListener('blur', restoreIfEmpty);
  cashInput.addEventListener('focus', clearIfZero);
  cashInput.addEventListener('blur', restoreIfEmpty);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const shopName = document.getElementById('shop_name').value.trim();
    const quantity = quantityInput.value.trim() || "0";
    const rate = rateInput.value.trim();
    const cash = cashInput.value.trim() || "0";
    const old = document.getElementById('old').value.trim();
    const today = new Date();
    const currentDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    if (!dropdown.value) {
      alert('कृपया रूट चुने:');
      return;
    }

    if (!shopName) {
      alert('कृपया दुकान का नाम भरें');
      return;
    }

    localStorage.setItem('dropdown', dropdown.value);
    localStorage.setItem('submission_date', currentDate);
    localStorage.setItem('shop_name', shopName);
    localStorage.setItem('quantity', quantity);
    localStorage.setItem('rate', rate);
    localStorage.setItem('total', (parseFloat(quantity) * parseFloat(rate)).toFixed(2));
    localStorage.setItem('cash', cash);
    localStorage.setItem('old', old);
    localStorage.setItem('date', currentDate);

    window.location.href = 'confirmation.html';
  });

  displayDateAndDay();
  setDropdownValue();
});
