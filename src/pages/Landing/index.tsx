import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Zap, Github, FlaskConical, Search, TrendingUp,
  BookOpen, ArrowRight, Star, Trophy, Sparkles,
  Code, Brain, Rocket, Users, ChevronRight,
  Play
} from 'lucide-react';

// Typewriter effect
function TypeWriter({ words }: { words: string[] }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words.length);
        }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [currentText, deleting, currentWord, words]);

  return (
    <span className="gradient-text">
      {currentText}
      <span className="cursor-blink text-indigo-400">|</span>
    </span>
  );
}

// Counter animation
function Counter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black gradient-text">{count.toLocaleString()}{suffix}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}

// Particle background
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 100) * 0.1;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

const features = [
  {
    icon: Brain,
    color: 'from-indigo-500 to-purple-600',
    glow: 'rgba(99,102,241,0.3)',
    title: 'AI-Powered Matching',
    description: 'Our ML algorithm analyzes 50+ data points to find your perfect teammates with 87% accuracy.',
    badge: 'Core Feature',
    path: '/team-matching',
  },
  {
    icon: Github,
    color: 'from-gray-500 to-slate-700',
    glow: 'rgba(100,116,139,0.3)',
    title: 'GitHub Intelligence',
    description: 'Deep analysis of contribution patterns, code quality, and collaboration style from real repositories.',
    badge: 'Real Data',
    path: '/github-analyzer',
  },
  {
    icon: FlaskConical,
    color: 'from-purple-500 to-pink-600',
    glow: 'rgba(168,85,247,0.3)',
    title: 'Team Chemistry',
    description: 'Predict team dynamics, win probability, and innovation potential before forming your dream team.',
    badge: 'Unique',
    path: '/team-chemistry',
  },
  {
    icon: Search,
    color: 'from-cyan-500 to-blue-600',
    glow: 'rgba(6,182,212,0.3)',
    title: 'Gap Analyzer',
    description: 'Identify missing skills for your target hackathon domain and get smart candidate recommendations.',
    badge: 'Smart',
    path: '/gap-analyzer',
  },
  {
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Readiness Score',
    description: 'Get a comprehensive readiness assessment for 10+ hackathon domains with actionable checklists.',
    badge: '10+ Domains',
    path: '/readiness',
  },
  {
    icon: BookOpen,
    color: 'from-orange-500 to-amber-600',
    glow: 'rgba(245,158,11,0.3)',
    title: 'AI Upskilling',
    description: 'Personalized learning roadmaps tailored to your role, skill level, and hackathon theme.',
    badge: 'Personalized',
    path: '/upskilling',
  },
];

const testimonials = [
  {
    name: 'Arjun Patel',
    role: 'Winner - HackMIT 2024',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunP&backgroundColor=b6e3f4',
    text: 'TeamForge AI helped us find our ML engineer in 10 minutes. We went from a 2-person team to a full squad in one afternoon. We ended up winning!',
    stars: 5,
    hackathon: 'HackMIT',
  },
  {
    name: 'Priya Reddy',
    role: 'Finalist - Smart India Hackathon',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaR&backgroundColor=ffd5dc',
    text: 'The Gap Analyzer literally told us we needed a blockchain dev before we even knew it. Found one through TeamForge and reached the finals!',
    stars: 5,
    hackathon: 'SIH 2024',
  },
  {
    name: 'Rahul Sharma',
    role: '3x Hackathon Champion',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulS&backgroundColor=c0aede',
    text: 'The GitHub analyzer is scary accurate. It predicted our team chemistry score of 89% and we won 1st place. This tool is the real deal.',
    stars: 5,
    hackathon: 'ETHIndia',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Connect GitHub, add your skills, and set your hackathon preferences in under 5 minutes.',
    icon: Code,
    color: 'from-indigo-500 to-purple-600',
  },
  {
    step: '02',
    title: 'AI Analyzes You',
    description: 'Our AI studies your GitHub, skills, and work style to build your unique developer fingerprint.',
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
  },
  {
    step: '03',
    title: 'Get Matched',
    description: 'Receive compatibility-ranked teammate suggestions. See chemistry scores before you even meet.',
    icon: Users,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    step: '04',
    title: 'Win Together',
    description: 'Use Gap Analyzer, Readiness Checker, and Upskilling to prepare and dominate any hackathon.',
    icon: Trophy,
    color: 'from-green-500 to-emerald-600',
  },
];



export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-white">TeamForge <span className="gradient-text">AI</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/signup"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-1 absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="orb-2 absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl" />
          <div className="orb-3 absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-cyan-600/6 rounded-full blur-3xl" />
          <div className="bg-mesh absolute inset-0 opacity-30" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-5xl mx-auto px-4 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Gemini AI + GitHub Intelligence
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black text-white leading-tight mb-6"
          >
            Find Your Perfect{' '}
            <br />
            <TypeWriter words={['Dream Team', 'Co-Founder', 'Tech Lead', 'ML Engineer', 'Hackathon Squad']} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered team formation for hackathon champions. Analyze GitHub profiles,
            predict team chemistry, and win more hackathons together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/signup"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all hover:scale-105">
              <Rocket className="w-5 h-5" />
              Start Free — No Credit Card
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/15 transition-all">
              <Play className="w-5 h-5 text-indigo-400" />
              Try Demo
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['Priya', 'Arjun', 'Sofia', 'Rahul', 'Meera'].map((name, i) => (
                  <img key={name} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                    className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] bg-indigo-900"
                    style={{ zIndex: 5 - i }} alt={name} />
                ))}
              </div>
              <span className="text-gray-400 text-sm">12,000+ developers trust us</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-gray-400 text-sm ml-1">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-indigo-400" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter value={12000} label="Active Developers" suffix="+" />
          <Counter value={3400} label="Teams Formed" suffix="+" />
          <Counter value={87} label="Match Accuracy" suffix="%" />
          <Counter value={2300} label="Hackathons Won" suffix="+" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Gemini AI
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="gradient-text">Win</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Six AI-powered tools designed to take you from solo developer to hackathon champion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-6 group cursor-pointer card-hover-glow transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                    style={{ boxShadow: `0 8px 20px ${feature.glow}` }}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-white/10 text-gray-300 text-xs font-medium">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                <Link to="/signup"
                  className="inline-flex items-center gap-1 text-indigo-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Try it free <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white/2">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">From signup to winning — in 4 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-6 flex gap-5"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-5xl font-black text-white/5 -mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold text-white mb-1 relative">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-105">
              <Rocket className="w-5 h-5" />
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Champions Who <span className="gradient-text">Trust Us</span>
            </h2>
            <p className="text-gray-400 text-lg">Real stories from real hackathon winners</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full bg-indigo-900" />
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 text-xs font-medium">
                      🏆 {t.hackathon}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-cyan-700" />
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <div className="relative p-12 text-center">
              <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Win Your Next Hackathon?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join 12,000+ developers who use TeamForge AI to find their perfect teammates and dominate hackathons.
              </p>
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
                <Rocket className="w-5 h-5" />
                Get Started — It's Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white">TeamForge <span className="gradient-text">AI</span></span>
          </div>
          <p className="text-gray-600 text-sm">© 2025 TeamForge AI. Built for hackathon champions.</p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
