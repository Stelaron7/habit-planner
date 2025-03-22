document.addEventListener('DOMContentLoaded', async () => {
  // Load habits data
  const response = await fetch('habits.json');
  const data = await response.json();
  
  // Populate sections
  const grid = document.querySelector('.sections-grid');
  grid.innerHTML = data.categories.map(category => `
    <div class="section-card">
      <div class="section-header">
        <div class="section-icon">
          <i class="${category.icon}"></i>
        </div>
        <h2>${category.name}</h2>
      </div>
      ${category.subsections.map(subsection => `
        <div class="subsection">
          <h3>${subsection.name}</h3>
          ${subsection.plans.map(plan => `
            <div class="quick-plan ${plan.premium ? 'premium' : ''}">
              <span>${plan.text}</span>
              ${plan.premium ? '<i class="fas fa-lock"></i>' : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `).join('');

  // Premium feature handling
  const premiumItems = document.querySelectorAll('.premium');
  const premiumModal = document.querySelector('.premium-modal');

  premiumItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if(!item.classList.contains('unlocked')) {
        premiumModal.style.display = 'grid';
      }
    });
  });

  // Modal close functionality
  window.addEventListener('click', (e) => {
    if(e.target === premiumModal) {
      premiumModal.style.display = 'none';
    }
  });
});
