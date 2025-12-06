"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Portfolio() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeSection, setActiveSection] = useState("intro")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const playSound = (type: "click" | "success" | "error") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (type === "click") {
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.1
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.05)
    } else if (type === "success") {
      oscillator.frequency.value = 600
      gainNode.gain.value = 0.15
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.1)
    } else if (type === "error") {
      oscillator.frequency.value = 200
      gainNode.gain.value = 0.2
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.15)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "luky" && password === "dev123") {
      playSound("success")
      setLoginError("acesso concedido. a carregar interface…")
      setTimeout(() => {
        setIsLoggedIn(true)
      }, 500)
    } else {
      playSound("error")
      setLoginError("credenciais inválidas. tenta outra vez.")
    }
  }

  const handleNavClick = (section: string) => {
    playSound("click")
    setActiveSection(section)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground mousePosition={mousePosition} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-10"
        >
          <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl rounded-3xl">
            <div className="text-center mb-6">
              <h1 className="font-mono text-2xl text-foreground mb-2">{"{ access required }"}</h1>
              <p className="text-sm text-muted-foreground">
                Insere as tuas credenciais de developer para entrar no sistema.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-foreground/70 mb-1 block">utilizador</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="font-mono bg-muted/50 border-border/50"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-foreground/70 mb-1 block">palavra-passe</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono bg-muted/50 border-border/50"
                />
              </div>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs font-mono ${loginError.includes("concedido") ? "text-green-500" : "text-destructive"}`}
                >
                  {loginError}
                </motion.p>
              )}
              <Button type="submit" className="w-full font-mono bg-primary hover:bg-primary/90">
                entrar
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                dica: começa com <span className="text-neon font-mono">luky</span> 😉
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <AnimatedBackground mousePosition={mousePosition} />

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed left-0 top-0 h-screen w-64 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border p-6 flex flex-col"
        >
          <div className="mb-8">
            <h1 className="font-mono text-lg text-sidebar-foreground mb-1">
              {"> user_"}
              <span className="animate-pulse">█</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: "intro", label: "$ sobre_mim" },
              { id: "skills", label: "$ competências" },
              { id: "projects", label: "$ projetos" },
              { id: "contact", label: "$ contacto" },
              { id: "achievements", label: "$ conquistas" },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-full font-mono text-sm transition-all ${
                  activeSection === item.id
                    ? "bg-neon/10 text-neon"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-sidebar-border/30 border-dashed">
            <p className="font-mono text-xs text-sidebar-foreground/60">
              status: <span className="text-green-400">disponível</span>
            </p>
            <p className="font-mono text-xs text-sidebar-foreground/60 mt-1">residência: Ourém, Portugal</p>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {activeSection === "intro" && <IntroSection key="intro" />}
            {activeSection === "skills" && <SkillsSection key="skills" />}
            {activeSection === "projects" && <ProjectsSection key="projects" />}
            {activeSection === "contact" && <ContactSection key="contact" />}
            {activeSection === "achievements" && <AchievementsSection key="achievements" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function AnimatedBackground({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const parallaxX = (mousePosition.x - window.innerWidth / 2) * 0.01
  const parallaxY = (mousePosition.y - window.innerHeight / 2) * 0.01

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Animated grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          x: parallaxX,
          y: parallaxY,
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-foreground/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Blinking symbols */}
      {[">", "{", "}", "/>", "<3", "0.0"].map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs text-foreground/5"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  )
}

function IntroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon/20 to-neon-secondary/20 overflow-hidden flex-shrink-0 shadow-neon mx-auto mb-6 border-4 border-neon/20">
          <div className="w-full h-full flex items-center justify-center bg-muted text-foreground text-5xl font-mono">
            L
          </div>
        </div>

        <h2 className="text-4xl font-bold font-mono text-foreground mb-2">Luky</h2>
        <p className="text-muted-foreground mb-6">programador em formação • entusiasta de tech e storytelling</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="px-3 py-1 bg-muted rounded-full text-xs">idade: 16+ anos*</span>
          <span className="px-3 py-1 bg-muted rounded-full text-xs">stack: C++, SQL, HTML, CSS, JS</span>
          <span className="px-3 py-1 bg-muted rounded-full text-xs">modo: sempre a aprender</span>
        </div>

        <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
          Curto misturar programação, jogos e histórias. Atualmente no 11.º ano de Informática de Sistemas, a construir
          bases sólidas em desenvolvimento e em sistemas. Este espaço é o meu "save file" público: aqui guardo projetos,
          ideias e experiências.
        </p>
      </Card>
    </motion.div>
  )
}

function SkillsSection() {
  const skills = [
    {
      name: "backend básico",
      desc: "C++ / PHP / SQL (Oracle e MySQL) • lógica, estruturas de dados simples.",
      xp: 48,
    },
    {
      name: "frontend",
      desc: "HTML semântico, CSS responsivo, um pouco de JavaScript vanilla.",
      xp: 42,
    },
    {
      name: "infra & bases",
      desc: "VMware, XAMPP, redes básicas e configuração de serviços.",
      xp: 35,
    },
    {
      name: "storytelling",
      desc: "criação de mundos, personagens e narrativas pós-apocalípticas/fantasia.",
      xp: 60,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl mb-6">
        <h2 className="font-mono text-2xl text-foreground mb-6">{"< competências />"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-muted/30 rounded-2xl border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <h3 className="font-mono text-base text-foreground mb-2">{skill.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{skill.desc}</p>
              <span className="absolute bottom-4 right-4 font-mono text-xs px-3 py-1 bg-neon/20 text-neon rounded-full">
                XP: {skill.xp}%
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function ProjectsSection() {
  const projects = [
    {
      title: "Gestão de Clube Desportivo",
      desc: "Aplicação em C++ para gerir jogadores e árbitros, com menus, ficheiros e validação.",
      tags: ["C++", "ficheiros"],
    },
    {
      title: "Base de Dados Biblioteca",
      desc: "Modelo SQL para gerir livros, autores, leitores e empréstimos.",
      tags: ["SQL", "modelação"],
    },
    {
      title: "Aura Farm Lda (conceito)",
      desc: "Marca/empresa fictícia focada em sustentabilidade e tecnologia no agro.",
      tags: ["branding", "business"],
    },
    {
      title: 'Histórias "Rasgo"',
      desc: "Mundo próprio pós-apocalíptico com poderes, monstros e política.",
      tags: ["worldbuilding"],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl">
        <h2 className="font-mono text-2xl text-foreground mb-2">{"// projetos"}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Alguns dos "builds" em que tenho trabalhado. Mais detalhes em breve.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-muted/30 rounded-2xl border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <h3 className="font-mono text-base text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-neon/10 text-neon rounded-lg text-xs font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function ContactSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl">
        <h2 className="font-mono text-2xl text-foreground mb-2">{"@ contacto"}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Queres falar comigo sobre projetos, escola ou ideias malucas?
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-muted-foreground min-w-20">email</span>
            <span className="text-sm text-foreground">teu_email@exemplo.com</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-muted-foreground min-w-20">github</span>
            <span className="text-sm text-foreground">github.com/teu-utilizador</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-muted-foreground min-w-20">discord</span>
            <span className="text-sm text-foreground">luky#0000</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">(estes contactos são placeholders, troca pelos teus reais)</p>
      </Card>
    </motion.div>
  )
}

function AchievementsSection() {
  const achievements = [
    "Sobrevivi ao setup do Oracle 19c em VM.",
    "Hackei o Apache do XAMPP até funcionar no Windows.",
    "Construí trabalhos e projetos multi-disciplinar com ajuda de IA 😉.",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-sm border-border/50 rounded-3xl shadow-xl">
        <h2 className="font-mono text-2xl text-foreground mb-6">{"🏆 conquistas"}</h2>
        <ul className="space-y-3 list-disc list-inside">
          {achievements.map((achievement, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {achievement}
            </motion.li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
