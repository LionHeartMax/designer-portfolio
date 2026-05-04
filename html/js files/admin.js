let currentEditId = null;
let base64Image = "";

/**
 * AUTHENTICATION
 */
async function login() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    
    // Simple credential check
    if (user === 'admin' && pass === 'password123') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        
        // CSS Fix: Ensure the dashboard allows for long-form scrolling
        const dashboard = document.getElementById('admin-dashboard');
        dashboard.style.overflowY = "auto";
        dashboard.style.height = "auto";
        dashboard.style.minHeight = "100vh";

        await refreshDashboard(); 
    } else { 
        alert("Wrong credentials!"); 
    }
}

/**
 * DASHBOARD REFRESH
 */
async function refreshDashboard() {
    await renderAdminList();
    await renderCategoryOptions();
    await renderCategoryManager();
    await renderMessages(); 
}

/**
 * MESSAGES / INBOX LOGIC
 */
async function renderMessages() {
    const container = document.getElementById('admin-messages-list');
    const msgs = await Store.getMessages();
    
    container.innerHTML = msgs.length ? msgs.map(m => `
        <div class="admin-item" style="flex-direction: column; align-items: flex-start; gap: 5px; border-left: 3px solid var(--primary-red);">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <strong>${m.name} <small>(${m.email})</small></strong>
                <button class="btn-delete" onclick="dismissMessage(${m.id})" style="padding: 2px 8px;">✕</button>
            </div>
            <p style="font-size: 0.9rem; margin-top: 5px;">${m.message}</p> 
        </div>
    `).join('') : '<p>No messages in inbox.</p>';
}

async function dismissMessage(id) {
    if(confirm("Dismiss this message?")) {
        await Store.deleteMessage(id);
        await renderMessages();
    }
}

/**
 * PROJECT MANAGEMENT LOGIC
 */

// Handle File selection for local uploads
function handleFileSelect(e) {
    const reader = new FileReader();
    reader.onload = (ev) => { 
        base64Image = ev.target.result; 
        document.getElementById('imgUrl').placeholder = "Image loaded from file"; 
    };
    reader.readAsDataURL(e.target.files[0]);
}

// Render the list of projects (Updated to show all 80+)
async function renderAdminList() {
    const container = document.getElementById('admin-project-list');
    
    // Fetch EVERYTHING from Supabase
    const projects = await Store.getAllProjects(); 
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects found in the database.</p>';
        return;
    }

    container.innerHTML = projects.map(p => `
        <div class="admin-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #222;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${p.image_url}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #444;"
                     onerror="this.src='assets/placeholder.jpg'">
                <div>
                    <div style="font-weight: bold; color: white;">${p.title}</div>
                    <div style="font-size: 0.75rem; color: #888;">${p.category}</div>
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn-primary" style="padding: 6px 12px; font-size: 11px;" onclick="editProject('${p.id}')">Edit</button>
                <button class="btn-delete" style="padding: 6px 12px; font-size: 11px;" onclick="deleteProject('${p.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle project creation and updates
async function handleUpload(e) {
    e.preventDefault();
    
    // Preference: Base64 file > URL text input
    const finalImage = base64Image || document.getElementById('imgUrl').value;
    
    if (!finalImage) {
        alert("Please provide an image URL or upload a file!");
        return;
    }

    const projectData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('desc').value, 
        image_url: finalImage 
    };

    if (currentEditId) {
        projectData.id = currentEditId; 
    }

    await Store.saveProject(projectData);
    cancelEdit();
    await renderAdminList();
}

async function editProject(id) {
    const p = await Store.getProjectById(id);
    if (!p) return;

    currentEditId = id;
    document.getElementById('title').value = p.title;
    document.getElementById('category').value = p.category;
    document.getElementById('desc').value = p.description || ""; 
    document.getElementById('imgUrl').value = p.image_url;
    document.getElementById('form-title').innerText = "Edit Project";
    
    // Scroll back to top to see the form
    window.scrollTo({top: 0, behavior: 'smooth'});
}

async function deleteProject(id) { 
    if(confirm("Are you sure you want to delete this project? This cannot be undone.")) { 
        await Store.deleteProject(id); 
        await renderAdminList(); 
    } 
}

function cancelEdit() {
    currentEditId = null; 
    base64Image = "";
    document.getElementById('upload-form').reset();
    document.getElementById('form-title').innerText = "Project Manager";
}

/**
 * CATEGORY LOGIC
 */
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
    const n = prompt("New Category Name:"); 
    if(n) { 
        await Store.addCategory(n); 
        await refreshDashboard(); 
    } 
}

async function removeCategory(n) { 
    if(confirm(`Delete category "${n}"?`)) { 
        await Store.deleteCategory(n); 
        await refreshDashboard(); 
    } 
}