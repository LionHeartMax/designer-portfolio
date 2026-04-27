const Components = {
    navbar: `
        <nav style="padding: 20px; display: flex; justify-content: space-between; align-items: center;" class="container">
            <div class="logo"><a href="index.html"><img src="assets/logo.jpeg" alt="Logo" style="height: 50px; width: auto; vertical-align: middle; margin-right: 5px;"></a></div>
            <div class="links">
                <a href="index.html">Home</a>
                <a href="projects.html">Projects</a>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
                <a href="admin.html" style="border: 1px solid var(--primary-red); padding: 5px 10px; margin-left: 10px;">Admin</a>
            </div>
        </nav>
    `,

    projectCard: (project) => `
        <div class="card" style="background: var(--card-bg); border-radius: 8px; overflow: hidden;">
            <img src="${project.images[0]}" style="width: 100%; height: 250px; object-fit: cover;">
            <div style="padding: 20px;">
                <span style="color: var(--primary-red); font-size: 0.8rem;">${project.category}</span>
                <h3 style="margin: 10px 0;">${project.title}</h3>
                <a href="project-detail.html?id=${project.id}" style="color: white; text-decoration: underline; font-size: 0.9rem;">View Details</a>
            </div>
        </div>
    `
};

// Safety Check: Only inject if the placeholder exists
const navPlaceholder = document.getElementById('navbar-placeholder');
if (navPlaceholder) {
    navPlaceholder.innerHTML = Components.navbar;
}