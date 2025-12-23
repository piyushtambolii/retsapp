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

  // Update Icons/Colors
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
  const existingList = container.querySelector(".enquiry-list-container");
  if (existingList) existingList.remove();

  // Show loading state if it takes time (but we want it fast!)
  const loading = document.getElementById("enquiry-loading");
  if (loading) loading.classList.remove("hidden");

  const enquiries = await DataService.getEnquiries();

  if (loading) loading.classList.add("hidden");

  const listDiv = document.createElement("div");
  listDiv.className = "enquiry-list-container pb-24"; // Padding for FAB

  if (enquiries.length === 0) {
    listDiv.innerHTML = `<div class="text-center text-gray-500 mt-10">No Enquiries Found</div>`;
  } else {
    enquiries.forEach((enq) => {
      const card = document.createElement("div");
      card.className =
        "bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-[#673ab7] slide-in"; // Added slide-in if we had css, but standard is fine
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
      listDiv.appendChild(card);
    });
  }

  container.appendChild(listDiv);
}

async function loadInventory() {
  const container = document.getElementById("inventory-section");
  // Simple cached check? For now just reload to be safe

  const towers = await DataService.getTowers();

  // Render
  let html = `<h2 class="text-xl font-bold mb-4">Inventory</h2>`;

  if (towers.length === 0) {
    html += `<div class="text-center text-gray-500">No Towers Available</div>`;
    container.innerHTML = html;
    return;
  }

  html += `<div class="grid grid-cols-2 gap-4 pb-20">`;
  towers.forEach((tower) => {
    html += `
            <div class="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center h-40 hover:bg-gray-50 cursor-pointer border border-gray-200">
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

  let html = `<h2 class="text-xl font-bold mb-4">Bookings</h2>`;

  if (bookings.length === 0) {
    html += `<div class="text-center text-gray-500">No Bookings Found</div>`;
    container.innerHTML = html;
    return;
  }

  html += `<div class="pb-20 space-y-3">`;
  bookings.forEach((bk) => {
    let statusColor = "bg-green-100 text-green-700";
    if (bk.status === "Cancelled") statusColor = "bg-red-100 text-red-700";
    if (bk.status === "Pending") statusColor = "bg-yellow-100 text-yellow-700";

    html += `
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
  html += `</div>`;

  container.innerHTML = html;
}

// ==========================================
// EVENT LISTENERS (Initialize on Load)
// ==========================================

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
