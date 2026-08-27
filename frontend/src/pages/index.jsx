import { Link } from "react-router-dom";
import {
  CircuitBoardIcon,
  RadicalIcon,
  ActivityIcon,
  ZapIcon,
  GaugeCircleIcon,
  BinaryIcon,
  TimerIcon,
  BellIcon,
  Terminal,
  ShieldCheck,
  Cpu,
  SparkleIcon,
  Zap,
} from "lucide-react";

const categories = [
  { name: "GPIO", icon: CircuitBoardIcon, count: 42 },
  { name: "UART", icon: RadicalIcon, count: 28 },
  { name: "PWM", icon: ActivityIcon, count: 31 },
  { name: "Digital Logic", icon: BinaryIcon, count: 56 },
  { name: "Timers", icon: TimerIcon, count: 24 },
  { name: "Interrupts", icon: BellIcon, count: 19 },
  { name: "ADC", icon: GaugeCircleIcon, count: 22 },
  { name: "Protocols", icon: ZapIcon, count: 35 },
];

const features = [
  {
    icon: Terminal,
    title: "In-browser firmware editor",
    desc: "Write Embedded C / C++ with real syntax intelligence and instant feedback.",
  },
  {
    icon: ActivityIcon,
    title: "Cycle-accurate simulation",
    desc: "Validate code against deterministic, hardware-accurate signal models.",
  },
  {
    icon: ShieldCheck,
    title: "Waveform-based grading",
    desc: "Pass means your output waveform matches spec — timing, edges, levels.",
  },
  {
    icon: Cpu,
    title: "MCU peripheral models",
    desc: "GPIO, timers, ADC, UART, SPI, I²C — modeled at register level.",
  },
  {
    icon: SparkleIcon,
    title: "Curated problem sets",
    desc: "From blinking LEDs to UART bootloaders. Designed by industry engineers.",
  },
  {
    icon: Zap,
    title: "Instant test runs",
    desc: "Run, inspect, iterate. Sub-second feedback loop on every keystroke.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Pick a problem",
    description: "Filter by peripheral, difficulty, or company.",
  },
  {
    number: "02",
    title: "Write the firmware",
    description: "Edit C/C++ with peripheral-aware autocomplete.",
  },
  {
    number: "03",
    title: "Run on simulator",
    description: "Cycle-accurate execution on virtual MCU.",
  },
  {
    number: "04",
    title: "Validate waveform",
    description: "Tests fail-fast on timing or level mismatch.",
  },
];

const testimonials = [
  {
    quote:
      "As an engineering student, I’ve often felt that learning core engineering concepts is one thing, but having a structured way to practice and validate what you know is another. Simcuit feels like it’s finally bridging that gap.",
    author: "Shakthi Pooja",
    role: "II Year, Panimalar Engineering College",
  },
  {
    quote:
      "I develop AI-driven solutions and solving real-world technical challenges. Building scalable AI applications has strengthened my expertise in Python, LLMs, RAG, APIs, SQL, and problem-solving while encouraging continuous learning and innovation.",
    author: "Akshadha",
    role: "AI Engineer, IntSphere",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 glass text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-blink" />

            <span className="text-xs">Now in public beta · v1.0.5</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Master embedded systems
            <br />
            through{" "}
            <span className="text-primary">interactive hardware logic</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Solve real engineering problems on simulated hardware. Write
            firmware, run it, and validate against expected waveforms — all in
            your browser.
          </p>

          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              <span>▶</span>
              Start solving
            </Link>

            <Link
              to="/problems"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-md border border-white/10 glass hover:bg-white/5 transition"
            >
              Explore problems
              <span>→</span>
            </Link>
          </div>

          {/* SIMULATOR PREVIEW */}
          <div className="mt-16 mx-auto max-w-4xl relative">
            <div className="relative glass-strong p-0 overflow-hidden rounded-2xl border border-white/10 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 text-xs font-mono text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-5/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald/70" />

                <span className="ml-3">simulator › pwm_dimmer.c</span>

                <span className="ml-auto flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-blink" />
                  running
                </span>
              </div>

              <div className="grid md:grid-cols-2">
                {/* CODE */}
                <div className="p-5 font-mono text-[12.5px] leading-relaxed bg-background/40 border-r border-white/5 text-left">
                  <div className="text-muted-foreground">
                    // Generate 1kHz PWM @ 60% duty
                  </div>

                  <div>
                    <span className="text-violet">void</span>{" "}
                    <span className="text-cyan">setup_pwm</span>
                    () {"{"}
                  </div>

                  <div className="pl-4">
                    TIM2-&gt;PSC = <span className="text-emerald">71</span>;
                  </div>

                  <div className="pl-4">
                    TIM2-&gt;ARR = <span className="text-emerald">999</span>;
                  </div>

                  <div className="pl-4">
                    TIM2-&gt;CCR1 = <span className="text-emerald">600</span>;
                  </div>

                  <div className="pl-4">TIM2-&gt;CR1 |= TIM_CR1_CEN;</div>

                  <div>{"}"}</div>

                  <div className="mt-3 text-emerald">
                    ✓ 4 / 4 test cases passed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ENGINEERS */}
          <div className="mt-16 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Engineers from
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-muted-foreground/70 font-mono text-sm">
            {[
              "NVIDIA",
              "ARM",
              "Intel",
              "Apple",
              "Tesla",
              "SpaceX",
              "Qualcomm",
            ].map((name) => (
              <span key={name} className="hover:text-foreground transition">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            Platform
          </span>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Built like the tools you already trust.
          </h2>

          <p className="mt-3 text-muted-foreground">
            VSCode-grade editor. Logic-analyzer-grade visualization. CI-grade
            test harness. Engineered for serious embedded work.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative glass p-6 rounded-2xl border border-white/10 hover:border-primary/40 transition group overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition" />

                <div className="relative text-lg text-cyan font-mono">
                  <Icon size={22} />
                </div>

                <div className="mt-4 font-medium">{feature.title}</div>

                <div className="mt-1.5 text-sm text-muted-foreground">
                  {feature.desc}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">
              Problem categories
            </h2>

            <p className="mt-2 text-muted-foreground">
              From bare-metal basics to advanced protocol stacks.
            </p>
          </div>

          <Link
            to="/problems"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Browse all →
          </Link>
        </div>

        <div className="mt-8 grid gap-3 grid-cols-2 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to="/problems"
                className="glass p-5 rounded-2xl border border-white/10 hover:border-primary/40 hover:-translate-y-0.5 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-cyan font-mono">
                    <Icon size={22} />
                  </span>

                  <span className="text-xs font-mono text-muted-foreground">
                    {category.count}
                  </span>
                </div>

                <div className="mt-6 font-medium">{category.name}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-semibold tracking-tight">
            Your engineering loop, accelerated.
          </h2>

          <p className="mt-3 text-muted-foreground">
            A workflow modeled after how real firmware engineers ship.
          </p>
        </div>

        <div className="relative mt-14 grid gap-5 md:grid-cols-4">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-border" />

          {workflow.map((step) => (
            <div
              key={step.number}
              className="relative glass rounded-2xl p-6 border border-white/10"
            >
              <div className="font-mono text-xs text-primary">
                {step.number}
              </div>

              <div className="mt-3 font-medium">{step.title}</div>

              <div className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-4xl font-semibold tracking-tight text-center">
          Trusted by engineers who ship silicon.
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="glass p-6 rounded-2xl border border-white/10"
            >
              <div className="text-sm leading-relaxed text-foreground/90">
                "{testimonial.quote}"
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div>
                  <div className="text-sm font-medium">
                    {testimonial.author}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
