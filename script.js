// script.js
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('habits.json');
    const data = await response.json();
    const matrix = document.querySelector('.habit-matrix');
    
    // Generate sections
    matrix.innerHTML = data.sections.map(section => `
        <div class="section-card">
            <div class="section-header">
                <h2>${section.name}</h2>
                <i class="${section.icon}"></i>
            </div>
            ${section.subsections.map(sub => `
                <div class="subsection">
                    <h4>${sub.name}</h4>
                    ${sub.plans.map(plan => `
                        <div class="plan ${plan.premium ? 'premium' : ''}">
                            ${plan.text}
                            ${plan.premium ? '<i class="fas fa-lock"></i>' : ''}
                        </div>
                    `).join('')}
                    ${sub.premium ? '<div class="premium-overlay"><button class="btn-premium">Unlock</button></div>' : ''}
                </div>
            `).join('')}
        </div>
    `).join('');

    // Premium functionality
    document.querySelectorAll('.btn-premium').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.premium-modal').classList.remove('hidden');
        });
    });

    // AI FAB functionality
    document.querySelector('.ai-fab').addEventListener('click', () => {
        const goal = prompt('Enter your primary life goal:');
        generateAIPlan(goal);
    });
});

function generateAIPlan(goal) {
    // AI-generated plan logic
    alert(`🚀 Generated AI-Powered Habit Plan for: "${goal}"\n\n1. Morning Quantum Routine\n2. Neuroplasticity Drills\n3. Metabolic Optimization`);
}
