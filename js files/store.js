const Store = {
    init() {
        if (!localStorage.getItem('projects')) localStorage.setItem('projects', JSON.stringify([]));
        if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(["Branding", "UI/UX"]));
        if (!localStorage.getItem('messages')) localStorage.setItem('messages', JSON.stringify([]));
    },

    // Projects
    getProjects: () => JSON.parse(localStorage.getItem('projects')),
    saveProjects: (p) => localStorage.setItem('projects', JSON.stringify(p)),
    getProjectById: (id) => Store.getProjects().find(p => p.id == id),
    deleteProject: (id) => Store.saveProjects(Store.getProjects().filter(p => p.id != id)),

    // Categories
    getCategories: () => JSON.parse(localStorage.getItem('categories')),
    addCategory: (c) => {
        const cats = Store.getCategories();
        if(!cats.includes(c)) { cats.push(c); localStorage.setItem('categories', JSON.stringify(cats)); }
    },
    deleteCategory: (c) => localStorage.setItem('categories', JSON.stringify(Store.getCategories().filter(cat => cat !== c))),

    // Messages (NEW)
    getMessages: () => JSON.parse(localStorage.getItem('messages')),
    saveMessage(msg) {
        const msgs = this.getMessages();
        msg.id = Date.now();
        msgs.push(msg);
        localStorage.setItem('messages', JSON.stringify(msgs));
    },
    deleteMessage(id) {
        const msgs = this.getMessages().filter(m => m.id != id);
        localStorage.setItem('messages', JSON.stringify(msgs));
    }
};
Store.init();