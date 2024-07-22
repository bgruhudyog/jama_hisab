document.addEventListener("DOMContentLoaded", function () {
  const route = localStorage.getItem("dropdown");
  const shopName = localStorage.getItem("shop_name");
  const quantity = localStorage.getItem("quantity");
  const rate = localStorage.getItem("rate");
  const total = localStorage.getItem("total");
  const cash = localStorage.getItem("cash");
  const old = localStorage.getItem("old");
  const date = localStorage.getItem("date");

  const numberTotal = parseFloat(localStorage.getItem("total")) || 0;

  document.getElementById("confirm-shop_name").textContent = shopName;
  document.getElementById("confirm-quantity").textContent = quantity;
  document.getElementById("confirm-rate").textContent = rate;
  document.getElementById("confirm-total").textContent = total;
  document.getElementById("confirm-cash").textContent = cash;
  document.getElementById("confirm-old").textContent = old;

  // Calculate remaining amount
  const totalAmount = parseFloat(total);
  const cashAmount = parseFloat(cash);
  const remaining = totalAmount - cashAmount;

  document.getElementById("confirm-remaining").textContent = remaining.toFixed(2);

  document.getElementById("edit").addEventListener("click", function () {
    window.history.back();
  });

  if (numberTotal === 0) {
    document.getElementById("hide").style.display = "none";
  }

  document.getElementById("confirm").addEventListener("click", function () {
    const scriptURL = "https://script.google.com/macros/s/AKfycbw7r8EkmflipZKr6BS2ZqpiPEPQqVswPF3s6Uk78Jb_2fcw3Fsz7k8jQjudXBCnPuDzdA/exec";
    const formData = new FormData();

    formData.append("दिनांक ", date); // Add today's date to form data
    formData.append("रूट ", route);
    formData.append("दुकान का नाम", shopName);
    formData.append("मात्रा ", quantity);
    formData.append("रेट ", rate);
    formData.append("कुल ", total);
    formData.append("नगदी ", cash);
    formData.append("आज के बाक़ी", remaining.toFixed(2));
    formData.append("पुराने जमा ", old);

    // Start the timer
    startTimer();

    // Send data to Google Sheets
    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => {
        if (response.ok) {
          // Send data to Telegram
          const telegramToken = "7438673598:AAEScuKPGsJAGn5fFiXavF_2vH-fNfSBQVg";
          const chatId = "-1002230132257"; // Replace with your chat ID
          const telegramURL = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

          let message = "";

          if (numberTotal === 0) {
            message = `
दिनांक: ${date}\n
रूट: ${route}\n
दुकान का नाम: ${shopName}\n
पुराने जमा: ₹${old}
            `;
          } else {
            message = `
दिनांक: ${date}\n
रूट: ${route}\n
दुकान का नाम: ${shopName}\n
मात्रा: ${quantity} Kg\n
रेट: ₹${rate}\n
कुल: ₹${total}\n
नगदी: ₹${cash}\n
आज के बाक़ी: ₹${remaining.toFixed(2)}\n
पुराने जमा: ₹${old}
            `;
          }

          fetch(telegramURL, {
            method: "POST",
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "HTML",
            }),
            headers: { "Content-Type": "application/json" },
          })
            .then((telegramResponse) => {
              if (telegramResponse.ok) {
                const notification = document.getElementById("notification");
                notification.style.display = "block"; // Show the notification
                stopTimer(); // Stop the timer
                setTimeout(() => {
                  window.location.href = "index.html"; // Redirect after 3 seconds
                }, 3000); // 3000 milliseconds = 3 seconds
              } else {
                throw new Error("Telegram API response was not ok.");
              }
            })
            .catch((error) => console.error("Error!", error.message));
        } else {
          throw new Error("Google Sheets API response was not ok.");
        }
      })
      .catch((error) => console.error("Error!", error.message));
  });

  function startTimer() {
    const timerElement = document.getElementById("timer");
    timerElement.style.display = "block";
    let startTime = Date.now();

    timerInterval = setInterval(() => {
      let elapsedTime = Date.now() - startTime;
      let seconds = Math.floor((elapsedTime / 1000) % 60);
      let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      let formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      timerElement.textContent = formattedTime;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById("timer");
    timerElement.style.display = "none";
  }
});
