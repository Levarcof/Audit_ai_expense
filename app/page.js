"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Zap, TrendingDown } from "lucide-react";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex flex-col bg-background text-foreground antialiased selection:bg-primary/10">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-60" />
          <div className="absolute -top-[10%] -left-[10%] md:w-[40%] md:h-[40%] w-[60%] h-[30%] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        </div>

        <div className="container mx-auto px-5 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.03] border border-primary/10 text-[11px] md:text-[13px] font-medium mb-6 md:mb-10 backdrop-blur-md"
              variants={fadeInUp}
            >
              <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary fill-primary/20" />
              <span className="tracking-[0.05em] uppercase text-[9px] md:text-[10px] font-bold opacity-80 border-r border-primary/20 pr-2">New</span>
              <span className="text-muted-foreground">Free AI Audit for Startups</span>
            </motion.div>
            
            {/* Main Title - Mobile Optimized Scaling */}
            <motion.h1 
              className="text-[40px] leading-[1.1] md:text-[64px] font-bold tracking-tight mb-6 md:mb-8 text-balance"
              variants={fadeInUp}
            >
              Optimize your <span className="relative inline-block">
                AI spend
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
              </span> without friction.
            </motion.h1>
            
            <motion.p 
              className="text-base md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2"
              variants={fadeInUp}
            >
              Analyze your AI stack and uncover savings in <span className="text-foreground">under 60 seconds</span>. 
              The average team saves <span className="text-foreground font-medium underline decoration-primary/30 underline-offset-4">$1,200/year</span>.
            </motion.p>
            
            {/* CTAs - Mobile Friendly Stack */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-5 px-4"
              variants={fadeInUp}
            >
              <a href="/audit" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-8 md:px-10 py-4 text-[15px] font-semibold text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 gap-2 group">
                Start Free Audit 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
           
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Mobile Grid Refined */}
      <section className="py-10 md:py-12 border-y border-border/40 bg-muted/[0.15] backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-12">
            {[
              { label: "Annual Savings", value: "$4.2M+" },
              { label: "Audits Completed", value: "12,000+" },
              { label: "Efficiency Gain", value: "32%" },
              { label: "Trusted Teams", value: "850+" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="flex flex-col items-center md:items-start text-center md:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-xl md:text-2xl font-semibold tracking-tighter">{stat.value}</div>
                <div className="text-[9px] md:text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-bold mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-4 md:gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">Built for lean startups</h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                Automated auditing for modern teams who want to build more and manage less.
              </p>
            </div>
            <div className="hidden md:block h-[1px] flex-1 bg-border/60 mx-12 mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Instant Audit",
                desc: "Get a comprehensive analysis of your AI tool spending in one click. No complex setups."
              },
              {
                icon: <TrendingDown className="w-5 h-5" />,
                title: "Plan Optimization",
                desc: "We identify over-provisioned seats and enterprise plans you don't actually need."
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Usage Insights",
                desc: "Compare your usage patterns against global benchmarks to eliminate waste."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="relative p-8 md:p-10 rounded-[24px] md:rounded-[32px] border border-border/60 bg-gradient-to-b from-card to-card/50 hover:border-primary/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 p-3 rounded-lg bg-primary/5 text-primary w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}