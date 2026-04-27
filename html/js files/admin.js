let currentEditId = null;
let base64Image = "";

// 1. Added async so we can wait for Store data
async function login() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    if (user === 'admin' && pass === 'password123') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        await refreshDashboard(); // Wait for data to load
    } else { alert("Wrong credentials!"); }
}

async function refreshDashboard() {
    await renderAdminList();
    await renderCategoryOptions();
    await renderCategoryManager();
    await renderMessages(); 
}

// --- Inbox Logic ---
async function renderMessages() {
    const container = document.getElementById('admin-messages-list');
    const msgs = await Store.getMessages(); // Added await
    
    // Note: Used m.message instead of m.text to match the table column
    container.innerHTML = msgs.length ? msgs.map(m => `
        <div class="admin-item" style="flex-direction: column; align-items: flex-start; gap: 5px; border-left: 3px solid #ff4d4d;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <strong>${m.name} <small>(${m.email})</small></strong>
                <button class="btn-delete" onclick="dismissMessage(${m.id})" style="padding: 2px 8px;">✕</button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 5px;">${m.message}</p> 
        </div>
    `).join('') : '<p>No messages in inbox.</p>';
}

async function dismissMessage(id) {
    await Store.deleteMessage(id);
    await renderMessages();
}

// --- Project Logic ---
function handleFileSelect(e) {
    const reader = new FileReader();
    reader.onload = (ev) => { 
        base64Image = ev.target.result; 
        document.getElementById('imgUrl').placeholder = "File Loaded"; 
    };
    reader.readAsDataURL(e.target.files[0]);
}

async function handleUpload(e) {
    e.preventDefault();
    const finalImage = base64Image || document.getElementById('imgUrl').value;
    
    // Inside handleUpload function
    const projectData = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    description: document.getElementById('desc').value, 
    image_url: finalImage 
};

    if (currentEditId) {
        projectData.id = currentEditId; 
    }

    await Store.saveProject(projectData); // Save directly to cloud
    cancelEdit();
    await renderAdminList();
}

async function editProject(id) {
    const p = await Store.getProjectById(id);
    currentEditId = id;
    document.getElementById('title').value = p.title;
    document.getElementById('category').value = p.category;
    document.getElementById('desc').value = p.description || ""; 
    document.getElementById('form-title').innerText = "Edit Project";
    window.scrollTo({top:0, behavior:'smooth'});
}

async function deleteProject(id) { 
    if(confirm("Delete?")) { 
        await Store.deleteProject(id); 
        await renderAdminList(); 
    } 
}

function cancelEdit() {
    currentEditId = null; base64Image = "";
    document.getElementById('upload-form').reset();
    document.getElementById('form-title').innerText = "Project Manager";
}

async function renderAdminList() {
    const projects = await Store.getProjects(); // Added await
    document.getElementById('admin-project-list').innerHTML = projects.map(p => `
        <div class="admin-item">
            <span>${p.title}</span>
            <div>
                <button class="btn-primary" style="padding:5px; font-size:10px;" onclick="editProject(${p.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProject(${p.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function renderCategoryOptions() { 
    const cats = await Store.getCategories();
    document.getElementById('category').innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join(''); 
}

async function renderCategoryManager() { 
    const cats = await Store.getCategories();
    document.getElementById('category-manage-list').innerHTML = cats.map(c => `
        <div class="admin-item">
            <span>${c}</span>
            <button class="btn-delete" onclick="removeCategory('${c}')">Remove</button>
        </div>`).join(''); 
}

async function handleAddCategory() { 
    const n = prompt("Name:"); 
    if(n) { 
        await Store.addCategory(n); 
        await refreshDashboard(); 
    } 
}

async function removeCategory(n) { 
    if(confirm("Delete?")) { 
        // Note: You'll need a deleteCategory in Store.js to make this work!
        await Store.deleteCategory(n); 
        await refreshDashboard(); 
    } 
}