"use client";

import { useState } from "react";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function evaluate({ income, creditScore, loanAmount, existingDebt, years }) {
  const dti = (existingDebt + loanAmount) / income;

  const parts = [
    {
      label: "Credit score",
      points: ((creditScore - 300) / 550) * 40,
      max: 40,
    },
    {
      label: "Debt-to-income ratio",
      points: clamp(1 - dti, 0, 1) * 30,
      max: 30,
    },
    {
      label: "Employment history",
      points: (clamp(years, 0, 10) / 10) * 15,
      max: 15,
    },
    {
      label: "Income level",
      points: clamp(income / 100000, 0, 1) * 15,
      max: 15,
    },
  ];

  const score = Math.round(parts.reduce((sum, p) => sum + p.points, 0));
  return { score, dti, parts, approved: score >= 60 };
}

export default function Home() {
  const [form, setForm] = useState({
    income: 80000,
    creditScore: 650,
    loanAmount: 20000,
    existingDebt: 15000,
    years: 5,
  });
  const [result, setResult] = useState(null);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const submit = (e) => {
    e.preventDefault();
    if (form.income <= 0) return alert("Income must be greater than 0");
    setResult(evaluate(form));
  };

  const fields = [
    { name: "income", label: "Annual income", prefix: "$" },
    { name: "creditScore", label: "Credit score", hint: "300 – 850" },
    { name: "loanAmount", label: "Loan amount", prefix: "$" },
    { name: "existingDebt", label: "Existing debt", prefix: "$" },
    { name: "years", label: "Years employed" },
  ];

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap");

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f7f5f1;
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 0, 0, 0.035) 1px,
            transparent 0
          );
          background-size: 22px 22px;
          font-family: "Inter", -apple-system, sans-serif;
          color: #1c1a17;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          max-width: 620px;
          margin: 0 auto;
          padding: 72px 24px 96px;
        }

        .masthead {
          margin-bottom: 56px;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a8f7d;
          font-weight: 500;
          margin: 0 0 14px;
        }

        h1 {
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: 52px;
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
          color: #1c1a17;
        }

        h1 em {
          font-style: italic;
          color: #8a6d3f;
        }

        .lede {
          font-size: 16px;
          line-height: 1.6;
          color: #6b6357;
          max-width: 440px;
          margin: 0;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, #d8d0c2, transparent);
          margin: 40px 0;
        }

        form {
          display: grid;
          gap: 22px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        label {
          font-size: 13px;
          font-weight: 500;
          color: #4a443a;
          letter-spacing: 0.01em;
        }

        .hint {
          font-size: 11px;
          color: #a89e8e;
          font-variant-numeric: tabular-nums;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .prefix {
          position: absolute;
          left: 16px;
          font-size: 15px;
          color: #a89e8e;
          pointer-events: none;
          font-variant-numeric: tabular-nums;
        }

        input {
          width: 100%;
          padding: 14px 16px;
          padding-left: 16px;
          font-size: 15px;
          font-family: "Inter", sans-serif;
          font-variant-numeric: tabular-nums;
          background: #fffdfa;
          border: 1px solid #e4ddd0;
          border-radius: 10px;
          color: #1c1a17;
          transition: all 0.18s ease;
          outline: none;
        }

        .input-wrap.has-prefix input {
          padding-left: 30px;
        }

        input:hover {
          border-color: #d4cab8;
        }

        input:focus {
          border-color: #8a6d3f;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(138, 109, 63, 0.1);
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        button {
          margin-top: 12px;
          padding: 16px 24px;
          font-size: 14px;
          font-weight: 500;
          font-family: "Inter", sans-serif;
          letter-spacing: 0.02em;
          color: #fdfbf7;
          background: #1c1a17;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        button:hover {
          background: #2e2a24;
          transform: translateY(-1px);
        }

        button:active {
          transform: translateY(0);
        }

        .result {
          margin-top: 40px;
          padding: 32px;
          background: #fffdfa;
          border: 1px solid #e4ddd0;
          border-radius: 14px;
          animation: rise 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .verdict {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0eae0;
          margin-bottom: 24px;
        }

        .verdict h2 {
          font-family: "Instrument Serif", Georgia, serif;
          font-weight: 400;
          font-size: 26px;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .ok h2 {
          color: #4a6b3f;
        }

        .no h2 {
          color: #8a3f3f;
        }

        .verdict-sub {
          font-size: 13px;
          color: #8a8175;
          margin: 0;
        }

        .score-block {
          text-align: right;
          flex-shrink: 0;
        }

        .score {
          font-family: "Instrument Serif", Georgia, serif;
          font-size: 44px;
          line-height: 1;
          color: #1c1a17;
          letter-spacing: -0.02em;
        }

        .score span {
          font-size: 18px;
          color: #a89e8e;
          font-family: "Inter", sans-serif;
        }

        .score-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #a89e8e;
          margin-top: 6px;
          font-weight: 500;
        }

        .breakdown {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .row-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 7px;
        }

        .row-label {
          font-size: 13px;
          color: #4a443a;
          font-weight: 500;
        }

        .row-value {
          font-size: 12px;
          color: #a89e8e;
          font-variant-numeric: tabular-nums;
        }

        .bar {
          height: 5px;
          background: #f0eae0;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          background: #1c1a17;
          transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ok .bar-fill {
          background: #5a7d4a;
        }

        .no .bar-fill {
          background: #8a5a5a;
        }

        .footnote {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f0eae0;
          font-size: 12px;
          color: #a89e8e;
          display: flex;
          justify-content: space-between;
        }

        @media (max-width: 560px) {
          .page {
            padding: 48px 20px 72px;
          }
          h1 {
            font-size: 40px;
          }
          .verdict {
            flex-direction: column;
          }
          .score-block {
            text-align: left;
          }
        }
      `}</style>

      <main className="page">
        <header className="masthead">
          <p className="eyebrow">Credit Assessment · No. 001</p>
          <h1>
            A quieter way to check <em>eligibility</em>.
          </h1>
          <p className="lede">
            Five inputs, one honest score. We show you exactly how each factor
            moves the needle — no black boxes, no sales calls.
          </p>
        </header>

        <div className="divider" />

        <form onSubmit={submit}>
          {fields.map((f) => (
            <div className="field" key={f.name}>
              <div className="field-label">
                <label htmlFor={f.name}>{f.label}</label>
                {f.hint && <span className="hint">{f.hint}</span>}
              </div>
              <div className={`input-wrap ${f.prefix ? "has-prefix" : ""}`}>
                {f.prefix && <span className="prefix">{f.prefix}</span>}
                <input
                  id={f.name}
                  type="number"
                  name={f.name}
                  value={form[f.name]}
                  onChange={update}
                  min="0"
                  required
                />
              </div>
            </div>
          ))}
          <button type="submit">Run assessment →</button>
        </form>

        {result && (
          <section className={`result ${result.approved ? "ok" : "no"}`}>
            <div className="verdict">
              <div>
                <h2>
                  {result.approved ? "Likely approved" : "Likely declined"}
                </h2>
                <p className="verdict-sub">
                  DTI ratio · {result.dti.toFixed(2)}
                </p>
              </div>
              <div className="score-block">
                <div className="score">
                  {result.score}
                  <span> / 100</span>
                </div>
                <div className="score-label">Composite score</div>
              </div>
            </div>

            <div className="breakdown">
              {result.parts.map((p) => (
                <div key={p.label}>
                  <div className="row-head">
                    <span className="row-label">{p.label}</span>
                    <span className="row-value">
                      {Math.round(p.points)} / {p.max}
                    </span>
                  </div>
                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${(p.points / p.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="footnote">
              <span>Approval threshold</span>
              <span>60 / 100</span>
            </div>
          </section>
        )}
      </main>
    </>
  );
}