import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchShipments() {
  const shipmentsCol = collection(db, 'shipments');
  const shipmentSnapshot = await getDocs(shipmentsCol);
  const shipments = shipmentSnapshot.docs.map(doc => doc.data());

  const statusCounts = {
    "تم التسليم": 0,
    "قيد التوصيل": 0,
    "في المخزن": 0,
    "إنتظار الشحن": 0,
    "لم يتم التسليم": 0,
    "إرتجاع": 0
  };

  shipments.forEach(shipment => {
    statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
  });

  displayChart(statusCounts);
}

function displayChart(statusCounts) {
  const ctx = document.getElementById('shipmentChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'عدد الشحنات',
        data: Object.values(statusCounts),
        backgroundColor: ['#4caf50', '#f44336', '#ffeb3b', '#2196f3', '#ff9800', '#9c27b0']
      }]
    },
    options: {
      responsive: true
    }
  });
}

fetchShipments();
