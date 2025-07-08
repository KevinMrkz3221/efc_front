import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { colors, tailwindClasses } from '../theme';

export default function LandingAnimated() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const observerRef = useRef(null);
  const sectionsRef = useRef({});

  // Configurar Intersection Observer para animaciones y navegación activa
  useEffect(() => {
    // Observer para animaciones de elementos
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.dataset.animate;
            if (elementId) {
              setVisibleElements(prev => new Set([...prev, elementId]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observer para navegación activa
    const navigationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px'
      }
    );

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => animationObserver.observe(el));

    // Observar secciones para navegación
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => navigationObserver.observe(section));

    return () => {
      animationObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, []);

  // Efecto de scroll para navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll para navegación
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    setContactForm({ name: '', email: '', company: '', message: '' });
  };

  // Clase de animación condicional
  const getAnimationClass = (elementId, baseClass = '') => {
    return visibleElements.has(elementId) 
      ? `${baseClass} animate-fade-in-up opacity-100 translate-y-0` 
      : `${baseClass} opacity-0 translate-y-8`;
  };

  // Estadísticas animadas
  const stats = [
    { number: '500+', label: 'Agentes Aduanales', icon: '🏢' },
    { number: '15,000+', label: 'Pedimentos Procesados', icon: '📋' },
    { number: '99.9%', label: 'Uptime Garantizado', icon: '⚡' },
    { number: '24/7', label: 'Soporte Especializado', icon: '🛡️' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F4F7' }}>
      {/* Navbar flotante con efectos */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">
                  <span 
                    className="bg-clip-text text-transparent"
                    style={{ 
                      background: `linear-gradient(to right, #1B2A41, #4DA6FF)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    EFC
                  </span>
                </h1>
              </div>
              <nav className="hidden md:flex ml-10 space-x-8">
                {[
                  { id: 'inicio', label: 'Inicio' },
                  { id: 'estadisticas', label: 'Confianza' },
                  { id: 'caracteristicas', label: 'Características' },
                  { id: 'testimonios', label: 'Testimonios' },
                  { id: 'precios', label: 'Precios' },
                  { id: 'contacto', label: 'Contacto' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 group`}
                    style={{
                      color: activeSection === item.id
                        ? '#1B2A41'
                        : isScrolled
                        ? '#333333'
                        : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = isScrolled ? '#1B2A41' : '#4DA6FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== item.id) {
                        e.target.style.color = isScrolled ? '#333333' : 'white';
                      }
                    }}
                  >
                    {item.label}
                    <span 
                      className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                        activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                      style={{ backgroundColor: '#1B2A41' }}
                    ></span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-white"
                style={{
                  background: 'linear-gradient(to right, #1B2A41, #4DA6FF)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #162234, #1976D2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #1B2A41, #4DA6FF)';
                }}
              >
                Acceder
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section con efectos de gradiente animado */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background con gradientes animados */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1B2A41 0%, #263549 50%, #1976D2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="space-y-8">
            <h1 
              data-animate="hero-title"
              className={`text-5xl sm:text-6xl md:text-7xl font-extrabold text-white transition-all duration-1000 ${
                visibleElements.has('hero-title') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <span className="block">
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    background: 'linear-gradient(to right, white, #64B5F6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  EFC
                </span>
              </span>
              <span 
                className="block text-3xl sm:text-4xl md:text-5xl mt-4 bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(to right, #64B5F6, white)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Para Agentes Aduanales
              </span>
              <span 
                className="block text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(to right, white, #64B5F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                e Importadores
              </span>
            </h1>
            
            <p 
              data-animate="hero-subtitle"
              className={`text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
                visibleElements.has('hero-subtitle') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ color: '#64B5F6' }}
            >
              La plataforma líder desarrollada por 
              <span className="font-bold text-white"> @AduanaSoft</span> para 
              <span className="font-semibold" style={{ color: '#FF9800' }}> digitalizar y optimizar</span> 
              {' '}todos tus procesos de comercio exterior con tecnología de vanguardia
            </p>
            
            <div 
              data-animate="hero-buttons"
              className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${
                visibleElements.has('hero-buttons') 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <Link
                to="/login"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                style={{
                  color: '#1B2A41',
                  background: 'linear-gradient(to right, white, #F2F4F7)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #F2F4F7, white)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, white, #F2F4F7)';
                }}
              >
                <span>Comenzar Ahora</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <button 
                onClick={() => scrollToSection('caracteristicas')}
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ver Demo</span>
              </button>
            </div>

            {/* Floating cards con efectos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: '🚀', title: 'Rápido', desc: 'Procesamiento instantáneo' },
                { icon: '🔒', title: 'Seguro', desc: 'Cifrado de nivel bancario' },
                { icon: '📊', title: 'Inteligente', desc: 'IA para optimización' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  data-animate={`hero-card-${index}`}
                  className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    visibleElements.has(`hero-card-${index}`) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${700 + index * 200}ms` }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm" style={{ color: '#64B5F6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator animado */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            onClick={() => scrollToSection('estadisticas')}
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Sección de Estadísticas y Confianza */}
      <section id="estadisticas" className="py-20" style={{ background: 'linear-gradient(to right, #F2F4F7, white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="stats-header"
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has('stats-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#333333' }}>
              Más de <span style={{ color: '#1B2A41' }}>500 empresas</span> confían en nosotros
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#7A7A7A' }}>
              Desarrollado por <span className="font-bold" style={{ color: '#1B2A41' }}>@AduanaSoft</span>, 
              líderes en tecnología aduanal con más de 10 años de experiencia
            </p>
          </div>

          {/* Stats con animaciones */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                data-animate={`stat-${index}`}
                className={`text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-105 border border-gray-100 ${
                  visibleElements.has(`stat-${index}`) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-10 scale-95'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4 animate-pulse">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#1B2A41' }}>{stat.number}</div>
                <div className="font-medium" style={{ color: '#7A7A7A' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AduanaSoft Info */}
          <div 
            data-animate="aduanasoft-info"
            className={`rounded-3xl p-8 md:p-12 text-white transition-all duration-1000 ${
              visibleElements.has('aduanasoft-info') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ background: 'linear-gradient(to right, #1B2A41, #263549)' }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Acerca de AduanaSoft</h3>
                <div className="space-y-4 text-indigo-100">
                  {[
                    "10+ años especializados en software aduanal",
                    "Equipo experto en comercio exterior y tecnología",
                    "Certificación SAT y cumplimiento normativo total",
                    "Soporte 24/7 con especialistas aduanales"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p><strong>{item.split(' ')[0]} {item.split(' ')[1]}</strong> {item.split(' ').slice(2).join(' ')}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="text-6xl mb-4">🏆</div>
                  <h4 className="text-2xl font-bold mb-2">Líder del Mercado</h4>
                  <p className="text-indigo-100">
                    Reconocidos como la mejor solución tecnológica para agentes aduanales en México
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características con efectos interactivos */}
      <section id="caracteristicas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="features-header"
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has('features-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Soluciones Especializadas para Comercio Exterior
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas diseñadas específicamente para las necesidades de agentes aduanales e importadores
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Gestión de Pedimentos',
                description: 'Administra pedimentos de importación y exportación, documentos aduanales, clasificaciones arancelarias y toda la documentación requerida por el SAT.',
                features: ['Validación automática SAT', 'Clasificación arancelaria', 'Cálculo de impuestos', 'Trazabilidad completa']
              },
              {
                icon: '🏢',
                title: 'Control por Organización',
                description: 'Gestiona múltiples clientes importadores con espacios de trabajo separados, permisos granulares y control total sobre el acceso a la información.',
                features: ['Multi-tenancy', 'Roles y permisos', 'Auditoría completa', 'Segregación de datos']
              },
              {
                icon: '📊',
                title: 'Reportes Aduanales',
                description: 'Genera reportes especializados para auditorías, seguimiento de operaciones aduanales, estadísticas de importación y cumplimiento normativo.',
                features: ['Dashboards en tiempo real', 'Exportación múltiple', 'KPIs personalizados', 'Alertas automáticas']
              }
            ].map((feature, index) => (
              <div 
                key={index}
                data-animate={`feature-${index}`}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:scale-105 ${
                  visibleElements.has(`feature-${index}`) 
                    ? 'opacity-100 translate-y-0 rotate-0' 
                    : 'opacity-0 translate-y-10 rotate-3'
                }`}
                style={{ 
                  transitionDelay: `${index * 300}ms`,
                  borderColor: visibleElements.has(`feature-${index}`) ? '#4DA6FF' : '#e5e7eb'
                }}
              >
                <div className="p-8">
                  <div className={`text-5xl mb-6 transition-all duration-500 ${
                    visibleElements.has(`feature-${index}`) 
                      ? 'transform scale-100 rotate-0' 
                      : 'transform scale-75 rotate-12'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 transition-colors duration-300" style={{ 
                    color: visibleElements.has(`feature-${index}`) ? '#1B2A41' : '#333333' 
                  }}>
                    {feature.title}
                  </h3>
                  <p className="mb-6 leading-relaxed" style={{ color: '#7A7A7A' }}>
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm" style={{ color: '#7A7A7A' }}>
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#2E7D32' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 transition-colors duration-300" style={{ 
                  background: 'linear-gradient(to right, #F2F4F7, #FFFFFF)' 
                }}>
                  <button className="font-semibold text-sm transition-colors duration-200" style={{ 
                    color: '#1B2A41' 
                  }}>
                    Conocer más →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20" style={{ background: 'linear-gradient(135deg, #F2F4F7, #FFFFFF)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="testimonials-header"
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has('testimonials-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-extrabold mb-4" style={{ color: '#333333' }}>
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl" style={{ color: '#7A7A7A' }}>
              Testimonios reales de agentes aduanales que han transformado su operación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Carlos Mendoza',
                company: 'Agente Aduanal 1234',
                image: '👨‍💼',
                testimonial: 'EFC revolucionó nuestra operación. Reducimos 70% el tiempo en procesar pedimentos y eliminamos errores manuales.',
                rating: 5
              },
              {
                name: 'María González',
                company: 'Importadora Global SA',
                image: '👩‍💼',
                testimonial: 'La plataforma más completa del mercado. El soporte de AduanaSoft es excepcional, entienden perfectamente nuestras necesidades.',
                rating: 5
              },
              {
                name: 'Roberto Silva',
                company: 'Comercio Exterior RSC',
                image: '👨‍💻',
                testimonial: 'Migramos de sistemas obsoletos a EFC y fue la mejor decisión. Ahora somos más eficientes y competitivos.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                data-animate={`testimonial-${index}`}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-700 p-8 border border-gray-100 hover:scale-105 ${
                  visibleElements.has(`testimonial-${index}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold" style={{ color: '#333333' }}>{testimonial.name}</h4>
                    <p className="text-sm" style={{ color: '#7A7A7A' }}>{testimonial.company}</p>
                  </div>
                </div>
                <p className="mb-4 italic" style={{ color: '#333333' }}>"{testimonial.testimonial}"</p>
                <div className="flex" style={{ color: '#F57C00' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            data-animate="pricing-header"
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleElements.has('pricing-header') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Planes diseñados para tu crecimiento
            </h2>
            <p className="text-xl text-gray-600">
              Desde agentes independientes hasta grandes corporativos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$2,999',
                period: '/mes',
                description: 'Perfecto para agentes aduanales independientes',
                features: [
                  'Hasta 50 pedimentos/mes',
                  '5 GB almacenamiento',
                  'Soporte por email',
                  'Reportes básicos',
                  '2 usuarios'
                ],
                popular: false
              },
              {
                name: 'Professional',
                price: '$5,999',
                period: '/mes',
                description: 'Ideal para agencias medianas',
                features: [
                  'Hasta 200 pedimentos/mes',
                  '20 GB almacenamiento',
                  'Soporte prioritario',
                  'Reportes avanzados',
                  '10 usuarios',
                  'API acceso',
                  'Integraciones SAT'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Personalizado',
                period: '',
                description: 'Para grandes corporativos',
                features: [
                  'Pedimentos ilimitados',
                  'Almacenamiento ilimitado',
                  'Soporte 24/7 dedicado',
                  'Reportes personalizados',
                  'Usuarios ilimitados',
                  'API completa',
                  'Implementación dedicada',
                  'SLA garantizado'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index}
                data-animate={`plan-${index}`}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-700 hover:scale-105 ${
                  plan.popular 
                    ? 'shadow-xl' 
                    : 'border-gray-200 bg-white shadow-lg hover:shadow-xl'
                } ${
                  visibleElements.has(`plan-${index}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  borderColor: plan.popular ? '#1B2A41' : '#e5e7eb',
                  background: plan.popular ? 'linear-gradient(to bottom, #F2F4F7, white)' : 'white'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse" style={{
                      background: 'linear-gradient(to right, #1B2A41, #263549)'
                    }}>
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#333333' }}>{plan.name}</h3>
                  <p className="mb-4" style={{ color: '#7A7A7A' }}>{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold" style={{ color: '#1B2A41' }}>{plan.price}</span>
                    <span style={{ color: '#7A7A7A' }}>{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => scrollToSection('contacto')}
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Prueba'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative py-20 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1B2A41 0%, #263549 50%, #1B2A41 100%)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%234DA6FF' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20" style={{ backgroundColor: '#4DA6FF' }}></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full opacity-15" style={{ backgroundColor: '#F57C00' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: '#2E7D32' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              ¿Listo para <span style={{ color: '#4DA6FF' }}>transformar</span> tu operación aduanal?
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: '#64B5F6' }}>
              Únete a más de 500 empresas que ya optimizaron sus procesos con EFC
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div 
              data-animate="contact-info"
              className={`transition-all duration-1000 ${
                visibleElements.has('contact-info') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              {/* Card de información de contacto */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Hablemos de tu proyecto
                  </h3>
                  <p className="text-lg" style={{ color: '#64B5F6' }}>
                    Nuestros expertos en comercio exterior están listos para ayudarte
                  </p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { 
                      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', 
                      title: 'Teléfono', 
                      info: '+52 (55) 1234-5678',
                      subtitle: 'Lun - Vie, 9:00 AM - 7:00 PM'
                    },
                    { 
                      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 
                      title: 'Email', 
                      info: 'contacto@aduanasoft.com',
                      subtitle: 'Respuesta en menos de 2 horas'
                    },
                    { 
                      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', 
                      title: 'Oficinas', 
                      info: 'Ciudad de México, México',
                      subtitle: 'Visitas con cita previa'
                    }
                  ].map((contact, idx) => (
                    <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full" style={{ backgroundColor: '#4DA6FF' }}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={contact.icon} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">{contact.title}</h4>
                        <p className="font-semibold mb-1" style={{ color: '#4DA6FF' }}>{contact.info}</p>
                        <p className="text-sm" style={{ color: '#64B5F6' }}>{contact.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Botón adicional para WhatsApp */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <a 
                    href="#" 
                    className="flex items-center justify-center w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(45deg, #25D366, #128C7E)'
                    }}
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Chatear por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div 
              data-animate="contact-form"
              className={`bg-white rounded-2xl shadow-2xl p-8 transition-all duration-1000 ${
                visibleElements.has('contact-form') 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Solicita una demostración</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{ 
                      focusRingColor: '#4DA6FF',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4DA6FF'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Email corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    onFocus={(e) => e.target.style.borderColor = '#4DA6FF'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="tu@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    onFocus={(e) => e.target.style.borderColor = '#4DA6FF'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#333333' }}>
                    Mensaje
                  </label>
                  <textarea
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    onFocus={(e) => e.target.style.borderColor = '#4DA6FF'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Cuéntanos sobre tu operación aduanal..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(to right, #1B2A41, #263549)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #263549, #1B2A41)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #1B2A41, #263549)';
                  }}
                >
                  Enviar solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: '#1B2A41' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span style={{
                  background: 'linear-gradient(to right, #4DA6FF, #64B5F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  EFC
                </span>
              </h3>
              <p className="mb-4 max-w-md" style={{ color: '#7A7A7A' }}>
                La plataforma líder para agentes aduanales e importadores, desarrollada por 
                <span className="font-semibold" style={{ color: '#4DA6FF' }}> @AduanaSoft</span> con más de 10 años de experiencia.
              </p>
              <div className="flex space-x-4">
                {['M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
                'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z',
                'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'].map((path, idx) => (
                  <a key={idx} href="#" className="transition-colors duration-200" style={{ color: '#7A7A7A' }}
                     onMouseEnter={(e) => e.target.style.color = 'white'}
                     onMouseLeave={(e) => e.target.style.color = '#7A7A7A'}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('caracteristicas')} className="hover:text-white transition-colors duration-200">Características</button></li>
                <li><button onClick={() => scrollToSection('precios')} className="hover:text-white transition-colors duration-200">Precios</button></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integraciónes</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('contacto')} className="hover:text-white transition-colors duration-200">Contacto</button></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 EFC by <span className="font-semibold text-indigo-400">@AduanaSoft</span>. 
              Todos los derechos reservados. | Solución especializada para Agentes Aduanales e Importadores.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
