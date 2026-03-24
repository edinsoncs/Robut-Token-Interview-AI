import Link from "next/link";
import { 
  Bot, 
  Zap, 
  Clock, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Play,
  Star,
  Shield,
  Globe,
  Sparkles,
  MessageSquare,
  Brain,
  Target
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                ROBUT
              </span>
              <span className="text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">
                AI Interviews
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Caracteristicas
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Como Funciona
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Precios
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 transition-colors"
            >
              Iniciar Sesion
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">
                Impulsado por Inteligencia Artificial
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-6 text-balance">
              Entrevistas con IA que{" "}
              <span className="text-blue-500">transforman</span>{" "}
              tu seleccion
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              Automatiza tus procesos de contratacion con entrevistadores de IA 
              inteligentes que evaluan candidatos 24/7, ahorrando tiempo y 
              mejorando la calidad de tus contrataciones.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/sign-up"
                className="flex items-center gap-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                type="button"
                className="flex items-center gap-2 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-8 py-4 rounded-xl transition-colors"
              >
                <Play className="w-5 h-5" />
                Ver Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Sin tarjeta de credito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>10 entrevistas gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Configuracion en minutos</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* AI Interviewer Card */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Sofia - IA Interviewer</h3>
                      <p className="text-gray-400 text-sm">Technical Recruiter</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs">En linea</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-300 text-sm">
                        "Cuentame sobre tu experiencia con desarrollo web y que tecnologias has utilizado..."
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-blue-500/30 rounded-full">
                        <div className="h-1 bg-blue-500 rounded-full w-3/4" />
                      </div>
                      <span className="text-gray-400 text-xs">75%</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Card */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-white font-semibold mb-4">Metricas en Tiempo Real</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Entrevistas Hoy</span>
                      <span className="text-white font-semibold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Candidatos Evaluados</span>
                      <span className="text-white font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Tiempo Promedio</span>
                      <span className="text-white font-semibold">12 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Tasa de Completacion</span>
                      <span className="text-green-400 font-semibold">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-6 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8">
            Empresas que confian en ROBUT para sus procesos de seleccion
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            {["TechCorp", "InnovateLab", "StartupX", "GlobalHR", "FutureTech"].map((company) => (
              <div key={company} className="text-xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Caracteristicas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
              Todo lo que necesitas para contratar mejor
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas poderosas que automatizan y mejoran cada paso de tu proceso de seleccion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                title: "Entrevistadores IA Personalizables",
                description: "Crea entrevistadores con personalidades unicas, niveles de empatia y estilos de comunicacion adaptados a tu empresa."
              },
              {
                icon: Clock,
                title: "Disponibilidad 24/7",
                description: "Tus entrevistadores IA trabajan sin descanso, permitiendo a los candidatos completar entrevistas en su horario preferido."
              },
              {
                icon: BarChart3,
                title: "Analisis Detallados",
                description: "Obtien insights profundos sobre cada candidato con puntuaciones, resumenes y comparaciones automaticas."
              },
              {
                icon: MessageSquare,
                title: "Conversaciones Naturales",
                description: "IA avanzada que mantiene dialogos fluidos y hace preguntas de seguimiento inteligentes."
              },
              {
                icon: Target,
                title: "Evaluacion Objetiva",
                description: "Elimina sesgos inconscientes con criterios de evaluacion consistentes y estandarizados."
              },
              {
                icon: Globe,
                title: "Multi-idioma",
                description: "Entrevistas en espanol, ingles y mas idiomas para alcanzar talento global."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Como Funciona</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comienza en 3 simples pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Configurar tu primera entrevista con IA toma menos de 5 minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crea tu Entrevistador",
                description: "Personaliza la personalidad, tono y estilo de tu entrevistador IA segun las necesidades de tu empresa."
              },
              {
                step: "02",
                title: "Configura la Entrevista",
                description: "Define las preguntas, objetivos y criterios de evaluacion. La IA generara preguntas de seguimiento automaticamente."
              },
              {
                step: "03",
                title: "Comparte y Analiza",
                description: "Envia el enlace a tus candidatos y recibe resultados detallados con puntuaciones y resumenes."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Testimonios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "ROBUT redujo nuestro tiempo de pre-seleccion en un 80%. Ahora solo entrevistamos personalmente a los candidatos que realmente encajan.",
                author: "Maria Garcia",
                role: "Head of HR, TechCorp"
              },
              {
                quote: "La calidad de las evaluaciones es impresionante. La IA detecta matices que a veces pasamos por alto en entrevistas tradicionales.",
                author: "Carlos Rodriguez",
                role: "CEO, StartupX"
              },
              {
                quote: "Poder entrevistar candidatos 24/7 nos permitio acceder a talento en diferentes zonas horarias sin complicaciones.",
                author: "Ana Martinez",
                role: "Talent Acquisition, GlobalHR"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Precios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planes flexibles para cada necesidad
            </h2>
            <p className="text-xl text-gray-600">
              Comienza gratis, escala cuando lo necesites
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gratis</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["10 respuestas/mes", "1 entrevistador IA", "Analisis basico", "Soporte por email"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-blue-500 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-white/20 text-xs font-medium rounded-bl-xl">
                Popular
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-blue-200">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Respuestas ilimitadas", "5 entrevistadores IA", "Analisis avanzados", "Soporte prioritario", "Exportar resultados"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-blue-100">
                    <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center py-3 px-6 bg-white text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors"
              >
                Comenzar Prueba
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-white border border-gray-200 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Todo en Pro", "Entrevistadores ilimitados", "API personalizada", "SSO y seguridad", "Soporte dedicado"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:support@robut.ai"
                className="block w-full text-center py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Contactar Ventas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
                Listo para transformar tu proceso de seleccion?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Unete a cientos de empresas que ya estan contratando mejor con ROBUT
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-500 font-medium rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
              >
                Comenzar Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">ROBUT</span>
              </Link>
              <p className="text-sm text-gray-500">
                Plataforma de entrevistas impulsada por Inteligencia Artificial
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Caracteristicas</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="mailto:support@robut.ai" className="hover:text-gray-900 transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terminos</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              2024 ROBUT. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Datos seguros y encriptados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
