// 1. Initialize Supabase Connection
const _supabase = supabase.createClient(
    'https://zvqhgotlwcrnpylatbpi.supabase.co', 
    'sb_publishable_5flbGfEXWEiXpxYvOvEYdA_9k0H1D0k'
);

const Store = {
    // Projects (Cloud Version)
    getProjects: async () => {
        const { data, error } = await _supabase.from('projects').select('*');
        if (error) console.error("Error fetching projects:", error);
        return data || [];
    },

    saveProject: async (project) => {
        // This handles both New and Update (if you have an ID)
        const { data, error } = await _supabase
            .from('projects')
            .upsert([project]);
        
        if (error) {
            console.error("Error saving project:", error);
            alert("Save failed: " + error.message);
        }
        return data;
    },

    getProjectById: async (id) => {
        const { data, error } = await _supabase.from('projects').select('*').eq('id', id).single();
        if (error) console.error("Error finding project:", error);
        return data;
    },

    deleteProject: async (id) => {
        const { error } = await _supabase.from('projects').delete().eq('id', id);
        if (error) console.error("Error deleting project:", error);
    },

    // Categories (Cloud Version)
    getCategories: async () => {
        const { data, error } = await _supabase.from('categories').select('*');
        if (error) {
            console.error("Error fetching categories:", error);
            return ["Branding", "UI/UX"]; // Fallback if database fails
        }
        // If data is empty, return the defaults so the UI isn't blank
        return (data && data.length > 0) ? data.map(c => c.name) : ["Branding", "UI/UX"];
    },

    addCategory: async (categoryName) => {
        const { error } = await _supabase.from('categories').insert([{ name: categoryName }]);
        if (error) {
            console.error("Error adding category:", error);
            alert("Failed to add category: " + error.message);
        }
    },

    // ADD THIS MISSING FUNCTION:
    deleteCategory: async (categoryName) => {
        const { error } = await _supabase
            .from('categories')
            .delete()
            .eq('name', categoryName);
            
        if (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category: " + error.message);
        }
    },

    // Messages (Cloud Version)
    getMessages: async () => {
        const { data, error } = await _supabase.from('projects_messages').select('*');
        return data || [];
    },

    saveMessage: async (msg) => {
        const { error } = await _supabase.from('projects_messages').insert([msg]);
        if (error) console.error("Error saving message:", error);
    },
    deleteMessage: async (id) => {
        const { error } = await _supabase
            .from('projects_messages')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message: " + error.message);
        }
    }
};

// Note: We removed Store.init() because the cloud database handles initial setup!