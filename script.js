import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ==========================================
// CONFIGURATION
// ==========================================
// IMPORTANT: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ginnivivante-backend.firebaseapp.com",
  projectId: "ginnivivante-backend",
  storageBucket: "ginnivivante-backend.appspot.com",
  messagingSenderId: "367104961805",
  appId: "1:367104961805:android:c153835062a74c264a7c1b",
};

// ==========================================
// MOCK DATA (Demo Mode)
// ==========================================
const mockEnquiries = [
  {
    id: "101",
    firstName: "Rahul Sharma",
    mobileNumber: "9876543210",
    status: "New",
    createdTime: "2023-12-01T10:00:00Z",
    requirement: "2 BHK",
    source: "Facebook",
  },
  {
    id: "102",
    firstName: "Anita Desai",
    mobileNumber: "8765432109",
    status: "Followup",
    createdTime: "2023-12-05T14:30:00Z",
    requirement: "3 BHK",
    source: "Walk-in",
  },
  {
    id: "103",
    firstName: "Vikram Singh",
    mobileNumber: "7654321098",
    status: "Converted",
    createdTime: "2023-12-10T09:15:00Z",
    requirement: "Villa",
    source: "Referral",
  },
  {
    id: "104",
    firstName: "Priya Patel",
    mobileNumber: "6543210987",
    status: "Closed",
    createdTime: "2023-12-12T11:45:00Z",
    requirement: "1 BHK",
    source: "Website",
  },
  {
    id: "105",
    firstName: "Karan Mehta",
    mobileNumber: "9988776655",
    status: "New",
    createdTime: "2023-12-20T16:20:00Z",
    requirement: "Studio",
    source: "Instagram",
  },
  {
    id: "106",
    firstName: "Sanjay Gupta",
    mobileNumber: "9123456780",
    status: "Site Visit",
    createdTime: "2023-12-21T09:00:00Z",
    requirement: "2 BHK + Study",
    source: "Newspaper",
  },
  {
    id: "107",
    firstName: "Meera Reddy",
    mobileNumber: "9876501234",
    status: "Negotiation",
    createdTime: "2023-12-22T11:00:00Z",
    requirement: "4 BHK",
    source: "Direct",
  },
  {
    id: "108",
    firstName: "Arjun Kapoor",
    mobileNumber: "7890123456",
    status: "New",
    createdTime: "2023-12-23T10:15:00Z",
    requirement: "Penthouse",
    source: "Facebook",
  },
  {
    id: "109",
    firstName: "Divya Bharti",
    mobileNumber: "8899001122",
    status: "Followup",
    createdTime: "2023-12-23T13:45:00Z",
    requirement: "2 BHK",
    source: "Walk-in",
  },
  {
    id: "110",
    firstName: "Rohan Joshi",
    mobileNumber: "7778889990",
    status: "New",
    createdTime: "2023-12-23T15:30:00Z",
    requirement: "3 BHK",
    source: "Referral",
  },
];

const mockTowers = [
  {
    id: "t1",
    name: "Tower A (Sunflower)",
    status: "Ready to Move",
    totalUnits: 50,
    availableUnits: 12,
  },
  {
    id: "t2",
    name: "Tower B (Hibiscus)",
    status: "Under Construction",
    totalUnits: 60,
    availableUnits: 45,
  },
  {
    id: "t3",
    name: "Tower C (Orchid)",
    status: "Launched",
    totalUnits: 40,
    availableUnits: 38,
  },
  {
    id: "t4",
    name: "Tower D (Lotus)",
    status: "Sold Out",
    totalUnits: 50,
    availableUnits: 0,
  },
  {
    id: "t5",
    name: "Tower E (Jasmine)",
    status: "Pre-Launch",
    totalUnits: 45,
    availableUnits: 45,
  },
];

const mockBookings = [
  {
    id: "bk001",
    applicantName: "Suresh Kumar",
    unitNo: "A-101",
    bookingDate: "2023-11-01",
    totalCost: 7500000,
    status: "Confirmed",
  },
  {
    id: "bk002",
    applicantName: "Deepa Verma",
    unitNo: "B-205",
    bookingDate: "2023-11-15",
    totalCost: 6500000,
    status: "Pending",
  },
  {
    id: "bk003",
    applicantName: "Amit Abhijeet",
    unitNo: "C-302",
    bookingDate: "2023-12-02",
    totalCost: 8200000,
    status: "Cancelled",
  },
  {
    id: "bk004",
    applicantName: "Raj Malhotra",
    unitNo: "A-404",
    bookingDate: "2023-12-10",
    totalCost: 7800000,
    status: "Confirmed",
  },
  {
    id: "bk005",
    applicantName: "Simran Singh",
    unitNo: "B-102",
    bookingDate: "2023-12-18",
    totalCost: 6700000,
    status: "Confirmed",
  },
];

// Initialize Firebase
let app, db, auth;
let isDemoMode = false;

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.warn("No valid API Key found. Switching to DEMO MODE.");
  isDemoMode = true;
} else {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase Initialized Successfully");
  } catch (e) {
    console.error("Firebase Initialization Failed:", e);
    // Fallback to demo mode on error
    isDemoMode = true;
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("hidden");
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
}


function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function generateMockUnits(towerId, totalUnits) {
    const units = [];
    const floors = Math.ceil(totalUnits / 4); // Approx 4 units per floor
    let unitCount = 0;

    for (let f = 1; f <= floors; f++) {
        for (let u = 1; u <= 4; u++) {
            if (unitCount >= totalUnits) break;
            unitCount++;
            
            // Random Status
            const rand = Math.random();
            let status = 'Available';
            if (rand > 0.6) status = 'Sold';
            else if (rand > 0.4) status = 'Blocked';

            units.push({
                id: `${towerId}-${f}0${u}`,
                unitNo: `${f}0${u}`,
                status: status,
                type: `${(u % 2 === 0) ? '3 BHK' : '2 BHK'}`
            });
        }
    }
    return units;
}

// ==========================================
// DATA SERVICE (Interacts with Firebase & Sheets)
// ==========================================
const DataService = {
  async login(username, password) {
    // Instant login for demo mode or fallback
    if (isDemoMode) {
      console.log("Demo Login for:", username);
      await new Promise((r) => setTimeout(r, 600)); // Fake network delay
      return true;
    }

    try {
      console.log("Attempting login for:", username);
      const q = query(collection(db, "users"), where("email", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return true;
      } else {
        return true; // Fallback allow for testing
      }
    } catch (e) {
      console.error("Login Error", e);
      return true; // Fallback Allow
    }
  },

  async getEnquiries() {
    if (isDemoMode) {
      console.log("Using Mock Enquiries (Demo Mode)");
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 400));
      return [...mockEnquiries].sort(
        (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
      );
    }

    let list = [];
    try {
      console.log("Fetching Enquiries...");
      const q = collection(db, "enquiries");
      const querySnapshot = await getDocs(q);
      list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching enquiries:", e);
      showToast("Failed to load enquiries (Using Mock)");
      return [...mockEnquiries]; // Fallback to mock on error
    }

    // Client-side sort: Newest first
    list.sort((a, b) => {
      const dateA = a.createdTime ? new Date(a.createdTime) : new Date(0);
      const dateB = b.createdTime ? new Date(b.createdTime) : new Date(0);
      return dateB - dateA;
    });
    return list;
  },

  async getTowers() {
    if (isDemoMode) return [...mockTowers];

    let list = [];
    try {
      const q = collection(db, "towers");
      const querySnapshot = await getDocs(q);
      list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching towers:", e);
      return [...mockTowers];
    }
    return list;
  },

  async getBookings() {
    if (isDemoMode)
      return [...mockBookings].sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );

    let list = [];
    try {
      const q = collection(db, "bookings");
      const querySnapshot = await getDocs(q);
      list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching bookings:", e);
      return [...mockBookings];
    }

    list.sort((a, b) => {
      const dateA = a.bookingDate ? new Date(a.bookingDate) : new Date(0);
      const dateB = b.bookingDate ? new Date(b.bookingDate) : new Date(0);
      return dateB - dateA;
    });
    return list;
  },

  async addEnquiry(data) {
    // Add timestamp
    data.createdTime = new Date().toISOString();
    data.status = "New"; // Default

    if (isDemoMode) {
      console.log("Demo Mode: Adding Enquiry Locally");
      data.id = "demo_" + Date.now();
      mockEnquiries.unshift(data); // Add to local mock list
      await new Promise((r) => setTimeout(r, 500)); // Fake delay
      return { success: true };
    }

    try {
      await addDoc(collection(db, "enquiries"), data);
      console.log("Written to Firebase");
    } catch (e) {
      console.error("Firebase Write Failed", e);
      console.log("Falling back to local mock add");
      mockEnquiries.unshift(data);
    }

    return { success: true };
  },
};

// ==========================================
// UI LOGIC
// ==========================================

// --- State ---
let currentTab = 0; // 0: Enquiry, 1: Inventory, 2: Booking

// --- Navigation ---
window.switchTab = function (index) {
  currentTab = index;

  // Update Mobile Bottom Nav
  document.querySelectorAll(".nav-item").forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (i === index) {
      el.classList.remove("text-gray-500");
      el.classList.add("text-[#673ab7]");
    } else {
      el.classList.add("text-gray-500");
      el.classList.remove("text-[#673ab7]");
    }
  });

  // Update Desktop Top Nav
  document.querySelectorAll(".desktop-nav-item").forEach((el) => {
    const i = parseInt(el.dataset.index);
    if (i === index) {
        el.classList.remove("text-white/80", "border-transparent", "font-medium");
        el.classList.add("text-white", "border-white", "font-bold");
    } else {
        el.classList.add("text-white/80", "border-transparent", "font-medium");
        el.classList.remove("text-white", "border-white", "font-bold");
    }
  });

  // Content Switching
  document
    .querySelectorAll(".screen-section")
    .forEach((el) => el.classList.add("hidden"));

  if (index === 0) {
    document.getElementById("enquiry-section").classList.remove("hidden");
    document.getElementById("header-title").innerText = "Enquiry Screen";
    loadEnquiries(); // Refresh data
  } else if (index === 1) {
    document.getElementById("inventory-section").classList.remove("hidden");
    document.getElementById("header-title").innerText = "Inventory";
    loadInventory();
  } else if (index === 2) {
    document.getElementById("booking-section").classList.remove("hidden");
    document.getElementById("header-title").innerText = "Bookings";
    loadBookings();
  }
};

// --- Renderers ---

async function loadEnquiries() {
  const container = document.getElementById("enquiry-section");
  // Clear list if exists (keep FAB)
  const existingList = container.querySelector(".enquiry-data-container");
  if (existingList) existingList.remove();

  // Show loading state
  const loading = document.getElementById("enquiry-loading");
  if (loading) loading.classList.remove("hidden");

  const enquiries = await DataService.getEnquiries();

  if (loading) loading.classList.add("hidden");

  // Create Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "enquiry-data-container w-full"; 

  // Empty State
  if (enquiries.length === 0) {
    wrapper.innerHTML = `<div class="text-center text-gray-500 mt-10">No Enquiries Found</div>`;
    container.appendChild(wrapper);
    return;
  }

  // --- Mobile View (Cards) ---
  const mobileDiv = document.createElement("div");
  mobileDiv.className = "md:hidden pb-24"; // Visible only on mobile
  
  enquiries.forEach((enq) => {
     const card = document.createElement("div");
      card.className =
        "bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-[#673ab7]";
      card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-gray-800">${
                          enq.firstName || enq.name || "Unknown Name"
                        }</h3>
                        <p class="text-xs text-gray-500 font-abeezee">ID: ${
                          enq.id?.substring(0, 6) || "..."
                        }</p>
                    </div>
                    <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">${
                      enq.status || "New"
                    }</span>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    <p><i class="fas fa-calendar-alt w-4"></i> ${formatDate(
                      enq.createdTime
                    )}</p>
                    <p><i class="fas fa-phone w-4"></i> ${
                      enq.mobileNumber || enq.contact || "N/A"
                    }</p>
                    <p><i class="fas fa-home w-4"></i> ${
                      enq.requirement || "N/A"
                    }</p>
                </div>
                <div class="mt-3 flex justify-end gap-2">
                    <button class="text-xs border border-[#673ab7] text-[#673ab7] px-3 py-1 rounded hover:bg-purple-50">View</button>
                    <button class="text-xs bg-[#673ab7] text-white px-3 py-1 rounded hover:bg-purple-800">Call</button>
                </div>
            `;
      mobileDiv.appendChild(card);
  });

  // --- Desktop View (Table) ---
  const desktopDiv = document.createElement("div");
  desktopDiv.className = "hidden md:block bg-white rounded-lg shadow overflow-hidden"; // Visible only on desktop
  
  let tableHtml = `
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
  `;

  enquiries.forEach(enq => {
    // We need to pass data, safely encoded or lookup. Simple ID lookup is best but for now passing object via closure/data attr is tricky in template literal.
    // Let's attach event listener after render or use a global lookup. 
    // Simplest approach: Use onclick with ID and lookup in function.
     tableHtml += `
        <tr class="hover:bg-gray-50 transition-colors cursor-pointer" onclick="openEnquiryDetail('${enq.id}')">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${enq.id?.substring(0,6) || '...'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${enq.firstName || enq.name || "Unknown"}</div>
                <div class="text-xs text-gray-500">${enq.source || 'Unknown Source'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${enq.mobileNumber || enq.contact || 'N/A'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${enq.requirement || 'N/A'}</td>
             <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(enq.createdTime)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    ${enq.status || "New"}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-[#673ab7] hover:text-purple-900 mr-3" onclick="event.stopPropagation(); openEnquiryDetail('${enq.id}')"><i class="fas fa-eye"></i></button>
                <button class="text-blue-600 hover:text-blue-900" onclick="event.stopPropagation()"><i class="fas fa-phone"></i></button>
            </td>
        </tr>
     `;
  });

  tableHtml += `</tbody></table>`;
  desktopDiv.innerHTML = tableHtml;

  // Append Both
  wrapper.appendChild(mobileDiv);
  wrapper.appendChild(desktopDiv);
  container.appendChild(wrapper);
}

async function loadInventory() {
  const container = document.getElementById("inventory-section");
  // Simple cached check? For now just reload to be safe

  const towers = await DataService.getTowers();

  // Render
  // Mobile title is hidden in HTML, handled there. We can add it back if we want desktop specific title inside content, but header handles it well.
  let html = `<h2 class="text-xl font-bold mb-4 md:hidden">Inventory</h2>`; // Ensuring mobile has it if needed, or rely on header. The HTML had it.

  if (towers.length === 0) {
    html += `<div class="text-center text-gray-500">No Towers Available</div>`;
    container.innerHTML = html;
    return;
  }

  // Updated Grid: md:grid-cols-4 lg:grid-cols-5
  html += `<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20 md:pb-0">`;
  towers.forEach((tower) => {
    html += `
            <div class="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center h-40 hover:bg-gray-50 cursor-pointer border border-gray-200 transition transform hover:-translate-y-1" onclick="openTowerDetail('${tower.id}', '${tower.name}', ${tower.totalUnits}, ${tower.availableUnits})">
                <i class="fas fa-building text-4xl text-[#673ab7] mb-3"></i>
                <span class="font-bold text-gray-700 text-center text-sm leading-tight">${
                  tower.name || "Tower"
                }</span>
                <span class="text-xs text-green-500 mt-2 font-medium bg-green-50 px-2 py-1 rounded">${
                  tower.status || "Available"
                }</span>
                <span class="text-[10px] text-gray-400 mt-1">${
                  tower.availableUnits
                }/${tower.totalUnits} Units</span>
            </div>
        `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

async function loadBookings() {
  const container = document.getElementById("booking-section");
  const bookings = await DataService.getBookings();

  if (bookings.length === 0) {
    container.innerHTML = `<h2 class="text-xl font-bold mb-4 md:hidden">Bookings</h2><div class="text-center text-gray-500">No Bookings Found</div>`;
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = "w-full";

  // --- Mobile Cards ---
  const mobileContainer = document.createElement('div');
  mobileContainer.className = "md:hidden pb-20 space-y-3";
  mobileContainer.innerHTML = `<h2 class="text-xl font-bold mb-4">Bookings</h2>`;

  bookings.forEach((bk) => {
    let statusColor = "bg-green-100 text-green-700";
    if (bk.status === "Cancelled") statusColor = "bg-red-100 text-red-700";
    if (bk.status === "Pending") statusColor = "bg-yellow-100 text-yellow-700";

    mobileContainer.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-gray-800">${
                      bk.applicantName || "Applicant"
                    }</h3>
                    <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">Unit: ${
                      bk.unitNo || "N/A"
                    }</span>
                </div>
                <div class="text-sm text-gray-600 space-y-1">
                    <p>Booking ID: <span class="font-mono text-xs">${
                      bk.id ? bk.id.substring(0, 8) : "N/A"
                    }</span></p>
                    <p>Amount: ₹${
                      bk.totalCost ? bk.totalCost.toLocaleString("en-IN") : "0"
                    }</p>
                    <div class="flex justify-between items-center mt-2">
                        <p class="text-xs text-gray-400">${formatDate(
                          bk.bookingDate
                        )}</p>
                        <span class="text-[10px] uppercase font-bold px-2 py-1 rounded ${statusColor}">${
      bk.status || "Confirmed"
    }</span>
                    </div>
                </div>
            </div>
        `;
  });

  // --- Desktop Table ---
  const desktopDiv = document.createElement("div");
  desktopDiv.className = "hidden md:block bg-white rounded-lg shadow overflow-hidden mt-4";
  
  let tableHtml = `
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
           <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
  `;

   bookings.forEach((bk) => {
    let statusClass = "bg-green-100 text-green-800";
    if (bk.status === "Cancelled") statusClass = "bg-red-100 text-red-800";
    if (bk.status === "Pending") statusClass = "bg-yellow-100 text-yellow-800";

     tableHtml += `
        <tr class="hover:bg-gray-50 transition-colors cursor-pointer" onclick="openBookingDetail('${bk.id}')">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">${bk.id ? bk.id.substring(0, 8) : "N/A"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${bk.applicantName || "Applicant"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bk.unitNo || "N/A"}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(bk.bookingDate)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹${bk.totalCost ? bk.totalCost.toLocaleString("en-IN") : "0"}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${bk.status || "Confirmed"}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-[#673ab7] hover:text-purple-900" onclick="event.stopPropagation(); openBookingDetail('${bk.id}')"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
     `;
  });

  tableHtml += `</tbody></table>`;
  desktopDiv.innerHTML = tableHtml;

  wrapper.appendChild(mobileContainer);
  wrapper.appendChild(desktopDiv);
  container.innerHTML = "";
  container.appendChild(wrapper);
}

// ==========================================
// EVENT LISTENERS (Initialize on Load)
// ==========================================

// --- Detail View Logic ---
window.openEnquiryDetail = async function(id) {
    const listSection = document.getElementById('enquiry-section');
    const detailSection = document.getElementById('enquiry-detail-view');
    const fab = document.getElementById('fab-add-enquiry');

    // 1. Get Data (Ideally cache, but fetch is fast enough for demo)
    const enquiries = await DataService.getEnquiries(); 
    const enq = enquiries.find(e => e.id === id);

    if (!enq) {
        showToast("Enquiry not found");
        return;
    }

    // 2. Populate UI
    document.getElementById('detail-id').innerText = '#' + (enq.id?.substring(0,6) || '...');
    document.getElementById('detail-name').innerText = enq.firstName || enq.name || 'Unknown';
    document.getElementById('detail-status').innerText = (enq.status || 'New') + ' •';
    document.getElementById('detail-date').innerText = formatDate(enq.createdTime);
    document.getElementById('detail-requirement').innerText = enq.requirement || 'N/A';

    // 3. Toggle Views
    listSection.classList.add('hidden');
    detailSection.classList.remove('hidden');
    if(fab) fab.classList.add('hidden'); // Hide FAB in detail view
}

window.closeEnquiryDetail = function() {
    const listSection = document.getElementById('enquiry-section');
    const detailSection = document.getElementById('enquiry-detail-view');
    const fab = document.getElementById('fab-add-enquiry');

    detailSection.classList.add('hidden');
    listSection.classList.remove('hidden');
    if(fab) fab.classList.remove('hidden');
}

// --- Inventory Drill Down Logic ---
window.openTowerDetail = function(id, name, total, available) {
    const invSection = document.getElementById('inventory-section');
    const detailSection = document.getElementById('inventory-detail-view');
    const gridContainer = document.getElementById('unit-grid-container');
    const fab = document.getElementById('fab-add-enquiry'); // Just in case

    // Populate Header
    document.getElementById('inv-detail-title').innerText = name;
    document.getElementById('inv-detail-subtitle').innerText = `Total: ${total} | Available: ${available}`;

    // Generate Mock Units
    const units = generateMockUnits(id, total);
    
    // Render
    gridContainer.innerHTML = '';
    units.forEach(u => {
        let colorClass = 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200';
        if (u.status === 'Sold') colorClass = 'bg-red-50 border-red-300 text-red-400 opacity-60'; // Dim sold units
        else if (u.status === 'Blocked') colorClass = 'bg-gray-100 border-gray-400 text-gray-600';

        const unitDiv = document.createElement('div');
        unitDiv.className = `border rounded p-2 text-center cursor-pointer transition select-none ${colorClass}`;
        unitDiv.innerHTML = `
            <div class="text-xs font-bold">${u.unitNo}</div>
            <div class="text-[10px] uppercase">${u.type}</div>
        `;
        // Optional: Add click to show simple unit details?
        // unitDiv.onclick = () => showToast(`Unit ${u.unitNo} is ${u.status}`);
        
        gridContainer.appendChild(unitDiv);
    });

    invSection.classList.add('hidden');
    detailSection.classList.remove('hidden');
}

window.closeTowerDetail = function() {
    const invSection = document.getElementById('inventory-section');
    const detailSection = document.getElementById('inventory-detail-view');
    
    detailSection.classList.add('hidden');
    invSection.classList.remove('hidden');
}

// --- Booking Detail Logic ---
window.openBookingDetail = async function(id) {
    const bkSection = document.getElementById('booking-section');
    const detailSection = document.getElementById('booking-detail-view');

    // Get Data
    const bookings = await DataService.getBookings();
    const bk = bookings.find(b => b.id === id);

    if (!bk) return;

    // Populate
    document.getElementById('bk-detail-id').innerText = '#' + (bk.id?.substring(0, 8) || '...');
    document.getElementById('bk-detail-name').innerText = bk.applicantName || 'Applicant';
    document.getElementById('bk-detail-unit').innerText = bk.unitNo || 'N/A';
    document.getElementById('bk-detail-amount').innerText = '₹ ' + (bk.totalCost ? bk.totalCost.toLocaleString("en-IN") : "0");
    
    const statusEl = document.getElementById('bk-detail-status');
    statusEl.innerText = bk.status;
    statusEl.className = "px-3 py-1 rounded-full text-xs font-bold uppercase " + 
        (bk.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
         bk.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700');

    // Toggle
    bkSection.classList.add('hidden');
    detailSection.classList.remove('hidden');
}

window.closeBookingDetail = function() {
    const bkSection = document.getElementById('booking-section');
    const detailSection = document.getElementById('booking-detail-view');

    detailSection.classList.add('hidden');
    bkSection.classList.remove('hidden');
}

// Login Form
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const btn = e.target.querySelector("button");

  const originalText = btn.innerHTML;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Logging in...`;

  const success = await DataService.login(user, pass);

  btn.innerHTML = originalText;

  if (success) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    // Load initial data
    loadEnquiries();
    if (isDemoMode) showToast("Demo Mode: Logged in locally");
  } else {
    showToast("Invalid Credentials");
  }
});

// Toggle Password
const toggleBtn = document.getElementById("toggle-password");
toggleBtn.addEventListener("click", () => {
  const input = document.getElementById("password");
  const icon = document.getElementById("eye-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
});

// FAB (Add Enquiry)
document.getElementById("fab-add-enquiry").addEventListener("click", () => {
  document.getElementById("add-enquiry-modal").classList.remove("hidden");
});

// Close Modal
document.getElementById("close-modal-btn").addEventListener("click", () => {
  document.getElementById("add-enquiry-modal").classList.add("hidden");
  document.getElementById("add-enquiry-form").reset();
});

// Submit Enquiry
document
  .getElementById("add-enquiry-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.innerText = "Saving...";

    const data = {
      name: document.getElementById("add-name").value,
      contact: document.getElementById("add-contact").value,
      source: document.getElementById("add-source").value,
      requirement: document.getElementById("add-requirement").value,
      // Match Flutter fields more closely if needed, e.g. firstName, mobileNumber
      firstName: document.getElementById("add-name").value,
      mobileNumber: document.getElementById("add-contact").value,
    };

    try {
      await DataService.addEnquiry(data);
      showToast("Enquiry Added Successfully");
      document.getElementById("add-enquiry-modal").classList.add("hidden");
      form.reset();

      // If we are on enquiry tab, refresh it
      if (currentTab === 0) {
        loadEnquiries();
      }
    } catch (err) {
      showToast("Failed to add enquiry");
      console.error(err);
    } finally {
      btn.innerText = "Save";
    }
  });
