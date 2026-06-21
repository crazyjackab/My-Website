"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { scrollToSection } from "@/lib/smooth-scroll";
import { Terminal, X } from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error";
  text: string;
}

const COMMANDS: Record<string, string | (() => string)> = {
  help: `Available commands:
  help       — Show this message
  whoami     — Display identity
  about      — About me
  skills     — List skills
  projects   — List projects
  contact    — Contact info
  clear      — Clear terminal
  sudo       — Try it ;)`,

  whoami: `${profile.name} — ${profile.title}\n${profile.slogan}`,

  about: profile.bio.join("\n\n"),

  skills: "React · TypeScript · Next.js · Node.js · Java · Python · Docker · Git\n(see #skills section for full list)",

  projects: projects.map((p) => `→ ${p.title} — ${p.tagline}`).join("\n"),

  contact: `Email: ${profile.email}\nGitHub: github.com/${profile.handle}`,

  ls: "about/  skills/  experience/  projects/  contact/",

  "cat about.txt": profile.bio[0],
};

export function TerminalWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", text: `portfolio-os v0.1.0 — type 'help' for commands` },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [history]);

  const execute = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;

      setHistory((h) => [...h, { type: "input", text: `$ ${raw}` }]);
      setCmdHistory((h) => [...h, raw]);
      setHistoryIndex(-1);

      if (cmd === "clear") {
        setHistory([]);
        return;
      }

      if (cmd === "cd about" || cmd === "about") {
        scrollToSection("about");
        setHistory((h) => [...h, { type: "output", text: "→ Navigating to #about" }]);
        return;
      }
      if (cmd === "cd skills" || cmd === "skills") {
        scrollToSection("skills");
        setHistory((h) => [...h, { type: "output", text: "→ Navigating to #skills" }]);
        return;
      }
      if (cmd === "cd projects" || cmd === "projects") {
        scrollToSection("projects");
        setHistory((h) => [...h, { type: "output", text: "→ Navigating to #projects" }]);
        return;
      }
      if (cmd === "cd contact" || cmd === "contact") {
        scrollToSection("contact");
        setHistory((h) => [...h, { type: "output", text: "→ Navigating to #contact" }]);
        return;
      }
      if (cmd === "sudo hire-me" || cmd === "sudo hire me") {
        setHistory((h) => [
          ...h,
          { type: "output", text: "✓ Permission granted.\n→ Let's connect! Scroll to #contact or email: " + profile.email },
        ]);
        return;
      }

      const handler = COMMANDS[cmd];
      if (handler) {
        const output = typeof handler === "function" ? handler() : handler;
        setHistory((h) => [...h, { type: "output", text: output }]);
      } else {
        setHistory((h) => [
          ...h,
          { type: "error", text: `command not found: ${cmd}. type 'help' for available commands.` },
        ]);
      }
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(cmdHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-neon-green/30 bg-black/80 text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.2)] backdrop-blur-sm transition-all hover:border-neon-green hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
        aria-label="Open terminal"
      >
        <Terminal size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-neon-green/30 bg-[#0a0a0a]/95 shadow-[0_0_40px_rgba(57,255,20,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-xs text-text-muted">
                  {profile.handle}@portfolio ~ terminal
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-muted hover:text-white"
                aria-label="Close terminal"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={outputRef}
              className="h-64 overflow-y-auto p-4 font-mono text-sm"
            >
              {history.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.type === "input"
                      ? "text-neon-cyan"
                      : line.type === "error"
                        ? "text-red-400"
                        : "text-neon-green/80"
                  }
                >
                  {line.text.split("\n").map((part, j) => (
                    <span key={j}>
                      {part}
                      {j < line.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="font-mono text-neon-green">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent font-mono text-sm text-white outline-none"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
