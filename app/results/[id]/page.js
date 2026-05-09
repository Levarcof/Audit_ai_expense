"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  TrendingDown,
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { useCountUp } from "@/hooks/useCountUp";
import SavingsChart from "@/components/SavingsChart";

/*
==================================================
STAT CARD
==================================================
*/

function StatCard({
  label,
  value,
  prefix = "$",
  suffix = "",
  animate = false,
}) {
  const count = useCountUp(
    typeof value === "number" ? value : 0,
    1800,
    animate
  );

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm text-center">
      <div className="mb-2 text-3xl md:text-4xl font-black">
        {prefix}
        <span>
          {animate
            ? Number(count).toLocaleString()
            : typeof value === "number"
              ? value.toLocaleString()
              : value}
        </span>
        {suffix}
      </div>

      <div className="text-sm text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
}

/*
==================================================
TOOL CARD
==================================================
*/

function ToolCard({ rec }) {
  const [open, setOpen] = useState(false);

  const hasSaving = rec?.savings > 0;

  return (
    <div className="overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${hasSaving
                ? "bg-green-500/15 text-green-400"
                : "bg-muted text-muted-foreground"
              }`}
          >
            {rec?.toolName?.slice(0, 2)?.toUpperCase() || "AI"}
          </div>

          <div>
            <div className="font-semibold">{rec?.toolName}</div>

            <div className="mt-0.5 text-xs text-muted-foreground">
              {rec?.currentPlan} →{" "}
              <span
                className={
                  hasSaving ? "font-medium text-green-400" : ""
                }
              >
                {rec?.recommendedPlan}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className={`font-bold ${hasSaving
                  ? "text-green-400"
                  : "text-muted-foreground"
                }`}
            >
              {hasSaving
                ? `-$${Number(rec?.savings).toFixed(0)}/mo`
                : "✓ Optimal"}
            </div>

            {hasSaving && (
              <div className="text-xs text-muted-foreground">
                ${Number(rec?.annualSavings).toFixed(0)}/yr
              </div>
            )}
          </div>

          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
          >
            <div className="px-5 pt-4 pb-5 text-sm text-muted-foreground">
              <p className="mb-4">{rec?.reason}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-destructive/10 p-3">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Current cost
                  </div>

                  <div className="font-bold text-destructive/80">
                    $
                    {(
                      Number(rec?.optimizedSpend || 0) +
                      Number(rec?.savings || 0)
                    ).toFixed(2)}
                    /mo
                  </div>
                </div>

                <div className="rounded-xl bg-green-500/10 p-3">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Optimized cost
                  </div>

                  <div className="font-bold text-green-400">
                    ${Number(rec?.optimizedSpend || 0).toFixed(2)}
                    /mo
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
==================================================
MAIN PAGE
==================================================
*/

export default function ResultsPage() {
  const { id } = useParams();

  const [audit, setAudit] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const [showLeadModal, setShowLeadModal] =
    useState(false);

  const [animated, setAnimated] = useState(false);

  /*
  ==================================================
  FETCH AUDIT
  ==================================================
  */

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchAudit = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/results/${id}`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Audit report not found");
        }

        const data = await response.json();

        setAudit(data.audit);

        setTimeout(() => {
          setAnimated(true);
        }, 300);

      } catch (err) {

        if (err.name !== "AbortError") {
          setError(err.message);
        }

      } finally {
        setLoading(false);
      }
    };


    fetchAudit();

    return () => controller.abort();

  }, [id]);

  /*
  ==================================================
  COPY LINK
  ==================================================
  */

  const handleCopyLink = async () => {
    try {
      if (typeof window === "undefined") return;

      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />

          <p className="font-medium text-muted-foreground">
            Loading your audit report...
          </p>
        </div>
      </div>
    );
  }

  /*
  ==================================================
  ERROR
  ==================================================
  */

  if (error || !audit) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />

          <h2 className="mb-2 text-2xl font-bold">
            Report Not Found
          </h2>

          <p className="mb-8 text-muted-foreground">
            {error ||
              "This audit report doesn't exist or has expired."}
          </p>

          <a
            href="/audit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start New Audit
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  /*
  ==================================================
  FLAGS
  ==================================================
  */

  const isHighSavings =
    Number(audit?.monthlySavings || 0) > 500;

  const isLowSavings =
    Number(audit?.monthlySavings || 0) < 100;

  /*
  ==================================================
  UI
  ==================================================
  */

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-4xl px-4">

        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            <CheckCircle2 className="h-3 w-3" />
            Audit Complete
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Your AI Spend Report
          </h1>

          <p className="text-lg text-muted-foreground">
            Based on your inputs, here&apos;s where your team can save money.
          </p>
        </motion.div>

        {/* STATS */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <StatCard
            label="Current Monthly Spend"
            value={audit?.totalSpend || 0}
            animate={animated}
          />

          <StatCard
            label="Optimized Monthly Spend"
            value={audit?.totalOptimizedSpend || 0}
            animate={animated}
          />

          <StatCard
            label="Monthly Savings"
            value={audit?.monthlySavings || 0}
            animate={animated}
          />

          <StatCard
            label="Annual Savings"
            value={audit?.annualSavings || 0}
            animate={animated}
          />
        </motion.div>

        {/* CHART */}

        {audit?.recommendations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <SavingsChart
              recommendations={audit.recommendations}
            />
          </motion.div>
        )}

        {/* LOW SAVINGS */}

        {isLowSavings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex gap-4 rounded-2xl border border-green-500/20 bg-green-500/5 p-6"
          >
            <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-400" />

            <div>
              <h3 className="mb-1 text-lg font-bold text-green-400">
                Your stack is already efficient! 🎉
              </h3>

              <p className="text-sm text-muted-foreground">
                Great news — your team is spending wisely on AI tools.
                We found less than $100/month in potential savings.
              </p>
            </div>
          </motion.div>
        )}

        {/* AI SUMMARY */}

        {audit?.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8 rounded-2xl border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-bold">
                AI Analysis Summary
              </h2>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {audit.aiSummary}
            </p>
          </motion.div>
        )}

        {/* TOOL BREAKDOWN */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-6 text-2xl font-bold">
            Tool-by-Tool Breakdown
          </h2>

          <div className="space-y-4">
            {audit?.recommendations?.map((rec, index) => (
              <ToolCard
                key={`${rec.toolName}-${rec.currentPlan}-${index}`}
                rec={rec}
              />
            ))}
          </div>
        </motion.div>

        {/* HIGH SAVINGS CTA */}

        {isHighSavings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="relative mb-8 overflow-hidden rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-12"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:24px_24px]" />

            <div className="relative z-10">
              <TrendingDown className="mx-auto mb-4 h-12 w-12 opacity-80" />

              <h2 className="mb-4 text-3xl font-bold">
                You could save $
                {Number(audit?.annualSavings || 0).toLocaleString()}
                {" "}per year!
              </h2>

              <p className="mx-auto mb-8 max-w-xl text-primary-foreground/80">
                Book a free Credex consultation and we&apos;ll help
                implement these optimizations for your team.
              </p>

              <button
                onClick={() => setShowLeadModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 text-lg font-bold text-foreground shadow-2xl transition-transform hover:scale-105"
              >
                Book Free Consultation
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ACTION BUTTONS */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <button
            onClick={handleCopyLink}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border font-semibold transition-colors hover:bg-muted"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Copy Report Link
              </>
            )}
          </button>

          <a
            href="/audit"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border text-center font-semibold transition-colors hover:bg-muted"
          >
            Run New Audit
          </a>
        </motion.div>
      </div>
    </div>
  );
}

