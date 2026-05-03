const Components = {
    navbar: `
    <nav style="padding: 20px; display: flex; justify-content: space-between; align-items: center;" class="container">
        <div class="logo">
            <a href="index.html">
                <img src="assets/logo.jpeg" alt="Logo" style="height: 50px; width: auto; vertical-align: middle; margin-right: 5px;">
            </a>
        </div>
        <!-- 'nav-links' class added for CSS spacing and alignment -->
        <div class="links nav-links">
            <a href="index.html">Home</a>
            <a href="projects.html">Projects</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="admin.html" style="border: 1px solid var(--primary-red); padding: 5px 10px;">Admin</a>
        </div>
    </nav>
`,

    // Added image optimization and lazy loading to fix the 20-second delay
    projectCard: (project) => {
        const displayDate = project.created_at 
            ? new Date(project.created_at).toLocaleDateString() 
            : "Recent Work";

        // Added ?width=600&quality=70 to the image URL to shrink file size automatically
        // Added loading="lazy" so images only download when scrolled into view
        return `
            <div class="card" style="background: var(--card-bg); border-radius: 8px; overflow: hidden;">
                <img src="${project.image_url}?width=600&quality=70" 
                     alt="${project.title}"
                     loading="lazy"
                     style="width: 100%; height: 250px; object-fit: cover;" 
                     onerror="this.src='assets/placeholder.jpg'">
                <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--primary-red); font-size: 0.8rem;">${project.category}</span>
                        <span style="color: #888; font-size: 0.7rem;">${displayDate}</span>
                    </div>
                    <h3 style="margin: 10px 0;">${project.title}</h3>
                    <a href="project-detail.html?id=${project.id}" style="color: white; text-decoration: underline; font-size: 0.9rem;">View Details</a>
                </div>
            </div>
        `;
    }
};

// Safety Check: Only inject if the placeholder exists
const navPlaceholder = document.getElementById('navbar-placeholder');
if (navPlaceholder) {
    navPlaceholder.innerHTML = Components.navbar;
}