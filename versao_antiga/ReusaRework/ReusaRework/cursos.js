(() => {
  // Serviço de armazenamento local
  class StorageService {
    static get(key) {
      return JSON.parse(localStorage.getItem(key)) || null;
    }
    static set(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  // CRUD básico de cursos
  class CourseService {
    static init() {
      if (!StorageService.get('courses')) {
        const seed = [
          {
            id: 1,
            title: 'Reciclagem Criativa: Arte com Plásticos',
            desc: 'Aprenda a transformar plásticos descartáveis em peças de arte e decoração.',
            category: 'Reciclagem',
            price: 0,
            image: 'https://via.placeholder.com/200?text=Arte+Plastico',
            video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Substitua por um vídeo real se disponível
            instructor: 'Ana Verde'
          },
          {
            id: 2,
            title: 'Upcycling de Roupas: Moda Sustentável',
            desc: 'Descubra como reformar roupas usadas para criar peças únicas e ecológicas.',
            category: 'Sustentabilidade',
            price: 0,
            image: 'https://via.placeholder.com/200?text=Moda+Sustentavel',
            video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Substitua por um vídeo real se disponível
            instructor: 'Clara Mendes'
          }
        ];
        StorageService.set('courses', seed);
      }
    }

    static getAll() {
      return StorageService.get('courses') || [];
    }

    static getById(id) {
      return this.getAll().find(c => c.id === id);
    }
  }

 
  function renderCourses() {
    const courses = CourseService.getAll();

    
    const categorySelect = document.getElementById('filter-category');
    const categories = [...new Set(courses.map(c => c.category))];
    categorySelect.innerHTML = `<option value="">Todas Categorias</option>` +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    function updateGrid() {
      const search = document.getElementById('search').value.toLowerCase();
      const selectedCategory = document.getElementById('filter-category').value;
      const filtered = courses.filter(c =>
        c.title.toLowerCase().includes(search) &&
        (selectedCategory ? c.category === selectedCategory : true)
      );
      const grid = document.getElementById('courses-grid');
      grid.innerHTML = filtered.map(c => `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${c.image}" class="card-img-top" alt="${c.title}">
            <div class="card-body text-center">
              <h5 class="card-title">${c.title}</h5>
              <p class="card-text">${c.category}</p>
              <p class="card-text">R$ ${c.price.toFixed(2)}</p>
              <a href="#course-${c.id}" class="btn btn-dark btn-view">Ver Curso</a>
            </div>
          </div>
        </div>
      `).join('');
    }

    document.getElementById('search').addEventListener('input', updateGrid);
    document.getElementById('filter-category').addEventListener('change', updateGrid);
    updateGrid();
  }

  
  function renderCourseDetail(id) {
    const c = CourseService.getById(id);
    if (!c) {
      location.hash = '#courses';
      return;
    }
    const detailSection = document.getElementById('course-detail');
    detailSection.innerHTML = `
      <div class="mb-4">
        <a href="#courses" class="btn btn-secondary mb-3">Voltar aos Cursos</a>
        <h2>${c.title}</h2>
        <video src="${c.video}" class="img-fluid mb-3" controls></video>
        <p>${c.desc}</p>
        <p><strong>Instrutor:</strong> ${c.instructor}</p>
        <p><strong>Preço:</strong> R$ ${c.price.toFixed(2)}</p>
      </div>
    `;
  }

  // Função para ocultar todas as seções
  function hideAllSections() {
    document.getElementById('home').classList.add('d-none');
    document.getElementById('courses').classList.add('d-none');
    document.getElementById('course-detail').classList.add('d-none');
  }

  // Roteamento simples via hash para exibir a seção desejada
  function router() {
    hideAllSections();
    const hash = location.hash || '#home';
    const parts = hash.replace('#','').split('-');
    const route = parts[0];

    if (route === 'home') {
      document.getElementById('home').classList.remove('d-none');
    } else if (route === 'courses') {
      document.getElementById('courses').classList.remove('d-none');
      renderCourses();
    } else if (route === 'course') {
      document.getElementById('course-detail').classList.remove('d-none');
      const courseId = Number(parts[1]);
      renderCourseDetail(courseId);
    } else {
      document.getElementById('home').classList.remove('d-none');
    }
  }

  // Inicialização e eventos do roteador
  window.addEventListener('load', () => {
    CourseService.init();
    router();
  });
  window.addEventListener('hashchange', router);
})();
