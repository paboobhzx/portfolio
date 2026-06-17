export const seedContent = {
  settings: {
    fullName: 'Pablo Costa',
    role: {
      en: 'Senior Cloud & Software Engineer',
      'pt-BR': 'Engenheiro Sênior de Software & Cloud',
    },
    location: 'Belo Horizonte, Brazil',
    profileImageUrl: '',
    profileInitials: 'PC',
    contacts: {
      email: 'pablobhz@gmail.com',
      github: 'https://github.com/paboobhzx',
      linkedin: 'https://linkedin.com/in/pablobhz',
    },
  },
  page: {
    pageId: 'home',
    blocks: [
      {
        type: 'headline',
        order: 0,
        content: {
          en: {
            title: 'I build cloud products from first idea to real production use.',
          },
          'pt-BR': {
            title: 'Eu projeto e entrego produtos em nuvem, da ideia até produção.',
          },
        },
      },
      {
        type: 'about',
        order: 1,
        content: {
          en: {
            title: 'About',
            text: 'I am a software engineer with 18 years in technology. In recent years, I have focused on AWS, serverless architecture, and building SaaS products from start to finish. I am fluent in English and available for remote roles in US and global teams.',
          },
          'pt-BR': {
            title: 'Sobre',
            text: 'Sou engenheiro de software com 18 anos de carreira em tecnologia. Nos últimos anos, meu foco está em AWS, arquitetura serverless e construção de produtos SaaS do início ao fim. Tenho inglês fluente e disponibilidade para posições remotas no Brasil e no exterior.',
          },
        },
      },
      {
        type: 'experience',
        order: 2,
        content: {
          en: {
            title: 'Professional Experience',
            items: [
              'PRODEMGE (2022–2026): moved legacy service platforms to hybrid cloud, improved delivery flow, and created live dashboards for business teams.',
              'Digital Information AG (2016–2022): modernized Swiss printing software, rebuilt core tools, and improved complex file and image workflows.',
              'ENotas (2019–2020): automated document processing and integrated fiscal and thermal printing workflows.',
            ],
          },
          'pt-BR': {
            title: 'Experiência Profissional',
            items: [
              'PRODEMGE (2022–2026): migração de plataformas legadas para nuvem híbrida, melhoria da esteira de entrega e criação de dashboards com dados ao vivo.',
              'Digital Information AG (2016–2022): modernização de software da indústria gráfica suíça, reconstrução de ferramentas centrais e melhoria de fluxos complexos de arquivos e imagem.',
              'ENotas (2019–2020): automação de processamento de documentos e integração de fluxos de impressão fiscal e térmica.',
            ],
          },
        },
      },
      {
        type: 'projects',
        order: 3,
        content: {
          en: {
            title: 'Project Explanations',
            items: [
              {
                name: 'COSMOFIT',
                summary: 'A workout platform for gyms and trainers who wanted to replace spreadsheets and chat-based routine management.',
                resources: 'AWS Lambda, API Gateway, DynamoDB, S3, Cognito, Amplify, EventBridge, Stripe, Terraform.',
                usage: 'Lambda runs core app actions, API Gateway exposes endpoints, DynamoDB stores users and workouts, S3 stores media, Cognito manages login, Amplify hosts the web app, EventBridge schedules background tasks, Stripe handles payments, and Terraform keeps everything consistent across environments.',
              },
              {
                name: 'SuperZap',
                summary: 'A multi-tenant WhatsApp CRM created for call-center managers who needed real-time visibility and message governance.',
                resources: 'Node.js on VPS, MySQL, Evolution API (Docker), Redis, AWS S3, AWS Cognito, Amplify, Cloudflare Tunnel.',
                usage: 'Node.js runs the main backend, MySQL stores tenant and conversation data, Evolution API connects WhatsApp operations, Redis keeps updates fast, S3 stores media files, Cognito controls access, Amplify serves the frontend, and Cloudflare Tunnel exposes secure access points.',
              },
              {
                name: 'SuperDoc',
                summary: 'A document processing platform built as a practical low-cost alternative for everyday file conversion and editing.',
                resources: 'AWS Lambda, API Gateway, DynamoDB, SQS, S3, Cognito, CloudFront, Amplify, Terraform.',
                usage: 'API Gateway receives requests, Lambda executes file operations, DynamoDB tracks jobs and user state, SQS coordinates background processing, S3 stores uploads and outputs, Cognito manages identities, CloudFront improves delivery speed, Amplify hosts the web app, and Terraform manages infrastructure setup.',
              },
            ],
          },
          'pt-BR': {
            title: 'Explicação dos Projetos',
            items: [
              {
                name: 'COSMOFIT',
                summary: 'Plataforma de treino para academias e personal trainers que queriam substituir rotinas em planilhas e mensagens.',
                resources: 'AWS Lambda, API Gateway, DynamoDB, S3, Cognito, Amplify, EventBridge, Stripe, Terraform.',
                usage: 'As Lambdas executam as ações principais, o API Gateway publica os endpoints, o DynamoDB guarda usuários e treinos, o S3 armazena mídias, o Cognito cuida do login, o Amplify hospeda o frontend, o EventBridge agenda tarefas, o Stripe processa pagamentos e o Terraform mantém os ambientes consistentes.',
              },
              {
                name: 'SuperZap',
                summary: 'CRM de WhatsApp multi-tenant criado para gestores de call center que precisavam de visibilidade em tempo real e controle das mensagens.',
                resources: 'Node.js em VPS, MySQL, Evolution API (Docker), Redis, AWS S3, AWS Cognito, Amplify, Cloudflare Tunnel.',
                usage: 'Node.js concentra a lógica principal, MySQL armazena dados de tenants e conversas, Evolution API conecta a operação de WhatsApp, Redis mantém atualizações rápidas, S3 guarda mídias, Cognito controla acesso, Amplify entrega o frontend e Cloudflare Tunnel publica acessos seguros.',
              },
              {
                name: 'SuperDoc',
                summary: 'Plataforma de processamento de documentos criada como alternativa prática e de baixo custo para conversões e edições comuns.',
                resources: 'AWS Lambda, API Gateway, DynamoDB, SQS, S3, Cognito, CloudFront, Amplify, Terraform.',
                usage: 'O API Gateway recebe solicitações, as Lambdas executam operações de arquivo, o DynamoDB acompanha jobs e estado do usuário, o SQS coordena processamento em segundo plano, o S3 guarda entradas e saídas, o Cognito gerencia identidades, o CloudFront melhora velocidade de entrega, o Amplify hospeda o web app e o Terraform organiza a infraestrutura.',
              },
            ],
          },
        },
      },
      {
        type: 'certifications',
        order: 4,
        content: {
          en: {
            title: 'Certifications',
            items: [
              'AWS Solutions Architect Associate (SAA-C03)',
              'AWS Data Engineer Associate (DEA-C01)',
              'AWS AI Practitioner (AIF-C01)',
              'Microsoft Azure Administrator (AZ-104)',
            ],
          },
          'pt-BR': {
            title: 'Certificações',
            items: [
              'AWS Solutions Architect Associate (SAA-C03)',
              'AWS Data Engineer Associate (DEA-C01)',
              'AWS AI Practitioner (AIF-C01)',
              'Microsoft Azure Administrator (AZ-104)',
            ],
          },
        },
      },
      {
        type: 'contact',
        order: 5,
        content: {
          en: {
            title: 'Contact',
            cta: 'Open to remote Senior Cloud, Platform, and Founding Engineer roles. Let us discuss your product roadmap.',
          },
          'pt-BR': {
            title: 'Contato',
            cta: 'Aberto a posições remotas como Senior Cloud, Platform e Founding Engineer. Vamos conversar sobre o roadmap do seu produto.',
          },
        },
      },
    ],
  },
}
