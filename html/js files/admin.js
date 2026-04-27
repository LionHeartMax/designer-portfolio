let currentEditId = null;
let base64Image = "";

function login() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    if (user === 'admin' && pass === 'password123') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        refreshDashboard();
    } else { alert("Wrong credentials!"); }
}

function refreshDashboard() {
    renderAdminList();
    renderCategoryOptions();
    renderCategoryManager();
    renderMessages(); // Load the inbox
}

// --- Inbox Logic ---
function renderMessages() {
    const container = document.getElementById('admin-messages-list');
    const msgs = Store.getMessages();
    
    container.innerHTML = msgs.length ? msgs.map(m => `
        <div class="admin-item" style="flex-direction: column; align-items: flex-start; gap: 5px; border-left: 3px solid var(--primary-red);">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <strong>${m.name} <small style="color:var(--text-gray)">(${m.email})</small></strong>
                <button class="btn-delete" onclick="dismissMessage(${m.id})" style="padding: 2px 8px;">✕</button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 5px;">${m.text}</p>
        </div>
    `).join('') : '<p style="color:var(--text-gray)">No messages in inbox.</p>';
}

function dismissMessage(id) {
    Store.deleteMessage(id);
    renderMessages();
}

// --- Project & Category Logic (Same as before) ---
function handleFileSelect(e) {
    const reader = new FileReader();
    reader.onload = (ev) => { base64Image = ev.target.result; document.getElementById('imgUrl').placeholder = "File Loaded"; };
    reader.readAsDataURL(e.target.files[0]);
}

function handleUpload(e) {
    e.preventDefault();
    const projects = Store.getProjects();
    const finalImage = base64Image || document.getElementById('imgUrl').value;
    const projectData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('desc').value,
        images: [finalImage],
        date: new Date().toLocaleDateString()
    };
    if (currentEditId) {
        const idx = projects.findIndex(p => p.id == currentEditId);
        projectData.id = currentEditId; projects[idx] = projectData;
    } else {
        projectData.id = Date.now(); projects.push(projectData);
    }
    Store.saveProjects(projects);
    cancelEdit();
    renderAdminList();
}

function editProject(id) {
    const p = Store.getProjectById(id);
    currentEditId = id;
    document.getElementById('title').value = p.title;
    document.getElementById('category').value = p.category;
    document.getElementById('desc').value = p.description;
    document.getElementById('form-title').innerText = "Edit Project";
    window.scrollTo({top:0, behavior:'smooth'});
}

function deleteProject(id) { if(confirm("Delete?")) { Store.deleteProject(id); renderAdminList(); } }

function cancelEdit() {
    currentEditId = null; base64Image = "";
    document.getElementById('upload-form').reset();
    document.getElementById('form-title').innerText = "Project Manager";
}

function renderAdminList() {
    document.getElementById('admin-project-list').innerHTML = Store.getProjects().map(p => `
        <div class="admin-item">
            <span>${p.title}</span>
            <div>
                <button class="btn-primary" style="padding:5px; font-size:10px;" onclick="editProject(${p.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProject(${p.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderCategoryOptions() { document.getElementById('category').innerHTML = Store.getCategories().map(c => `<option value="${c}">${c}</option>`).join(''); }
function renderCategoryManager() { document.getElementById('category-manage-list').innerHTML = Store.getCategories().map(c => `<div class="admin-item"><span>${c}</span><button class="btn-delete" onclick="removeCategory('${c}')">Remove</button></div>`).join(''); }
function handleAddCategory() { const n = prompt("Name:"); if(n) { Store.addCategory(n); refreshDashboard(); } }
function removeCategory(n) { if(confirm("Delete?")) { Store.deleteCategory(n); refreshDashboard(); } }