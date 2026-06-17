// Single source of truth for all visible copy. Both languages mirror the same shape.
// When you wire the CMS later, replace this file's exports with API-fed data of the same shape.

export const PROFILE = {
  name: 'Pablo Costa',
  role: 'Senior Engineer',
  location: 'Belo Horizonte, BR',
  email: 'pablobhz@gmail.com',
  whatsapp: '+55 31 99168-3587',
  whatsappLink: 'https://wa.me/5531991683587',
  linkedin: 'https://linkedin.com/in/pablobhz',
  github: 'https://github.com/pablobhz',
  website: 'https://pablobhz.cloud',
  status: 'Open to Work',
  avatar: '/profile.jpeg', // place file at public/profile.jpeg
  cvUrl: {
    en: '/resumes/CV_EN.pdf',
    pt: '/resumes/CV_PT.pdf',
  },
}

export const NAV_ITEMS = ['about', 'resume', 'portfolio', 'contact']

export const DICT = {
  en: {
    nav: {
      about: 'About',
      resume: 'Resume',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    ui: {
      search: 'Search',
      dark: 'Dark',
      light: 'Light',
      statusOpenToWork: 'Open to Work',
      labelEmail: 'EMAIL',
      labelLocation: 'LOCATION',
      labelStatus: 'STATUS',
      labelCv: 'CV',
      downloadCv: 'Download',
      showMore: 'Load more',
      showLess: 'Show less',
      all: 'All',
      certifications: 'Certifications',
      projects: 'Projects',
      badges: 'Badges',
      send: 'Send Message',
      namePlaceholder: 'Full name',
      emailPlaceholder: 'Email address',
      messagePlaceholder: 'Your message',
      messageSubject: 'Portfolio contact',
      whatIDo: "What I'm Doing",
      techStack: 'Tech Stack',
      clients: 'Clients',
      experience: 'Experience',
      education: 'Education',
      coreCompetencies: 'Core Competencies',
      toolsAndTech: 'Tools & Technologies',
      contactChannels: 'Get in Touch',
      contactForm: 'Contact Form',
      sectionTitleAbout: 'About',
      sectionTitleResume: 'Resume',
      sectionTitlePortfolio: 'Portfolio',
      sectionTitleContact: 'Contact',
    },
    about: {
      headline: 'Cloud engineering and SRE execution for resilient SaaS products and operations.',
      paragraphs: [
        'Cloud and software engineer with 10+ years delivering infrastructure, backend services, and operational reliability.',
        'Hands-on across architecture, Terraform, CI/CD, observability, and incident response for production systems.',
        'Experience covering SaaS products, support tooling, and distributed teams in Portuguese and English.',
      ],
      stats: [
        { value: '10+', label: 'Years of experience' },
        { value: '20+', label: 'Projects done' },
        { value: '20+', label: 'Technologies' },
        { value: '5+', label: 'Certifications' },
      ],
      services: [
        {
          title: 'Cloud Architecture',
          text: 'Designing AWS and hybrid cloud platforms end-to-end with infrastructure as code, security baselines, and cost governance.',
        },
        {
          title: 'Site Reliability',
          text: 'Operational excellence through observability, SLO-driven incident response, and resilient release engineering.',
        },
        {
          title: 'Platform Engineering',
          text: 'Reusable Terraform modules, CI/CD pipelines, and developer tooling that shortens the path from commit to production.',
        },
        {
          title: 'Technical Leadership',
          text: 'Mentoring engineers and structuring delivery plans that balance speed, quality, and long-term maintainability.',
        },
      ],
      stack: [
        'AWS', 'Terraform', 'Lambda', 'DynamoDB', 'API Gateway', 'S3', 'CloudFront',
        'Docker', 'GitHub Actions', 'Python', 'TypeScript', 'Node.js', 'React',
        'MySQL', 'Redis', 'Grafana', 'Prometheus',
      ],
      clients: ['PRODEMGE', 'Digital Information AG', 'ENotas', 'Pharmascience', 'IBMEC'],
    },
    resume: {
      stats: [
        { value: '10+', label: 'Years of experience' },
        { value: '20+', label: 'Projects done' },
        { value: '20+', label: 'Technologies' },
        { value: '5+', label: 'Certifications' },
      ],
      summary: [
        'Delivery-focused engineer combining cloud architecture with SRE practices and production support ownership.',
        'Builds reliable operational models from design through rollout, monitoring, and iterative hardening.',
      ],
      experience: [
        {
          period: '2022 – 2026',
          role: 'Senior Cloud & Software Engineer',
          company: 'PRODEMGE',
          description:
            'Hybrid cloud modernization, automation, and reliability-oriented delivery for large public-sector platforms.',
        },
        {
          period: '2016 – 2022',
          role: 'Software Engineer (Remote)',
          company: 'Digital Information AG',
          description:
            'Integration-heavy services for enterprise document workflows with rollback-safe deployments and observability.',
        },
        {
          period: '2019 – 2020',
          role: 'Systems Engineer',
          company: 'ENotas',
          description:
            'Fiscal automation pipelines and partner integrations using asynchronous processing and strict business validation.',
        },
        {
          period: '2008 – 2013',
          role: 'Earlier Roles',
          company: 'Pharmascience · IBMEC',
          description:
            'Foundational years in IT operations, support engineering, and internal application development.',
        },
      ],
      education: [
        {
          period: '2014',
          title: 'MSc in Software Engineering',
          school: 'Postgraduate specialization focused on software architecture and engineering management.',
        },
        {
          period: '2016 – 2020',
          title: 'BSc in Information Systems',
          school: 'Centro Universitário UNIBH.',
        },
        {
          period: '2010 – 2013',
          title: 'BSc in Computer Networks',
          school: 'Faculdade Estácio de Sá.',
        },
      ],
      competencies: [
        'Cloud architecture and reliability engineering',
        'Infrastructure as Code with Terraform',
        'Observability and incident readiness',
        'Backend services and integrations',
        'SaaS operations and multi-tenant systems',
      ],
      tools: [
        { name: 'Terraform', level: 'Advanced' },
        { name: 'AWS', level: 'Advanced' },
        { name: 'Grafana', level: 'Advanced' },
        { name: 'Prometheus', level: 'Intermediate' },
        { name: 'Docker', level: 'Advanced' },
        { name: 'Node.js', level: 'Advanced' },
        { name: 'Python', level: 'Intermediate' },
        { name: 'MySQL', level: 'Advanced' },
      ],
    },
    portfolio: {
      items: [
        { id: 'cert-saa', title: 'AWS SAA-C03', category: 'certifications', description: 'Solutions Architect Associate.', href: '#', coverClass: 'cover-1' },
        { id: 'cert-dea', title: 'AWS DEA-C01', category: 'certifications', description: 'Data Engineer Associate.', href: '#', coverClass: 'cover-2' },
        { id: 'cert-aif', title: 'AWS AIF-C01', category: 'certifications', description: 'AI Practitioner.', href: '#', coverClass: 'cover-3' },
        { id: 'cert-clf', title: 'AWS CLF-C02', category: 'certifications', description: 'Cloud Practitioner.', href: '#', coverClass: 'cover-4' },
        { id: 'cert-extra', title: 'Additional AWS Badge', category: 'certifications', description: 'Placeholder until artwork ships.', href: '#', coverClass: 'cover-5' },
        { id: 'proj-cosmofit', title: 'COSMOFIT', category: 'projects', description: 'Multi-tenant SaaS training platform on serverless AWS.', href: '#', coverClass: 'cover-6' },
        { id: 'proj-superzap', title: 'SuperZap', category: 'projects', description: 'WhatsApp CRM with real-time routing.', href: '#', coverClass: 'cover-7' },
        { id: 'proj-superdoc', title: 'SuperDoc', category: 'projects', description: 'Document processing platform with queues and orchestration.', href: '#', coverClass: 'cover-8' },
        { id: 'badge-1', title: 'Reliability Badge', category: 'badges', description: 'Placeholder for upcoming credential.', href: '#', coverClass: 'cover-9' },
        { id: 'badge-2', title: 'Automation Badge', category: 'badges', description: 'Placeholder for upcoming credential.', href: '#', coverClass: 'cover-10' },
      ],
    },
    contact: {
      intro: 'Reach out through any channel below, or send a message using the form.',
    },
  },
  pt: {
    nav: {
      about: 'Sobre',
      resume: 'Currículo',
      portfolio: 'Portfólio',
      contact: 'Contato',
    },
    ui: {
      search: 'Buscar',
      dark: 'Escuro',
      light: 'Claro',
      statusOpenToWork: 'Disponível',
      labelEmail: 'EMAIL',
      labelLocation: 'LOCALIZAÇÃO',
      labelStatus: 'STATUS',
      labelCv: 'CV',
      downloadCv: 'Baixar',
      showMore: 'Carregar mais',
      showLess: 'Mostrar menos',
      all: 'Tudo',
      certifications: 'Certificações',
      projects: 'Projetos',
      badges: 'Badges',
      send: 'Enviar Mensagem',
      namePlaceholder: 'Nome completo',
      emailPlaceholder: 'Endereço de email',
      messagePlaceholder: 'Sua mensagem',
      messageSubject: 'Contato pelo portfólio',
      whatIDo: 'O Que Eu Faço',
      techStack: 'Tech Stack',
      clients: 'Clientes',
      experience: 'Experiência',
      education: 'Formação',
      coreCompetencies: 'Competências',
      toolsAndTech: 'Ferramentas & Tecnologias',
      contactChannels: 'Entre em Contato',
      contactForm: 'Formulário de Contato',
      sectionTitleAbout: 'Sobre',
      sectionTitleResume: 'Currículo',
      sectionTitlePortfolio: 'Portfólio',
      sectionTitleContact: 'Contato',
    },
    about: {
      headline: 'Engenharia cloud e execução SRE para produtos SaaS e operações resilientes.',
      paragraphs: [
        'Engenheiro de cloud e software com mais de 10 anos entregando infraestrutura, serviços de backend e confiabilidade operacional.',
        'Atuação mão-na-massa em arquitetura, Terraform, CI/CD, observabilidade e resposta a incidentes em produção.',
        'Experiência com produtos SaaS, ferramentas de suporte e times distribuídos em português e inglês.',
      ],
      stats: [
        { value: '10+', label: 'Anos de experiência' },
        { value: '20+', label: 'Projetos entregues' },
        { value: '20+', label: 'Tecnologias' },
        { value: '5+', label: 'Certificações' },
      ],
      services: [
        {
          title: 'Arquitetura Cloud',
          text: 'Desenho ponta a ponta de plataformas AWS e híbridas com infraestrutura como código, segurança e governança de custos.',
        },
        {
          title: 'Confiabilidade',
          text: 'Excelência operacional com observabilidade, resposta a incidentes guiada por SLO e engenharia de release resiliente.',
        },
        {
          title: 'Platform Engineering',
          text: 'Módulos Terraform reutilizáveis, pipelines CI/CD e ferramentas internas que encurtam o caminho do commit à produção.',
        },
        {
          title: 'Liderança Técnica',
          text: 'Mentoria de engenheiros e estruturação de planos de entrega equilibrando velocidade, qualidade e manutenibilidade.',
        },
      ],
      stack: [
        'AWS', 'Terraform', 'Lambda', 'DynamoDB', 'API Gateway', 'S3', 'CloudFront',
        'Docker', 'GitHub Actions', 'Python', 'TypeScript', 'Node.js', 'React',
        'MySQL', 'Redis', 'Grafana', 'Prometheus',
      ],
      clients: ['PRODEMGE', 'Digital Information AG', 'ENotas', 'Pharmascience', 'IBMEC'],
    },
    resume: {
      stats: [
        { value: '10+', label: 'Anos de experiência' },
        { value: '20+', label: 'Projetos entregues' },
        { value: '20+', label: 'Tecnologias' },
        { value: '5+', label: 'Certificações' },
      ],
      summary: [
        'Engenheiro focado em entrega, combinando arquitetura cloud, práticas de SRE e ownership de suporte em produção.',
        'Constrói modelos operacionais confiáveis desde o desenho até rollout, monitoramento e endurecimento iterativo.',
      ],
      experience: [
        {
          period: '2022 – 2026',
          role: 'Engenheiro Sênior de Cloud e Software',
          company: 'PRODEMGE',
          description:
            'Modernização de nuvem híbrida, automação e entrega orientada à confiabilidade para plataformas públicas de grande escala.',
        },
        {
          period: '2016 – 2022',
          role: 'Engenheiro de Software (Remoto)',
          company: 'Digital Information AG',
          description:
            'Serviços de integração para fluxos documentais corporativos, com deploy seguro para rollback e observabilidade.',
        },
        {
          period: '2019 – 2020',
          role: 'Engenheiro de Sistemas',
          company: 'ENotas',
          description:
            'Pipelines de automação fiscal e integrações de parceiros com processamento assíncrono e validação rigorosa.',
        },
        {
          period: '2008 – 2013',
          role: 'Cargos Anteriores',
          company: 'Pharmascience · IBMEC',
          description:
            'Anos de formação em operações de TI, engenharia de suporte e desenvolvimento de aplicações internas.',
        },
      ],
      education: [
        {
          period: '2014',
          title: 'Pós em Engenharia de Software',
          school: 'Especialização focada em arquitetura de software e gestão de engenharia.',
        },
        {
          period: '2016 – 2020',
          title: 'Bacharelado em Sistemas de Informação',
          school: 'Centro Universitário UNIBH.',
        },
        {
          period: '2010 – 2013',
          title: 'Bacharelado em Redes de Computadores',
          school: 'Faculdade Estácio de Sá.',
        },
      ],
      competencies: [
        'Arquitetura cloud e engenharia de confiabilidade',
        'Infraestrutura como Código com Terraform',
        'Observabilidade e prontidão para incidentes',
        'Serviços de backend e integrações',
        'Operações SaaS e sistemas multi-tenant',
      ],
      tools: [
        { name: 'Terraform', level: 'Avançado' },
        { name: 'AWS', level: 'Avançado' },
        { name: 'Grafana', level: 'Avançado' },
        { name: 'Prometheus', level: 'Intermediário' },
        { name: 'Docker', level: 'Avançado' },
        { name: 'Node.js', level: 'Avançado' },
        { name: 'Python', level: 'Intermediário' },
        { name: 'MySQL', level: 'Avançado' },
      ],
    },
    portfolio: {
      items: [
        { id: 'cert-saa', title: 'AWS SAA-C03', category: 'certifications', description: 'Solutions Architect Associate.', href: '#', coverClass: 'cover-1' },
        { id: 'cert-dea', title: 'AWS DEA-C01', category: 'certifications', description: 'Data Engineer Associate.', href: '#', coverClass: 'cover-2' },
        { id: 'cert-aif', title: 'AWS AIF-C01', category: 'certifications', description: 'AI Practitioner.', href: '#', coverClass: 'cover-3' },
        { id: 'cert-clf', title: 'AWS CLF-C02', category: 'certifications', description: 'Cloud Practitioner.', href: '#', coverClass: 'cover-4' },
        { id: 'cert-extra', title: 'Badge AWS Extra', category: 'certifications', description: 'Placeholder até a arte final.', href: '#', coverClass: 'cover-5' },
        { id: 'proj-cosmofit', title: 'COSMOFIT', category: 'projects', description: 'SaaS multi-tenant de treino em AWS serverless.', href: '#', coverClass: 'cover-6' },
        { id: 'proj-superzap', title: 'SuperZap', category: 'projects', description: 'CRM para WhatsApp com roteamento em tempo real.', href: '#', coverClass: 'cover-7' },
        { id: 'proj-superdoc', title: 'SuperDoc', category: 'projects', description: 'Plataforma de processamento documental com filas e orquestração.', href: '#', coverClass: 'cover-8' },
        { id: 'badge-1', title: 'Badge de Confiabilidade', category: 'badges', description: 'Placeholder para credencial futura.', href: '#', coverClass: 'cover-9' },
        { id: 'badge-2', title: 'Badge de Automação', category: 'badges', description: 'Placeholder para credencial futura.', href: '#', coverClass: 'cover-10' },
      ],
    },
    contact: {
      intro: 'Fale comigo por qualquer canal abaixo ou envie uma mensagem pelo formulário.',
    },
  },
}

export const SUPPORTED_LANGS = ['en', 'pt']
export const DEFAULT_LANG = 'en'
