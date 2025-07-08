import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Efecto de scroll para navbar y detección de secciones activas
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detectar sección activa
      const sections = ['inicio', 'estadisticas', 'caracteristicas', 'testimonios', 'precios', 'contacto'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }

      // Detectar elementos visibles para animaciones
      const animatedElements = document.querySelectorAll('[data-animate]');
      const newVisibleElements = new Set(visibleElements);
      
      animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !visibleElements.has(element.dataset.animate)) {
          newVisibleElements.add(element.dataset.animate);
        }
      });

      if (newVisibleElements.size !== visibleElements.size) {
        setVisibleElements(newVisibleElements);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger inicial
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, visibleElements]);

  // Smooth scroll para navegación
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    setContactForm({ name: '', email: '', company: '', message: '' });
  };

  // Estadísticas animadas
  const stats = [
    { number: '500+', label: 'Agentes Aduanales', icon: '🏢' },
    { number: '15,000+', label: 'Pedimentos Procesados', icon: '📋' },
    { number: '99.9%', label: 'Uptime Garantizado', icon: '⚡' },
    { number: '24/7', label: 'Soporte Especializado', icon: '🛡️' }
  ];

  return (
    <div className="min-h-screen bg-white">
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
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    EFC
                  </span>
                </h1>
              </div>
              <nav className="hidden md:flex ml-10 space-x-8">
                {[
                  { id: 'inicio', label: 'Inicio' },
                  { id: 'caracteristicas', label: 'Características' },
                  { id: 'estadisticas', label: 'Confianza' },
                  { id: 'testimonios', label: 'Testimonios' },
                  { id: 'precios', label: 'Precios' },
                  { id: 'contacto', label: 'Contacto' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      activeSection === item.id
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : isScrolled
                        ? 'text-gray-700 hover:text-indigo-600'
                        : 'text-white hover:text-indigo-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-8">
              <span className="block">
                <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  EFC
                </span>
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl mt-4 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Para Agentes Aduanales
              </span>
              <span className="block text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                e Importadores
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-indigo-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              La plataforma líder desarrollada por 
              <span className="font-bold text-white"> @AduanaSoft</span> para 
              <span className="font-semibold text-yellow-300"> digitalizar y optimizar</span> 
              {' '}todos tus procesos de comercio exterior con tecnología de vanguardia
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/login"
                className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full text-indigo-900 bg-gradient-to-r from-white to-indigo-50 hover:from-indigo-50 hover:to-white transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
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
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-indigo-200 text-sm">{feature.desc}</p>
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
      <section id="estadisticas" className="py-20 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Más de <span className="text-indigo-600">500 empresas</span> confían en nosotros
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desarrollado por <span className="font-bold text-indigo-600">@AduanaSoft</span>, 
              líderes en tecnología aduanal con más de 10 años de experiencia
            </p>
          </div>

          {/* Stats con animaciones */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* AduanaSoft Info */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Acerca de AduanaSoft</h3>
                <div className="space-y-4 text-indigo-100">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p><strong>10+ años</strong> especializados en software aduanal</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p><strong>Equipo experto</strong> en comercio exterior y tecnología</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p><strong>Certificación SAT</strong> y cumplimiento normativo total</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p><strong>Soporte 24/7</strong> con especialistas aduanales</p>
                  </div>
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
          <div className="text-center mb-16">
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
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:scale-105"
              >
                <div className="p-8">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors duration-300">
                  <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors duration-200">
                    Conocer más →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600">
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
                <div className="flex text-yellow-400">
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
          <div className="text-center mb-16">
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
                className={`relative rounded-2xl border-2 p-8 hover:scale-105 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-50 to-white shadow-xl' 
                    : 'border-gray-200 bg-white hover:border-indigo-200 shadow-lg hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
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
      <section id="contacto" className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-extrabold mb-6">
                ¿Listo para transformar tu operación aduanal?
              </h2>
              <p className="text-xl text-indigo-200 mb-8">
                Contáctanos y descubre cómo EFC puede optimizar tus procesos de comercio exterior
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Teléfono</h4>
                    <p className="text-indigo-200">+52 (55) 1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-indigo-200">contacto@aduanasoft.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Oficinas</h4>
                    <p className="text-indigo-200">Ciudad de México, México</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicita una demostración</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="tu@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Cuéntanos sobre tu operación aduanal..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Enviar solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  EFC
                </span>
              </h3>
              <p className="text-gray-400 mb-4 max-w-md">
                La plataforma líder para agentes aduanales e importadores, desarrollada por 
                <span className="font-semibold text-indigo-400"> @AduanaSoft</span> con más de 10 años de experiencia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#caracteristicas" className="hover:text-white transition-colors duration-200">Características</a></li>
                <li><a href="#precios" className="hover:text-white transition-colors duration-200">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integraciónes</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#contacto" className="hover:text-white transition-colors duration-200">Contacto</a></li>
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

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
