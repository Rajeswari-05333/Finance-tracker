let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") || 0;

const list = document.getElementById("expenseList");

// Set Budget
function setBudget() {
  budget = document.getElementById("budgetInput").value;
  localStorage.setItem("budget", budget);
  updateSummary();
}

// Add Expense
function addExpense() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!title || !amount) return alert("Fill all fields");

  const expense = {
    id: Date.now(),
    title,
    amount: Number(amount),
    category,
    date
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayExpenses();
}

// Display
function displayExpenses(data = expenses) {
  list.innerHTML = "";

  data.forEach(e => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${e.title} - ₹${e.amount} (${e.category})
      <div>
        <button onclick="deleteExpense(${e.id})">❌</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateSummary();
  renderChart();
}

// Delete
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
}

// Summary
function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  document.getElementById("spent").innerText = total;
  document.getElementById("budget").innerText = budget;
  document.getElementById("remaining").innerText = budget - total;
}

// Search
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  const filtered = expenses.filter(e =>
    e.title.toLowerCase().includes(value) ||
    e.category.toLowerCase().includes(value)
  );

  displayExpenses(filtered);
});

// Chart
let chart;

function renderChart() {
  const categories = {};

  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories)
      }]
    }
  });
}

// Export CSV
function exportCSV() {
  let csv = "Title,Amount,Category,Date\n";

  expenses.forEach(e => {
    csv += `${e.title},${e.amount},${e.category},${e.date}\n`;
  });

  const blob = new Blob([csv]);
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
}

// Dark Mode
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

// Init
displayExpenses();